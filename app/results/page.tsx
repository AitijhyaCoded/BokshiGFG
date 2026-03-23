'use client';

import { useEffect, useState, useMemo } from 'react';
import { Share2, ChevronDown, AlertCircle, CheckCircle2, Sparkles, FileText, Link as LinkIcon, RotateCcw, ShieldCheck, ShieldAlert, Shield, Fingerprint } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/components/ui/glass-card';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

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

  const highlightComponents = useMemo(() => {
    if (!data?.verifiedClaims) return {};

    return {
      p: ({ children }: any) => {
        if (typeof children !== 'string') return <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
        
        // Find and wrap claims in the text
        let result: (string | JSX.Element)[] = [children];
        
        data.verifiedClaims.forEach((claim: any) => {
          const newResult: (string | JSX.Element)[] = [];
          
          result.forEach((segment) => {
            if (typeof segment !== 'string') {
              newResult.push(segment);
              return;
            }

            // Simple exact match for now. In production, consider fuzzy matching or sentence splitting
            const claimText = claim.claim;
            const index = segment.indexOf(claimText);
            
            if (index !== -1) {
              const before = segment.substring(0, index);
              const match = segment.substring(index, index + claimText.length);
              const after = segment.substring(index + claimText.length);
              
              if (before) newResult.push(before);
              
              const isTrue = claim.status === "VERIFIED TRUE";
              const isPartial = claim.status === "PARTIALLY TRUE";
              
              const highlightClass = isTrue 
                ? "bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500/50" 
                : isPartial 
                  ? "bg-amber-500/20 text-amber-400 border-b-2 border-amber-500/50" 
                  : "bg-red-500/20 text-red-400 border-b-2 border-red-500/50";

              newResult.push(
                <span key={`${claim.claim}-${index}`} className={cn("px-1 py-0.5 rounded-sm transition-colors duration-300", highlightClass)}>
                  {match}
                </span>
              );
              
              if (after) newResult.push(after);
            } else {
              newResult.push(segment);
            }
          });
          
          result = newResult;
        });

        return <p className="mb-4 last:mb-0 leading-relaxed">{result}</p>;
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
                  animate={{ strokeDashoffset: 100 - data.accuracy }}
                  className={verdict.color}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{data.accuracy}%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Accuracy Score</p>
              <p className="text-xs text-slate-400">Based on {data.verifiedClaims?.length} verified claims</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10">
            <Share2 className="w-4 h-4 mr-2" /> Share Report
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
                const isFalse = claim.status === "VERIFIED FALSE";

                const colorClass = isTrue ? "text-emerald-400" : isPartial ? "text-amber-400" : "text-red-400";
                const borderClass = isTrue ? "border-emerald-500/20" : isPartial ? "border-amber-500/20" : "border-red-500/20";
                const bgClass = isTrue ? "bg-emerald-500/10" : isPartial ? "bg-amber-500/10" : "bg-red-500/10";
                
                const highlightClass = isTrue 
                  ? "bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-white" 
                  : isPartial 
                    ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-white" 
                    : "bg-gradient-to-r from-red-500/10 to-pink-500/10 text-white";

                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <GlassCard className={cn("p-5 border-l-2", isTrue ? "border-l-emerald-500" : isPartial ? "border-l-amber-500" : "border-l-red-500")}>
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
                  <p className="text-[8px] text-slate-500 leading-tight">
                    Likelihood that the content was generated by an AI.
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
        </div>
      </div>
      
      {/* Footer Branding */}
      <footer className="mt-12 flex items-center justify-center gap-12 pt-12 border-t border-white/5 text-[10px] uppercase tracking-[0.3em] font-black text-slate-800">
        <span>Bokshi Fact Engine v1.2</span>
        <span>Secure Verification</span>
        <span>Multimodal AI Layer</span>
      </footer>
    </div>
  );
}
