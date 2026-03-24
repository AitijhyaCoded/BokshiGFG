'use client';

import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

import { useEffect, useState, useMemo, useRef } from 'react';
import { Share2, ChevronDown, AlertCircle, CheckCircle2, Sparkles, FileText, Link as LinkIcon, RotateCcw, ShieldCheck, ShieldAlert, Shield, Fingerprint, Image as ImageIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/components/ui/glass-card';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    if (!reportRef.current || !data) return;
    setIsGeneratingPDF(true);

    try {
      const element = reportRef.current;
      const imgData = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const width = element.offsetWidth;
      const height = element.offsetHeight;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [width, height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('Bokshi_Verification_Report.pdf');
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    const rawData = sessionStorage.getItem('verifyResult');
    if (rawData) {
      try {
        setData(JSON.parse(rawData));
      } catch (e) {
        console.error("Failed to parse result data", e);
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const calculateOverlap = (s1: string, s2: string) => {
    const words1 = new Set(s1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
    const words2 = new Set(s2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
    if (words1.size === 0 || words2.size === 0) return 0;

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    return intersection.size / Math.max(words1.size, words2.size);
  };

  const highlightComponents = useMemo(() => {
    if (!data?.verifiedClaims) return {};

    return {
      p: ({ children }: any) => {
        // Handle both string and array of children (to support nested Markdown like bold text)
        const childrenArray = Array.isArray(children) ? children : [children];

        const processedChildren = childrenArray.flatMap((child, childIdx) => {
          if (typeof child !== 'string') return child;

          // Split paragraph text into sentences
          // This regex splits by sentence-ending punctuation followed by space or end of string
          const sentences = child.match(/[^.!?]+[.!?]*\s*/g) || [child];

          return sentences.map((sentence, sentIdx) => {
            // Find best matching claim for this sentence
            let bestMatch: any = null;
            let maxOverlap = 0;

            data.verifiedClaims.forEach((claim: any) => {
              const overlap = calculateOverlap(sentence, claim.claim);
              // Threshold of 0.45 (45% word overlap) usually works well for paraphrased sentences
              if (overlap > 0.45 && overlap > maxOverlap) {
                maxOverlap = overlap;
                bestMatch = claim;
              }
            });

            if (bestMatch) {
              const isTrue = bestMatch.status === "VERIFIED TRUE";
              const isPartial = bestMatch.status === "PARTIALLY TRUE";
              const isUnverifiable = bestMatch.status === "UNVERIFIABLE";

              const highlightClass = isTrue
                ? "bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500/50"
                : isPartial
                  ? "bg-amber-500/20 text-amber-400 border-b-2 border-amber-500/50"
                  : isUnverifiable
                    ? "bg-slate-500/20 text-slate-400 border-b-2 border-slate-500/50"
                    : "bg-red-500/20 text-red-400 border-b-2 border-red-500/50";

              return (
                <span key={`${childIdx}-${sentIdx}`} className={cn("px-1 py-0.5 rounded-sm transition-colors duration-300", highlightClass)}>
                  {sentence}
                </span>
              );
            }
            return sentence;
          });
        });

        return <p className="mb-4 last:mb-0 leading-relaxed">{processedChildren}</p>;
      }
    };
  }, [data?.verifiedClaims]);

  if (!data) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white gap-4 bg-[#050810]">
      <div className="w-12 h-12 border-4 border-[#7dd3fc]/20 border-t-[#7dd3fc] rounded-full animate-spin" />
      <p className="text-slate-400 font-medium animate-pulse">Reconstructing verification data...</p>
    </div>
  );

  const getVerdict = () => {
    if (data.isUnverifiableMajority) {
      return { 
        label: "UNVERIFIABLE", 
        color: "text-slate-400", 
        bg: "bg-slate-500/10", 
        border: "border-slate-500/20", 
        icon: Shield, 
        glow: "shadow-none" 
      };
    }
    const acc = data.accuracy || 0;
    if (acc >= 80) return { label: "HIGHLY RELIABLE", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: ShieldCheck, glow: "shadow-[0_0_30px_rgba(16,185,129,0.2)]" };
    if (acc >= 50) return { label: "MIXED SIGNALS", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Shield, glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]" };
    return { label: "POTENTIALLY DECEPTIVE", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: ShieldAlert, glow: "shadow-[0_0_30px_rgba(239,68,68,0.2)]" };
  };

  const verdict = getVerdict();

  return (
    <div className="min-h-full p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-8 pb-24">
      {/* Top Banner / Verdict */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
          <div className={cn("px-6 py-3 rounded-2xl border flex items-center gap-3", verdict.bg, verdict.color, verdict.border, verdict.glow)}>
            <verdict.icon className="w-6 h-6" />
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-80">Final Verdict</p>
              <h2 className="text-xl font-bold">{verdict.label}</h2>
            </div>
          </div>

          <div className="h-12 w-px bg-white/10 hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3"
                  strokeDasharray="100, 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: data.isUnverifiableMajority ? 100 : 100 - data.accuracy }}
                  className={cn(verdict.color, data.isUnverifiableMajority && "text-slate-700")}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-sm font-bold", data.isUnverifiableMajority ? "text-slate-500" : "text-white")}>
                  {data.isUnverifiableMajority ? "N/A" : `${data.accuracy}%`}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Accuracy Score</p>
              <p className="text-xs text-slate-400">
                {data.isUnverifiableMajority 
                  ? "Majority subjective content" 
                  : `Based on ${data.trueCount + data.partialCount + data.falseCount} verifiable claims`
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            variant="secondary"
            className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
          >
            {isGeneratingPDF ? (
              <div className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            {isGeneratingPDF ? 'Generating...' : 'Share Report'}
          </Button>
          <Button onClick={() => router.push('/')} className="rounded-xl bg-[#7dd3fc] text-[#0a0e1a] hover:bg-[#7dd3fc]/90">
            <RotateCcw className="w-4 h-4 mr-2" /> New Check
          </Button>
        </div>
      </motion.div>

      {/* Original Context Card - Now Full Width */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wide">
              <FileText className="w-4 h-4 text-[#7dd3fc]" /> Original Material
            </h2>
            <div className="flex gap-4 text-[10px] items-center">
              <span className="text-emerald-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {data.trueCount} Verified</span>
              <span className="text-amber-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {data.partialCount} Mixed</span>
              <span className="text-red-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /> {data.falseCount} Disproven</span>
              {data.unverifiableCount > 0 && <span className="text-slate-400 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> {data.unverifiableCount} Unverifiable</span>}
            </div>
          </div>

          <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar bg-black/20">
            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[#7dd3fc] prose-a:text-[#7dd3fc] prose-strong:text-white">
              <ReactMarkdown components={highlightComponents}>{data.originalText}</ReactMarkdown>
            </div>

            {data.images && data.images.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  Supporting Media
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.images.map((img: string, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="group relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-[#0a0e1a] flex items-center justify-center cursor-pointer shadow-xl"
                    >
                      <img
                        src={img}
                        alt={`Supporting visual ${idx + 1}`}
                        className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Results Grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Claims */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Factual claims</h2>
            <span className="text-xs text-slate-500 font-mono">{data.verifiedClaims?.length} detected</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {data.verifiedClaims?.map((claim: any, idx: number) => {
                const isTrue = claim.status === "VERIFIED TRUE";
                const isPartial = claim.status === "PARTIALLY TRUE";
                const isUnverifiable = claim.status === "UNVERIFIABLE";
                const isFalse = claim.status === "VERIFIED FALSE";

                const colorClass = isTrue ? "text-emerald-400" : isPartial ? "text-amber-400" : isUnverifiable ? "text-slate-400" : "text-red-400";
                const borderClass = isTrue ? "border-emerald-500/20" : isPartial ? "border-amber-500/20" : isUnverifiable ? "border-slate-500/20" : "border-red-500/20";
                const bgClass = isTrue ? "bg-emerald-500/10" : isPartial ? "bg-amber-500/10" : isUnverifiable ? "bg-slate-500/10" : "bg-red-500/10";

                const highlightClass = isTrue
                  ? "bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-white"
                  : isPartial
                    ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-white"
                    : isUnverifiable
                      ? "bg-gradient-to-r from-slate-500/10 to-gray-500/10 text-white"
                      : "bg-gradient-to-r from-red-500/10 to-pink-500/10 text-white";

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <GlassCard className={cn("p-5 border-l-2", isTrue ? "border-l-emerald-500" : isPartial ? "border-l-amber-500" : isUnverifiable ? "border-l-slate-500" : "border-l-red-500")}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={cn("text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border", colorClass, borderClass, bgClass)}>
                          {claim.status}
                        </span>
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-white leading-none">{claim.confidence}%</span>
                          <span className="text-[8px] uppercase tracking-tighter text-slate-500 font-bold">Certainty</span>
                        </div>
                      </div>

                      <div className={cn("p-4 rounded-xl mb-4 shadow-sm", highlightClass)}>
                        <p className="text-sm font-semibold leading-relaxed">
                          "{claim.claim}"
                        </p>
                      </div>

                      <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
                        <p className="text-[10px] text-slate-300 leading-relaxed italic">
                          {claim.reasoning}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                          {claim.sources?.map((src: any, sIdx: number) => (
                            <a
                              key={sIdx}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[8px] font-bold text-slate-400 hover:text-white bg-white/5 px-2 py-1 rounded-md border border-white/5 transition-colors"
                            >
                              <LinkIcon className="w-2.5 h-2.5" />
                              <span className="max-w-[80px] truncate">{src.title || "External Source"}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Insights & Forensics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Forensics Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6 bg-gradient-to-br from-[#7dd3fc]/10 via-transparent to-transparent border-[#7dd3fc]/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#7dd3fc]/10 rounded-full blur-3xl group-hover:bg-[#7dd3fc]/20 transition-colors" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-[#7dd3fc]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#7dd3fc]">Forensics</h3>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="16" fill="none" stroke="#7dd3fc" strokeWidth="3"
                      strokeDasharray="100, 100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - (data.aiDetection?.probability || 0) }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-white">{data.aiDetection?.probability || 0}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">AI Probability</p>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Likelihood that the content was AI generated.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* AI Insight Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6 bg-gradient-to-br from-[#c8a0f0]/10 via-transparent to-transparent border-[#c8a0f0]/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#c8a0f0]/10 rounded-full blur-3xl group-hover:bg-[#c8a0f0]/20 transition-colors" />
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#c8a0f0]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#c8a0f0]">AI Insight</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {data.aiDetection?.reasoning || data.aiReasoning || "No comprehensive AI analysis was generated for this dataset."}
              </p>
            </GlassCard>
          </motion.div>

          {/* Image Insight Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <GlassCard className="p-6 bg-gradient-to-br from-[#f472b6]/10 via-transparent to-transparent border-[#f472b6]/20 relative overflow-hidden group flex flex-col gap-4">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#f472b6]/10 rounded-full blur-3xl group-hover:bg-[#f472b6]/20 transition-colors" />
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <ImageIcon className="w-4 h-4 text-[#f472b6]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#f472b6]">Image Insights</h3>
              </div>

              {data.images && data.images.length > 0 ? (
                data.imageAnalysis ? (
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                          <motion.circle
                            cx="18" cy="18" r="16" fill="none" stroke="#f472b6" strokeWidth="3"
                            strokeDasharray="100, 100"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 100 - data.imageAnalysis.aiProbability }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-bold text-white">{data.imageAnalysis.aiProbability}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">AI Gen Prob.</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 flex-wrap">
                          Context Relevance: <span className="text-white font-medium">{data.imageAnalysis.relevance}%</span>
                          {data.imageAnalysis.deepfake && <span className="text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-500/30 bg-red-500/10 text-[8px] mt-1 block w-fit">Deepfake suspected</span>}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-white/5">
                      {data.imageAnalysis.reasoning}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic relative z-10">Image analysis unavailable.</p>
                )
              ) : (
                <div className="flex items-center justify-center h-20 border border-dashed border-white/10 rounded-xl bg-black/20 relative z-10">
                  <p className="text-xs text-slate-500 italic">No image</p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-12 flex items-center justify-center gap-12 pt-12 border-t border-white/5 text-[10px] uppercase tracking-[0.3em] font-black text-slate-800">
        <span>Bokshi Fact Engine v1.2</span>
        <span>Secure Verification</span>
        <span>Multimodal AI Layer</span>
      </footer>

      {/* Hidden Printable Report */}
      <div className="fixed top-0 left-0 w-[800px] -z-50 opacity-0 pointer-events-none">
        <div ref={reportRef} className="bg-white text-slate-900 p-12 w-[800px] flex flex-col gap-8 font-sans">
          {/* Header */}
          <div className="flex border-b pb-6 border-slate-200 justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Bokshi Fact Engine</h1>
              <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">AI Verification Report</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0ea5e9]">Accuracy Score</p>
              <p className={cn("text-4xl font-black -mt-1", data.isUnverifiableMajority ? "text-slate-300" : "text-[#0ea5e9]")}>
                {data.isUnverifiableMajority ? "N/A" : `${data.accuracy}%`}
              </p>
            </div>
          </div>

          {/* Verdict Segment */}
          <div className={cn(
            "p-6 rounded-xl border",
            data.isUnverifiableMajority 
              ? "bg-slate-50 border-slate-200 text-slate-600" 
              : verdict.label === 'HIGHLY RELIABLE' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : verdict.label === 'MIXED SIGNALS' 
                  ? 'bg-amber-50 border-amber-200 text-amber-900' 
                  : 'bg-red-50 border-red-200 text-red-900'
          )}>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Final Verdict</p>
            <h2 className="text-2xl font-black">{verdict.label}</h2>
          </div>

          {/* Original Context */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2">Original Material</h3>
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-200 prose prose-sm max-w-none">
              <ReactMarkdown>{data.originalText}</ReactMarkdown>
            </div>

            {data.images && data.images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Supporting Media</h4>
                <div className="grid grid-cols-2 gap-4">
                  {data.images.map((img: string, idx: number) => (
                    img.startsWith('data:') ? (
                      <img key={idx} src={img} className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm" alt="Supporting media" />
                    ) : (
                      <div key={idx} className="w-full h-48 rounded-xl border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-4 text-center shadow-sm">
                        <ImageIcon className="w-6 h-6 text-slate-300 mb-2" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">External Media Omitted<br />(View in Web)</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI and Image Insights */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-[10px] font-black text-purple-900 uppercase tracking-widest mb-3">AI Forensics</h3>
              <p className="text-3xl font-black text-purple-600 mb-2">{data.aiDetection?.probability || 0}% <span className="text-xs text-purple-800 font-bold uppercase tracking-wider">AI Gen Prob</span></p>
              <p className="text-xs text-purple-800 leading-relaxed font-medium">{data.aiDetection?.reasoning || data.aiReasoning || "No insights available."}</p>
            </div>

            {data.images && data.images.length > 0 && data.imageAnalysis ? (
              <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                <h3 className="text-[10px] font-black text-pink-900 uppercase tracking-widest mb-3">Image Insights</h3>
                <p className="text-3xl font-black text-pink-600 mb-2">{data.imageAnalysis?.aiProbability || 0}% <span className="text-xs text-pink-800 font-bold uppercase tracking-wider">AI Gen Prob</span></p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-pink-800 font-bold bg-white/50 px-2 py-1 rounded">Relevance: {data.imageAnalysis.relevance}%</span>
                  {data.imageAnalysis.deepfake && <span className="text-[10px] font-black uppercase text-red-600 border border-red-300 bg-red-100 px-2 py-1 rounded">Deepfake</span>}
                </div>
                <p className="text-xs text-pink-800 leading-relaxed font-medium">{data.imageAnalysis.reasoning}</p>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Image Analytics</p>
              </div>
            )}
          </div>

          {/* Claims */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2">Investigated Claims</h3>
            <div className="space-y-4">
              {data.verifiedClaims?.map((claim: any, idx: number) => {
                const isTrue = claim.status === "VERIFIED TRUE";
                const isPartial = claim.status === "PARTIALLY TRUE";
                const isUnverifiable = claim.status === "UNVERIFIABLE";
                const colorClass = isTrue ? "text-emerald-900 bg-emerald-50 border-emerald-200" : isPartial ? "text-amber-900 bg-amber-50 border-amber-200" : isUnverifiable ? "text-slate-900 bg-slate-50 border-slate-200" : "text-red-900 bg-red-50 border-red-200";

                return (
                  <div key={idx} className={`p-5 rounded-xl border ${colorClass}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm ${isTrue ? 'bg-emerald-500 text-white' : isPartial ? 'bg-amber-500 text-white' : isUnverifiable ? 'bg-slate-500 text-white' : 'bg-red-500 text-white'}`}>
                        {claim.status}
                      </span>
                      <span className="text-xs font-black uppercase tracking-widest opacity-60">{claim.confidence}% Certainty</span>
                    </div>
                    <p className="font-bold text-sm mb-3">"{claim.claim}"</p>
                    <p className="text-xs opacity-80 mb-4 leading-relaxed font-medium">{claim.reasoning}</p>

                    {claim.sources?.length > 0 && (
                      <div className="pt-3 border-t border-black/10 flex flex-col gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Cited Sources</span>
                        <div className="flex flex-wrap gap-2">
                          {claim.sources.map((src: any, sIdx: number) => (
                            <div key={sIdx} className="text-[9px] font-bold bg-white px-2.5 py-1 rounded shadow-sm border border-black/5 text-slate-700 max-w-[300px] truncate">
                              {src.title || src.url}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-8 border-t border-slate-200 pb-4">
            <span className="text-[9px] font-black tracking-[0.3em] uppercase opacity-30">Rendered via Agentic System</span>
          </div>
        </div>
      </div>
    </div>
  );
}
