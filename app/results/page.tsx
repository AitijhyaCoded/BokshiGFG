'use client';

import { useEffect, useState } from 'react';
import { Share2, ChevronDown, AlertCircle, CheckCircle2, Sparkles, FileText, Link as LinkIcon, RotateCcw } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/components/ui/glass-card';
import { useRouter } from 'next/navigation';

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

  if (!data) return <div className="min-h-screen flex items-center justify-center text-white">Loading results...</div>;

  return (
    <div className="min-h-full p-8 lg:p-12 max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <header className="flex items-start justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
            <span>Reports</span>
            <span className="text-slate-700">&gt;</span>
            <span className="text-[#7dd3fc]">Analysis Complete</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Verification Results</h1>
          <p className="text-sm text-slate-400">Verified just now</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Accuracy</p>
              <p className="text-3xl font-bold text-white">{data.accuracy}<span className="text-lg text-slate-400">%</span></p>
            </div>
            {/* Circular Gauge Simulation */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeDasharray={`${Math.round(data.accuracy)}, 100`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">PS</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="rounded-xl">
            <Share2 className="w-4 h-4" /> Export
          </Button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Original Context */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8 h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7dd3fc]" /> Original Context
              </h2>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">{data.trueCount} TRUE</span>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">{data.partialCount} PARTIAL</span>
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">{data.falseCount} FALSE</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6">
              <p className="whitespace-pre-wrap">{data.originalText}</p>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Extracted Claims */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-[#7dd3fc]" /> Extracted Claims
          </h2>
          
          <div className="space-y-4 overflow-y-auto pr-2 pb-20 custom-scrollbar">
            {data.verifiedClaims?.map((claim: any, idx: number) => {
              const isTrue = claim.status === "VERIFIED TRUE";
              const isPartial = claim.status === "PARTIALLY TRUE";
              const isFalse = claim.status === "VERIFIED FALSE";

              const borderColor = isTrue ? "border-l-emerald-500" : isPartial ? "border-l-amber-500" : "border-l-red-500";
              const bgClass = isTrue ? "bg-emerald-500/10" : isPartial ? "bg-amber-500/10" : "bg-red-500/10";
              const textClass = isTrue ? "text-emerald-400" : isPartial ? "text-amber-400" : "text-red-400";
              const borderClass = isTrue ? "border-emerald-500/20" : isPartial ? "border-amber-500/20" : "border-red-500/20";

              return (
                <GlassCard key={idx} elevated className={`p-5 border-l-2 ${borderColor}`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-2 py-1 rounded ${bgClass} ${textClass} text-[10px] font-bold border ${borderClass}`}>
                      {claim.status}
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white leading-none">{claim.confidence}%</p>
                      <p className="text-[8px] uppercase tracking-wider text-slate-500">Confidence</p>
                    </div>
                  </div>
                  <p className="text-sm text-white font-medium mb-3">
                    "{claim.claim}"
                  </p>
                  {claim.reasoning && (
                    <p className="text-xs text-slate-400 mb-4 bg-black/20 p-3 rounded-lg border border-white/5">
                      {isFalse ? <AlertCircle className="w-4 h-4 text-red-400 inline mr-2" /> : null}
                      {claim.reasoning}
                    </p>
                  )}
                  
                  <div className="border-t border-white/5 pt-3">
                     <p className="text-xs font-medium text-slate-400 mb-2">SOURCES ({claim.sources?.length || 0})</p>
                    {claim.sources?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {claim.sources.map((src: any, sIdx: number) => (
                           <a key={sIdx} href={src.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors">
                             <LinkIcon className={`w-3 h-3 ${textClass}`} /> <span className="truncate">{src.title || src.url}</span>
                           </a>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              );
            })}
            
            {/* AI Reasoning Insight */}
            <GlassCard className="p-5 mt-6 bg-gradient-to-br from-[#c8a0f0]/10 to-transparent border-[#c8a0f0]/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#c8a0f0]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#c8a0f0]">AI Reasoning Insights</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {data.aiReasoning || "No general sentiment or bias reasoning provided."}
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
      
      {/* Floating Action */}
      <div className="fixed bottom-8 right-8 z-50">
        <button onClick={() => router.push('/')} className="w-12 h-12 rounded-full bg-[#7dd3fc] text-[#0a0e1a] flex items-center justify-center shadow-[0_0_30px_rgba(125,211,252,0.4)] hover:scale-105 transition-transform" aria-label="Restart Verification">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
