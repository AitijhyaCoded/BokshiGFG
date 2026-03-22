'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Search, FileText, X, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const steps = [
  { id: 1, title: 'Extracting Claims...', desc: 'Found 4 distinct claims in the provided text snippet.', icon: CheckCircle2 },
  { id: 2, title: 'Searching the Web...', desc: 'Scanning academic journals and top-tier news outlets...', icon: Search },
  { id: 3, title: 'Verifying Evidence...', desc: 'Cross-referencing search results for inconsistencies.', icon: FileText },
];

export default function VerifyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function runVerification() {
      const text = sessionStorage.getItem('verifyInput');
      if (!text) {
        if (isMounted) router.push('/');
        return;
      }

      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        
        if (!res.body) throw new Error('No stream in response');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done && isMounted) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(Boolean);
            for (const line of lines) {
              try {
                const parsed = JSON.parse(line);
                if (parsed.type === 'status') {
                   if (parsed.data === 'extracting') setCurrentStep(1);
                   if (parsed.data === 'searching') setCurrentStep(2);
                   if (parsed.data === 'verifying') setCurrentStep(3);
                } else if (parsed.type === 'log') {
                   setLogs(prev => [...prev, parsed.data]);
                } else if (parsed.type === 'result') {
                   sessionStorage.setItem('verifyResult', JSON.stringify(parsed.data));
                   if (isMounted) router.push('/results');
                   return;
                } else if (parsed.type === 'error') {
                   setLogs(prev => [...prev, `System Error: ${parsed.data}`]);
                }
              } catch (e) {
                console.error("Failed parsing line", line);
              }
            }
          }
        }
      } catch (error) {
         setLogs(prev => [...prev, 'FATAL ERROR CHECKING STREAM']);
      }
    }

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-full p-8 lg:p-12 max-w-6xl mx-auto flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-semibold text-[#7dd3fc]">Analysis State</h1>
          <nav className="flex gap-6 text-sm font-medium">
            <span className="text-white border-b-2 border-[#7dd3fc] pb-1">Current Process</span>
            <span className="text-slate-500 hover:text-slate-300 cursor-pointer">Quick Actions</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" className="py-2 px-4 rounded-full text-xs">Upgrade</Button>
          <div className="w-8 h-8 rounded-full bg-slate-700" />
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Progress Tracker */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7dd3fc]/10 border border-[#7dd3fc]/20 text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc] mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7dd3fc] animate-pulse" />
            Active Analysis
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Verifying Accuracy...</h2>
          <p className="text-slate-400 mb-12 text-lg">
            Our multi-agent AI is cross-referencing claims against established databases and real-time news feeds.
          </p>

          <GlassCard elevated className="p-8 relative overflow-hidden">
            {/* Animated progress bar at top */}
            <div className="absolute top-0 left-0 h-1 bg-[#7dd3fc]/20 w-full">
              <motion.div 
                className="h-full bg-[#7dd3fc] shadow-[0_0_10px_#7dd3fc]"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="space-y-8 relative">
              {/* Vertical connecting line */}
              <div className="absolute left-5 top-5 bottom-5 w-px bg-white/10" />

              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isPast = currentStep > step.id;
                const isPending = currentStep < step.id;

                return (
                  <div key={step.id} className="flex gap-6 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${
                      isActive ? 'bg-[#7dd3fc]/20 border border-[#7dd3fc] text-[#7dd3fc] shadow-[0_0_15px_rgba(125,211,252,0.2)]' :
                      isPast ? 'bg-[#0f1524] border border-white/20 text-slate-400' :
                      'bg-[#0f1524] border border-white/5 text-slate-600'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${isActive || isPast ? 'text-white' : 'text-slate-500'}`}>
                          {step.title}
                        </h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isActive ? 'text-[#7dd3fc]' : isPast ? 'text-slate-500' : 'text-slate-600'
                        }`}>
                          {isActive ? 'In Progress' : isPast ? 'Complete' : 'Pending'}
                        </span>
                      </div>
                      <p className={`text-sm ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Context & Logs */}
        <div className="space-y-6 flex flex-col">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Source Material</h3>
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-4 mb-4">
              Recent findings suggest that the implementation of decentralized protocols in urban logistics has resulted in a 40% reduction in carbon emissions across major metropolitan areas. This breakthrough, documented by the Global Environmental Agency, indicates that smaller, peer-to-peer delivery networks are significantly more efficient than traditional hub-and-spoke models.
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-[#c8a0f0]/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#c8a0f0]" />
              </div>
              <div>
                <p className="text-xs font-medium text-white">Urban_Efficiency_Report.pdf</p>
                <p className="text-[10px] text-slate-500">1.2 MB • Text Analysis</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#c8a0f0]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c8a0f0]">System Insight</h3>
            </div>
            <div className="mb-6">
              <p className="text-white font-medium leading-relaxed">
                "Initial scans show strong alignment with 2023 climate studies, but the '40% reduction' claim requires deeper secondary verification."
              </p>
            </div>
            
            {/* Terminal Feed */}
            <div className="flex-1 bg-[#050810] rounded-xl p-4 font-mono text-[10px] text-slate-400 overflow-hidden relative border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050810] pointer-events-none" />
              <div className="space-y-2">
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-[#7dd3fc]">•</span> {log}
                  </motion.div>
                ))}
                <motion.div 
                  animate={{ opacity: [1, 0.5, 1] }} 
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[#7dd3fc]">•</span> _
                </motion.div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-[8px] text-emerald-400">A</div>
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-[8px] text-blue-400">B</div>
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] text-slate-300">+12</div>
          </div>
          <span className="text-xs text-slate-500">Cross-referencing with 14 trusted databases</span>
        </div>
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
          <X className="w-4 h-4" /> Cancel Analysis
        </button>
      </div>
    </div>
  );
}
