'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Link as LinkIcon, FileText, CheckCircle2, BarChart3, ShieldAlert, ArrowRight, Bell, HelpCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/components/ui/glass-card';

export default function Dashboard() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [stats, setStats] = useState({ totalCount: 0, hourCount: 0 });

  useEffect(() => {
    // Fetch statistics
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats(data);
        }
      })
      .catch(err => console.error('Stats fetch error:', err));

    fetch('/api/history?limit=3')
      .then(res => res.json())
      .then(data => {
        setRecentHistory(Array.isArray(data) ? data : []);
        setIsLoadingHistory(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoadingHistory(false);
      });
  }, []);

  const handleVerify = () => {
    if (inputValue.trim()) {
      let isUrl = false;
      try {
        new URL(inputValue.trim());
        isUrl = true;
      } catch {
        isUrl = false;
      }

      sessionStorage.setItem('verifyInputMode', isUrl ? 'url' : 'text');
      sessionStorage.setItem('verifyInput', inputValue.trim());
      router.push('/verify');
    }
  };

  const triggerAddUrl = () => {
    const url = prompt("Enter the URL to verify:");
    if (url) {
      sessionStorage.setItem('verifyInputMode', 'url');
      sessionStorage.setItem('verifyInput', url.trim());
      router.push('/verify');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      try {
        sessionStorage.setItem('verifyInputMode', 'file');
        sessionStorage.setItem('verifyInput', base64);
        sessionStorage.setItem('verifyFileType', file.type);
        sessionStorage.setItem('verifyFileName', file.name);
        router.push('/verify');
      } catch (err) {
        alert("File is too large or an error occurred.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-full p-8 lg:p-12 max-w-6xl mx-auto flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between mb-16">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            suppressHydrationWarning
            type="text"
            placeholder="Search insights..."
            className="w-full bg-[#0f1524]/60 backdrop-blur-md border border-[#7dd3fc]/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#7dd3fc]/30 focus:shadow-[0_0_20px_rgba(125,211,252,0.1)] transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" className="py-2 px-4 rounded-full text-xs">Upgrade</Button>
          <button suppressHydrationWarning className="text-slate-400 hover:text-white transition-colors"><Bell className="w-5 h-5" /></button>
          <button suppressHydrationWarning className="text-slate-400 hover:text-white transition-colors"><HelpCircle className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7dd3fc] to-[#c8a0f0] p-[2px]">
            <div className="w-full h-full rounded-full bg-[#0a0e1a] border border-[#0a0e1a]" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold text-center mb-6 tracking-tight"
        >
          Truth in the age of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7dd3fc] to-[#c8a0f0]">AI Illusion</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-400 text-center mb-12 max-w-2xl"
        >
          Paste any news article, social media post, or URL to verify its authenticity with our multi-layered consensus engine.
        </motion.p>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <GlassCard elevated className="p-2 flex flex-col group focus-within:shadow-[0_0_40px_rgba(125,211,252,0.1)] focus-within:border-[#7dd3fc]/30 transition-all duration-500">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste an Article or URL..."
              className="w-full h-32 bg-transparent resize-none p-4 text-white placeholder:text-slate-600 focus:outline-none text-lg"
            />
            <div className="flex items-center justify-between p-2 border-t border-white/5">
              <div className="flex gap-2">
                <Button variant="ghost" className="py-2 px-3 text-xs rounded-lg" onClick={triggerAddUrl}>
                  <LinkIcon className="w-4 h-4" /> Add URL
                </Button>
                <Button variant="ghost" className="py-2 px-3 text-xs rounded-lg" onClick={() => fileInputRef.current?.click()}>
                  <FileText className="w-4 h-4" /> Upload Doc
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,image/*"
                />
              </div>
              <Button onClick={handleVerify} className="rounded-xl px-8 shadow-[0_0_20px_rgba(125,211,252,0.1)]">
                <CheckCircle2 className="w-4 h-4" /> Verify Claim
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Metrics & Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <GlassCard className="p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 rounded-lg bg-[#7dd3fc]/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#7dd3fc]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc] bg-[#7dd3fc]/10 px-2 py-1 rounded-full">Live</span>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Total Verifications</p>
            <p className="text-4xl font-bold text-white tracking-tight">{stats.totalCount.toLocaleString()}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 md:col-span-2 relative overflow-hidden group">
          <div className="relative z-10 w-2/3">
            <h3 className="text-xl font-semibold text-white mb-2">Advanced Deepfake Detection</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Our new neural model identifies synthetically generated text and images with high accuracy.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-[#7dd3fc] hover:text-white transition-colors">
              Read Research <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          {/* Decorative graphic */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#7dd3fc]/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-32 border border-[#7dd3fc]/20 rounded-xl rotate-12 group-hover:rotate-0 transition-transform duration-700 ease-out flex items-center justify-center bg-[#0a0e1a]/50 backdrop-blur-sm">
            <ShieldAlert className="w-12 h-12 text-[#7dd3fc]/50" />
          </div>
        </GlassCard>
      </div>

      {/* Recent History */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Fact-Checks</h2>
          <button onClick={() => router.push('/history')} className="text-sm font-medium text-[#7dd3fc] hover:text-white transition-colors">View All History</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingHistory ? (
            <div className="col-span-3 py-8 text-center text-slate-500">Loading recent fact-checks...</div>
          ) : recentHistory.length === 0 ? (
            <div className="col-span-3 py-8 text-center text-slate-500">No recent fact-checks.</div>
          ) : recentHistory.map((item, i) => {
            const totalClaims = item.trueCount + item.partialCount + item.falseCount;
            let status = 'INCONCLUSIVE';
            let color = 'text-amber-400';
            let bg = 'bg-amber-400/10';
            let border = 'border-amber-400/20';

            if (totalClaims > 0) {
              if (item.falseCount > 0 && item.trueCount > 0) {
                status = 'PARTIALLY TRUE';
                color = 'text-amber-400';
                bg = 'bg-amber-400/10';
                border = 'border-amber-400/20';
              } else if (item.falseCount > 0) {
                status = 'DECEPTIVE';
                color = 'text-red-400';
                bg = 'bg-red-400/10';
                border = 'border-red-400/20';
              } else if (item.trueCount > item.partialCount) {
                status = 'VERIFIED';
                color = 'text-emerald-400';
                bg = 'bg-emerald-400/10';
                border = 'border-emerald-400/20';
              } else {
                status = 'PARTIALLY TRUE';
                color = 'text-amber-400';
                bg = 'bg-amber-400/10';
                border = 'border-amber-400/20';
              }
            }

            return (
              <GlassCard key={item.id || i} className="p-5 hover:bg-[#0f1524]/80 transition-colors cursor-pointer group" onClick={() => router.push('/history')}>
                <div className="flex items-center justify-between mb-4">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border", color, bg, border)}>
                    {status}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-white mb-4 line-clamp-2 group-hover:text-[#7dd3fc] transition-colors">{item.originalText}</h4>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] font-bold text-emerald-400 border border-emerald-400/20">{Math.round(item.accuracy)}%</div>
                  <span className="text-xs text-slate-400">AI Confidence</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <footer className="mt-16 text-center text-xs text-slate-600 pb-8">
        &copy; 2026 Bokshi.com AI. Built for the integrity of information.
      </footer>
    </div>
  );
}
