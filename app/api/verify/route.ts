import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifications } from '@/lib/schema';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';
import { TavilySearchAPIRetriever } from '@langchain/community/retrievers/tavily_search_api';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mode = body.mode || 'text';
    const input = body.input;

    if (!input) {
      return new Response(JSON.stringify({ error: 'No input provided' }), { status: 400 });
    }

    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        const sendStatus = (status: string) => {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', data: status }) + '\n'));
        };
        
        const sendLog = (log: string) => {
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'log', data: log }) + '\n'));
        };

        try {
          const gemini = new ChatGoogleGenerativeAI({
            model: 'gemini-3.1-flash-lite-preview',
            maxOutputTokens: 8192,
          });

          const cleanMarkdown = (aiMessage: any) => {
            const text = typeof aiMessage === 'string' ? aiMessage : aiMessage.content;
            return text.replace(/```(?:json)?\n?/gi, "").replace(/```\n?/gi, "").trim();
          };

          let textToVerify = input;
          let images: string[] = [];
          let originalContentToDisplay = textToVerify;

          if (mode === 'url') {
            sendStatus('extracting');
            sendLog('FETCHING URL CONTENT VIA TAVILY...');
            const tavilyRes = await fetch('https://api.tavily.com/extract', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                api_key: process.env.TAVILY_API_KEY, 
                urls: [input], 
                include_images: false 
              })
            });
            if (!tavilyRes.ok) throw new Error("Failed to fetch URL content");
            
            const tavilyData = await tavilyRes.json();
            const firstResult = tavilyData.results[0];
            textToVerify = firstResult.raw_content;
            
            // Specifically look for og:image in the <head>
            try {
              sendLog('EXTRACTING MAIN IMAGE (og:image)...');
              const pageRes = await fetch(input, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
              if (pageRes.ok) {
                const html = await pageRes.text();
                const ogImageRegex = /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i;
                const ogImageRegexAlt = /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i;
                const match = html.match(ogImageRegex) || html.match(ogImageRegexAlt);
                if (match && match[1]) {
                  images = [match[1]];
                }
              }
            } catch (e) {
              sendLog('FAILED TO EXTRACT MAIN IMAGE. SKIPPING.');
            }
            
            originalContentToDisplay = `Source: ${input}\n\n${textToVerify}`;
          } else if (mode === 'file') {
             textToVerify = `Extract claims from the provided ${body.fileType} document.`;
             originalContentToDisplay = `Uploaded Document: ${body.fileName}`;
             if (body.fileType?.startsWith('image/')) {
                 images.push(input);
             }
          }

          // 1. Extract Claims
          sendStatus('extracting');
          sendLog('INITIATING EXTRACTOR AGENT...');
          
          const extractParser = StructuredOutputParser.fromZodSchema(
            z.object({
              documentSummary: z.string().describe("A brief, 2-3 sentence summary of the provided text/document to be used as context"),
              cleanedContent: z.string().describe("The primary article body or document content, stripped of any navigation links, sidebars, footers, or repetitive metadata. If markdown links are present in the source, keep only the text part if they are navigational."),
              claims: z.array(z.string()).describe("List of top 3 to 5 most important, core, falsifiable claims made in the text")
            })
          );
          
          let promptText = `You are a fact-checking assistant. Your goal is to extract the core information from the provided input.\n\nCRITICAL: If the input contains web-scraped noise (like Wikipedia navigation menus, "Contribute" sections, "Main Page" links, sidebars, or footers), you MUST IGNORE them completely. Only extract the primary body text of the article or document.\n\n${extractParser.getFormatInstructions()}\n\n`;
          
          if (mode === 'text' || mode === 'url') {
            promptText += `Text:\n${textToVerify}`;
          } else {
            promptText += `Please analyze the attached document.`;
          }
          
          let extractMessages: any[];
          if (mode === 'file') {
            const base64Data = input.split(',')[1] || input;
            extractMessages = [
              { type: "text", text: promptText },
              { type: "media", mimeType: body.fileType, data: base64Data }
            ];
          } else {
            extractMessages = [
              { type: "text", text: promptText }
            ];
          }
          
          const extractChain = gemini.pipe(cleanMarkdown).pipe(extractParser);
          sendLog('PARSING TEXT FOR DISTINCT CLAIMS...');
          
          const { documentSummary, cleanedContent, claims } = await extractChain.invoke([
            new HumanMessage({ content: extractMessages })
          ]);
          
          if (mode === 'text') {
            originalContentToDisplay = textToVerify;
          } else if (mode === 'file') {
            originalContentToDisplay = `## Uploaded Document Summary\n\n${documentSummary}\n\n## Content Preview\n\n${cleanedContent}`;
          } else if (mode === 'url') {
            originalContentToDisplay = cleanedContent;
          }
          
          sendLog(`EXTRACTED ${claims.length} CLAIMS.`);

          // 2. Search Web
          sendStatus('searching');
          sendLog('INITIALIZING WEB SEARCH MODULE...');
          
          let tavily;
          try {
            tavily = new TavilySearchAPIRetriever({ k: 3 });
          } catch(e) {
            sendLog('TAVILY TOOL INITIALIZATION FAILED, CHECKING API KEY OR DEPENDENCIES...');
             throw new Error("Failed to initialize Tavily.");
          }
          
          const searchContexts = [];
          for (const claim of claims) {
            sendLog(`SEARCHING FOR: "${claim.substring(0, 30)}..."`);
            try {
              const resultsStr = await tavily.invoke(claim);
              const results = typeof resultsStr === 'string' ? JSON.parse(resultsStr) : resultsStr;
              searchContexts.push({ claim, results });
            } catch (e) {
              sendLog(`SEARCH FAILED FOR CLAIM. SKIPPING.`);
            }
          }
          sendLog('GATHERED SECONDARY CONTEXT FROM TAVILY.');

          // 3. AI Detection (Bonus)
          const aiDetectionParser = StructuredOutputParser.fromZodSchema(
            z.object({
              probability: z.number().describe("Probability score (0-100%) indicating if it is AI-generated"),
              reasoning: z.string().describe("A 2-sentence reasoning for the score")
            })
          );

          const aiDetectionPrompt = PromptTemplate.fromTemplate(
            `Analyze this text for AI generation markers, such as low perplexity, lack of burstiness (uniform sentence length), and common LLM tropes. Return a probability score (0-100%) indicating if it is AI-generated, and a 2-sentence reasoning.

            {format_instructions}

            Text:
            {text}`
          );

          const aiDetectionChain = aiDetectionPrompt.pipe(gemini).pipe(cleanMarkdown).pipe(aiDetectionParser);
          
          sendLog('PERFORMING AI FORENSICS ANALYSIS...');
          const aiDetectionResult = await aiDetectionChain.invoke({
            text: cleanedContent || textToVerify,
            format_instructions: aiDetectionParser.getFormatInstructions()
          });

          // 3.5 Image Analysis
          let imageAnalysisResult = null;
          if (images.length > 0) {
            sendLog('PERFORMING IMAGE FORENSICS ANALYSIS...');
            
            const imageAnalysisParser = StructuredOutputParser.fromZodSchema(
              z.object({
                aiProbability: z.number().describe("Probability score (0-100%) indicating if the image is AI-generated or deepfake"),
                deepfake: z.boolean().describe("Whether the image is suspected to be a deepfake"),
                relevance: z.number().describe("Score 0-100 indicating relevance of the image to the overall context/article"),
                reasoning: z.string().describe("A 2-3 sentence reasoning for the image analysis")
              })
            );

            const imageAnalysisPrompt = `Analyze the provided image in the context of the following text. 
Check for signs of AI generation, indicators of deepfake, and assess how relevant the image is to the context.

Context:
${documentSummary || textToVerify}

${imageAnalysisParser.getFormatInstructions()}`;

            let imageMessages: any[] = [ { type: "text", text: imageAnalysisPrompt } ];
            
            const imgUrlOrData = images[0];
            if (imgUrlOrData.startsWith('data:')) {
               const mimeType = imgUrlOrData.split(';')[0].split(':')[1];
               const base64Data = imgUrlOrData.split(',')[1];
               imageMessages.push({ type: "media", mimeType, data: base64Data });
            } else if (imgUrlOrData.startsWith('http')) {
               try {
                 sendLog('FETCHING IMAGE FOR ANALYSIS...');
                 const imgRes = await fetch(imgUrlOrData, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } });
                 if (imgRes.ok) {
                   const arrayBuffer = await imgRes.arrayBuffer();
                   const buffer = Buffer.from(arrayBuffer);
                   const base64Data = buffer.toString('base64');
                   const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
                   if (mimeType.startsWith('image/')) {
                       imageMessages.push({ type: "media", mimeType, data: base64Data });
                   } else {
                       sendLog('URL IS NOT AN IMAGE.');
                   }
                 }
               } catch (e) {
                 sendLog('FAILED TO FETCH IMAGE FOR ANALYSIS.');
               }
            }

            if (imageMessages.length > 1) {
              try {
                const imgChain = gemini.pipe(cleanMarkdown).pipe(imageAnalysisParser);
                imageAnalysisResult = await imgChain.invoke([ new HumanMessage({ content: imageMessages }) ]);
                sendLog('IMAGE ANALYSIS COMPLETE.');
              } catch(e) {
                sendLog('IMAGE ANALYSIS FAILED.');
                console.error(e);
              }
            }
          }

          // 4. Verify
          sendStatus('verifying');
          sendLog('CROSS-REFERENCING EXTRACTED CLAIMS WITH SEARCH CONTEXT...');

          const verifyParser = StructuredOutputParser.fromZodSchema(
            z.object({
              aiReasoning: z.string().describe("AI's reasoning regarding the bias or general certainty of the source"),
              verifiedClaims: z.array(z.object({
                claim: z.string().describe("The original claim"),
                status: z.enum(["VERIFIED TRUE", "PARTIALLY TRUE", "VERIFIED FALSE", "UNVERIFIABLE"]),
                confidence: z.number().describe("Confidence score 0 to 100"),
                reasoning: z.string().describe("Why the claim is graded this way"),
                sources: z.array(z.object({
                  title: z.string(),
                  url: z.string()
                }))
              }))
            })
          );

          const verifyPrompt = PromptTemplate.fromTemplate(
            `You are a verification assistant. I will provide a list of claims and corresponding search results for each claim.
  Grade each claim based STRICTLY on the search contexts provided as VERIFIED TRUE, PARTIALLY TRUE, VERIFIED FALSE, or UNVERIFIABLE.
  If there is completely insufficient evidence or no sources supporting or refuting the claim, grade it as UNVERIFIABLE.
  CRITICAL RULES FOR "UNVERIFIABLE":
  1. If there is completely insufficient evidence or no sources supporting or refuting the claim, grade it as UNVERIFIABLE.
  2. If a claim is a subjective opinion, a matter of personal taste, or a philosophical belief, you MUST grade it as UNVERIFIABLE.
  3. If a claim is a prediction about the future that fundamentally cannot be proven with current historical or scientific facts, you MUST grade it as UNVERIFIABLE.
  Give it a confidence score mapping to your certainty level (0 to 100).
  Provide reasoning and strictly cite sources using the titles and urls provided in the context. If no sources support the claim, or if no context exists, explicitly state lack of evidence.
  Provide general AI reasoning on the tone or potential bias.

  {format_instructions}

  Original Text:
  {text}

  Claims and Context:
  {context}
  `
          );

          const contextStr = JSON.stringify(searchContexts, null, 2);
          const verifyChain = verifyPrompt.pipe(gemini).pipe(cleanMarkdown).pipe(verifyParser);
          
          sendLog('ANALYZING SENTIMENT, BIAS AND COMPLETING VERIFICATION...');
          
          const finalOutput = await verifyChain.invoke({
            text: documentSummary || textToVerify,
            context: contextStr,
            format_instructions: verifyParser.getFormatInstructions()
          });

          // Programmatically calculate counts and accuracy to prevent AI hallucinations
          const verifiedClaimsList = finalOutput.verifiedClaims || [];
          const trueCount = verifiedClaimsList.filter((c: any) => c.status === "VERIFIED TRUE").length;
          const partialCount = verifiedClaimsList.filter((c: any) => c.status === "PARTIALLY TRUE").length;
          const falseCount = verifiedClaimsList.filter((c: any) => c.status === "VERIFIED FALSE").length;
          const unverifiableCount = verifiedClaimsList.filter((c: any) => c.status === "UNVERIFIABLE").length;
          const totalClaims = verifiedClaimsList.length;

          // Calculate verifiable counts (exclude opinions from the math!)
          const verifiableCount = trueCount + partialCount + falseCount;

          // Accuracy Calculation: Only grade the claims that CAN be verified
          const accuracy = verifiableCount > 0 
            ? Math.round(((trueCount * 100) + (partialCount * 50)) / verifiableCount) 
            : 0;

          // Check if majority (>50%) of the extracted claims are labeled UNVERIFIABLE
          const isUnverifiableMajority = unverifiableCount > (totalClaims / 2);

          // Embed original text in the payload for the results page
          const finalPayload = {
            ...finalOutput,
            accuracy,
            trueCount,
            partialCount,
            falseCount,
            unverifiableCount,
            isUnverifiableMajority,
            originalText: originalContentToDisplay,
            images: images,
            aiDetection: aiDetectionResult,
            imageAnalysis: imageAnalysisResult
          };

          sendLog('VERIFICATION COMPLETE. FINALIZING PAYLOAD...');
          sendLog('SAVING TO DATABASE...');
          
          try {
            await db.insert(verifications).values({
              originalText: String(originalContentToDisplay || '').replace(/\x00/g, ''),
              accuracy: accuracy,
              trueCount: trueCount,
              partialCount: partialCount,
              falseCount: falseCount,
              unverifiableCount: unverifiableCount,
              aiReasoning: String(finalOutput.aiReasoning || '').replace(/\x00/g, ''),
              verifiedClaims: finalOutput.verifiedClaims || [],
            });
            sendLog('SAVED TO NEON DB.');
          } catch (e: any) {
             console.error('DATABASE INSERT ERROR:', e);
             sendLog(`ERROR SAVING TO DB: ${e.message}`);
          }

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'result', data: finalPayload }) + '\n'));
          controller.close();
        } catch (error: any) {
          const rawMsg = error.message || String(error);
          const safeMsg = rawMsg.length > 250 ? rawMsg.substring(0, 250) + '... [Truncated due to length]' : rawMsg;
          sendLog(`ERROR: ${safeMsg}`);
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', data: safeMsg }) + '\n'));
          controller.close();
        }
      }
    });

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch(e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
