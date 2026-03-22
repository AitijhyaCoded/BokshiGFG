import { NextRequest } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { TavilySearchAPIRetriever } from '@langchain/community/retrievers/tavily_search_api';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'No text provided' }), { status: 400 });
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
            model: 'gemini-2.5-flash',
            maxOutputTokens: 8192,
          });

          const cleanMarkdown = (aiMessage: any) => {
            const text = typeof aiMessage === 'string' ? aiMessage : aiMessage.content;
            return text.replace(/```(?:json)?\n?/gi, "").replace(/```\n?/gi, "").trim();
          };

          // 1. Extract Claims
          sendStatus('extracting');
          sendLog('INITIATING EXTRACTOR AGENT...');
          
          const extractParser = StructuredOutputParser.fromZodSchema(
            z.object({
              claims: z.array(z.string()).describe("List of core core, falsifiable claims made in the text")
            })
          );
          
          const extractPrompt = PromptTemplate.fromTemplate(
            "You are a fact-checking assistant. Extract the distinct, verifyable claims from the following text.\n{format_instructions}\n\nText:\n{text}"
          );
          
          const extractChain = extractPrompt.pipe(gemini).pipe(cleanMarkdown).pipe(extractParser);
          sendLog('PARSING TEXT FOR DISTINCT CLAIMS...');
          
          const { claims } = await extractChain.invoke({
            text,
            format_instructions: extractParser.getFormatInstructions(),
          });
          
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

          // 3. Verify
          sendStatus('verifying');
          sendLog('CROSS-REFERENCING EXTRACTED CLAIMS WITH SEARCH CONTEXT...');

          const verifyParser = StructuredOutputParser.fromZodSchema(
            z.object({
              accuracy: z.number().describe("Total accuracy percentage 0 to 100"),
              trueCount: z.number().describe("Number of verified true claims"),
              partialCount: z.number().describe("Number of partially true claims"),
              falseCount: z.number().describe("Number of verified false claims"),
              aiReasoning: z.string().describe("AI's reasoning regarding the bias or general certainty of the source"),
              verifiedClaims: z.array(z.object({
                claim: z.string().describe("The original claim"),
                status: z.enum(["VERIFIED TRUE", "PARTIALLY TRUE", "VERIFIED FALSE"]),
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
  Grade each claim based STRICTLY on the search contexts provided as VERIFIED TRUE, PARTIALLY TRUE, or VERIFIED FALSE.
  Give it a confidence score mapping to your certainty level (0 to 100).
  Provide reasoning and strictly cite sources using the titles and urls provided in the context. If no sources support the claim, or if no context exists, explicitly state lack of evidence.
  Calculate the overall accuracy based on the findings.
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
            text,
            context: contextStr,
            format_instructions: verifyParser.getFormatInstructions()
          });

          // Embed original text in the payload for the results page
          const finalPayload = {
            ...finalOutput,
            originalText: text
          };

          sendLog('VERIFICATION COMPLETE. FINALIZING PAYLOAD...');

          controller.enqueue(encoder.encode(JSON.stringify({ type: 'result', data: finalPayload }) + '\n'));
          controller.close();
        } catch (error: any) {
          sendLog(`ERROR: ${error.message}`);
          controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', data: error.message }) + '\n'));
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
