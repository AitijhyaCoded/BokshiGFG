'use client';

import { Share2, ChevronDown, AlertCircle, CheckCircle2, Sparkles, FileText, Link as LinkIcon, RotateCcw } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/components/ui/glass-card';

export default function ResultsPage() {
  return (
    <div className="min-h-full p-8 lg:p-12 max-w-7xl mx-auto flex flex-col">
      {/* Header */}
      <header className="flex items-start justify-between mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">
            <span>Reports</span>
            <span className="text-slate-700">&gt;</span>
            <span className="text-[#7dd3fc]">Article Analysis #8842</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">The Future of Decentralized Energy</h1>
          <p className="text-sm text-slate-400">Verified on October 24, 2023 • Source: TechFrontier Journal</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Total Accuracy</p>
              <p className="text-3xl font-bold text-white">84<span className="text-lg text-slate-400">%</span></p>
            </div>
            {/* Circular Gauge Simulation */}
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#7dd3fc" strokeWidth="3" strokeDasharray="84, 100" />
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
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">4 TRUE</span>
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">2 PARTIAL</span>
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">1 FALSE</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6">
              <p>
                The global energy landscape is undergoing a radical shift. <span className="bg-emerald-500/20 border-b border-emerald-500 text-emerald-100 px-1 rounded-sm cursor-pointer hover:bg-emerald-500/30 transition-colors">Recent data suggests that solar and wind generation accounted for over 12% of global electricity last year, a record high that signals the beginning of the end for fossil fuel dominance.</span>
              </p>
              <p>
                However, critics argue that the transition is too slow to meet the Paris Agreement targets. <span className="bg-red-500/20 border-b border-red-500 text-red-100 px-1 rounded-sm cursor-pointer hover:bg-red-500/30 transition-colors">Current projections indicate that at the current rate of investment, zero emissions won't be achieved until 2150. This alarming statistic has prompted calls for a tripling of green financing.</span>
              </p>
              <p>
                <span className="bg-amber-500/20 border-b border-amber-500 text-amber-100 px-1 rounded-sm cursor-pointer hover:bg-amber-500/30 transition-colors">While China leads in production, Europe is the primary consumer of high-efficiency photovoltaic cells. This geopolitical imbalance creates a complex supply chain risk</span> that many manufacturers are only now beginning to hedge against with domestic production facilities.
              </p>

              {/* Visual Context Placeholder */}
              <div className="mt-8 rounded-xl overflow-hidden relative h-48 border border-white/10">
                <img src="https://picsum.photos/seed/wind/800/400" alt="Wind turbines" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1524] to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc] mb-1">Visual Context</p>
                  <p className="text-sm font-medium text-white">Growth of Renewable Infrastructure 2018-2023</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Extracted Claims */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-[#7dd3fc]" /> Extracted Claims
          </h2>
          
          <div className="space-y-4 overflow-y-auto pr-2 pb-20 custom-scrollbar">
            {/* Claim 1: True */}
            <GlassCard elevated className="p-5 border-l-2 border-l-emerald-500">
              <div className="flex items-start justify-between mb-4">
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">VERIFIED TRUE</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white leading-none">98%</p>
                  <p className="text-[8px] uppercase tracking-wider text-slate-500">Confidence</p>
                </div>
              </div>
              <p className="text-sm text-white font-medium mb-4">
                "Solar and wind generation accounted for over 12% of global electricity last year..."
              </p>
              <div className="border-t border-white/5 pt-3">
                <button className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-white transition-colors">
                  <span>SOURCES (3)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3 space-y-2">
                   <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 p-2 rounded-lg">
                     <LinkIcon className="w-3 h-3 text-emerald-400" /> IEA Global Energy Review 2023
                   </div>
                </div>
              </div>
            </GlassCard>

            {/* Claim 2: Partial */}
            <GlassCard elevated className="p-5 border-l-2 border-l-amber-500">
              <div className="flex items-start justify-between mb-4">
                <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">PARTIALLY TRUE</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white leading-none">64%</p>
                  <p className="text-[8px] uppercase tracking-wider text-slate-500">Confidence</p>
                </div>
              </div>
              <p className="text-sm text-white font-medium mb-3">
                "While China leads in production, Europe is the primary consumer of high-efficiency cells..."
              </p>
              <p className="text-xs text-slate-400 mb-4 bg-black/20 p-3 rounded-lg border border-white/5">
                Finding: China also consumes ~34% of global high-efficiency PV production, surpassing Europe's current import rate.
              </p>
              <div className="border-t border-white/5 pt-3">
                <button className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-white transition-colors">
                  <span>SOURCES (2)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>

            {/* Claim 3: False */}
            <GlassCard elevated className="p-5 border-l-2 border-l-red-500">
              <div className="flex items-start justify-between mb-4">
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">VERIFIED FALSE</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white leading-none">92%</p>
                  <p className="text-[8px] uppercase tracking-wider text-slate-500">Confidence</p>
                </div>
              </div>
              <p className="text-sm text-white font-medium mb-4">
                "Projections indicate... zero emissions won't be achieved until 2150."
              </p>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 flex gap-3 items-start">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-200 leading-relaxed">
                  The 2150 date is based on a debunked linear-extrapolation model. IPCC 2024 models suggest a 2065-2080 window.
                </p>
              </div>

              <div className="border-t border-white/5 pt-3">
                <button className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-white transition-colors">
                  <span>SOURCES (5)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
            
            {/* AI Reasoning Insight */}
            <GlassCard className="p-5 mt-6 bg-gradient-to-br from-[#c8a0f0]/10 to-transparent border-[#c8a0f0]/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#c8a0f0]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#c8a0f0]">AI Reasoning Insights</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                The text exhibits high linguistic certainty (92%) which often correlates with biased source reporting in technical energy journalism.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600" />
                  <div className="w-6 h-6 rounded-full bg-slate-600 border border-slate-500" />
                </div>
                <span className="text-[10px] text-slate-500">Expert verified by 2 analysts</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      {/* Floating Action */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-12 h-12 rounded-full bg-[#7dd3fc] text-[#0a0e1a] flex items-center justify-center shadow-[0_0_30px_rgba(125,211,252,0.4)] hover:scale-105 transition-transform">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

