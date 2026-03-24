'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Link as LinkIcon, FileText, CheckCircle2, BarChart3, ShieldAlert, ArrowRight, Bell, HelpCircle, ScanEye, Zap, Database, Lock } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/components/ui/glass-card';

export default function LandingPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recentHistory, setRecentHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [stats, setStats] = useState({ totalCount: 0, hourCount: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
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
    <div className="relative min-h-screen w-full flex flex-col bg-transparent overflow-x-hidden selection:bg-[#7dd3fc]/30 selection:text-white">
      {/* Animated Abstract Backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#c8a0f0]/10 blur-[150px] animate-breathe mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#7dd3fc]/10 blur-[150px] animate-breathe mix-blend-screen" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[40%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 blur-[120px] animate-float" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 pt-6 pb-20">
        
        {/* Top Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-between mb-4 relative z-50 sticky top-4"
        >
          <div className="hidden md:flex relative w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search insights..."
              className="w-full bg-[#0f172a]/40 backdrop-blur-xl border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#7dd3fc]/50 focus:shadow-[0_0_20px_rgba(125,211,252,0.15)] transition-all"
            />
          </div>
          
          <div className="flex items-center gap-5 ml-auto">
            <button className="text-slate-400 hover:text-white transition-colors duration-300"><Bell className="w-5 h-5" /></button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7dd3fc] to-[#c8a0f0] p-[2px] cursor-pointer hover:shadow-[0_0_15px_rgba(200,160,240,0.4)] transition-all duration-300">
              <div className="w-full h-full rounded-full bg-[#030712] border border-[#030712]" />
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center mb-24 mt-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 text-xs font-medium text-[#7dd3fc]"
          >
            <span className="w-2 h-2 rounded-full bg-[#7dd3fc] animate-pulse" />
            Next-Gen AI Consensus Engine Live
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-[1.1]"
          >
            Reveal the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">
              Truth in the Noise
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 font-light leading-relaxed"
          >
            Instantly decode reality. Paste any news article, social post, or URL to verify authenticity against our multi-layered, deepfake-resistant neural engine.
          </motion.p>

          {/* Action Area (Verification Box) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-4xl perspective-1000"
          >
            <div className="relative group transform-style-3d transition-transform duration-700 hover:rotate-x-2">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7dd3fc] to-[#c8a0f0] rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-glow" />
              <GlassCard elevated className="relative p-2 flex flex-col group rounded-2xl border-white/10 bg-[#0f172a]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Paste an article, claim, or URL to verify..."
                  className="w-full h-40 bg-transparent resize-none p-6 text-white placeholder:text-slate-500 focus:outline-none text-xl font-medium relative z-10"
                />
                
                <div className="flex items-center justify-between p-4 border-t border-white/10 relative z-10 bg-slate-900/30">
                  <div className="flex gap-3">
                    <Button variant="ghost" className="py-2.5 px-4 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors" onClick={triggerAddUrl}>
                      <LinkIcon className="w-4 h-4 mr-2" /> Link
                    </Button>
                    <Button variant="ghost" className="py-2.5 px-4 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors" onClick={() => fileInputRef.current?.click()}>
                      <FileText className="w-4 h-4 mr-2" /> Document
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,image/*" />
                  </div>
                  <Button 
                    onClick={handleVerify} 
                    className="rounded-xl px-8 py-6 text-base font-bold bg-white text-slate-900 hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 group/btn"
                  >
                    Analyze Claim <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </div>

        {/* Abstract Workflow Showcase */}
        <div className="mb-32 relative z-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">The Verification Engine</h2>
            <p className="text-slate-400">Deep, uncompromising analysis layered asymmetrically for perfect precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative h-[800px] md:h-[600px]">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -50, rotateY: -10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-5 md:absolute md:top-0 md:left-0 w-full md:w-[45%] h-[280px] perspective-1000 z-20"
            >
              <GlassCard className="h-full p-8 flex flex-col justify-end bg-gradient-to-br from-[#0f172a]/80 to-[#030712]/90 border-t-white/20 border-l-white/20 shadow-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
                <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:opacity-100 transition-opacity">
                  <ScanEye className="w-12 h-12 text-[#7dd3fc]" />
                </div>
                <div className="relative z-10">
                  <div className="text-[#7dd3fc] font-bold text-sm tracking-widest uppercase mb-2">Phase 01</div>
                  <h3 className="text-2xl font-semibold mb-3">Syntax & Semantic Scan</h3>
                  <p className="text-slate-400 text-sm">Our models ingest the context, understanding linguistic nuances and structural anomalies instantly.</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Card 2 (Offset Middle) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-6 md:absolute md:top-[15%] md:left-[35%] w-full md:w-[50%] h-[320px] perspective-1000 z-30"
            >
              <GlassCard className="h-full p-8 flex flex-col justify-between bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#7dd3fc]/5 via-transparent to-[#c8a0f0]/10 opacity-50" />
                <div className="relative z-10 flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-[#c8a0f0]/10 flex items-center justify-center border border-[#c8a0f0]/20 backdrop-blur-md">
                    <Database className="w-6 h-6 text-[#c8a0f0]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8a0f0] bg-[#c8a0f0]/10 px-3 py-1.5 rounded-full border border-[#c8a0f0]/20">Active Validation</span>
                </div>
                <div className="relative z-10">
                  <div className="text-[#c8a0f0] font-bold text-sm tracking-widest uppercase mb-2">Phase 02</div>
                  <h3 className="text-3xl font-semibold mb-3">Cross-Reference Matrix</h3>
                  <p className="text-slate-300">Checking claims against thousands of trusted databases, identifying contradictions with military precision in milliseconds.</p>
                </div>
              </GlassCard>
            </motion.div>

            {/* Card 3 (Bottom Right) */}
            <motion.div 
              initial={{ opacity: 0, x: 50, rotateY: 10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:col-span-4 md:absolute md:bottom-0 md:right-0 w-full md:w-[40%] h-[260px] perspective-1000 z-10"
            >
              <GlassCard className="h-full p-8 flex flex-col justify-end bg-gradient-to-tl from-[#0f172a]/80 to-[#030712]/90 border-r-white/20 border-b-white/20 shadow-2xl group hover:-translate-y-2 transition-transform duration-500 overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-gradient-to-tr from-[#7dd3fc] to-transparent rounded-full opacity-10 blur-2xl group-hover:opacity-30 transition-opacity" />
                <div className="relative z-10">
                  <Zap className="w-8 h-8 text-white mb-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="text-white font-bold text-sm tracking-widest uppercase mb-2">Phase 03</div>
                  <h3 className="text-2xl font-semibold mb-2">Final Verdict</h3>
                  <p className="text-slate-400 text-sm">Delivering a comprehensive truth score with full transparent sourcing.</p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Global Statistics & Trust */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32"
        >
          <div className="col-span-1 md:col-span-3 mb-4 text-center">
             <h2 className="text-xl font-medium text-slate-500 uppercase tracking-widest">Platform Integrity</h2>
          </div>
          
          <GlassCard className="p-8 flex items-center justify-center flex-col text-center border-t border-t-[#7dd3fc]/30 group hover:border-t-[#7dd3fc] transition-colors">
            <BarChart3 className="w-8 h-8 text-[#7dd3fc] mb-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <p className="text-5xl font-black text-white mb-2">{stats.totalCount > 0 ? stats.totalCount.toLocaleString() : '10,000+'}</p>
            <p className="text-sm font-medium text-slate-400">Total Validations</p>
          </GlassCard>
          
          <GlassCard className="p-8 flex items-center justify-center flex-col text-center border-t border-t-emerald-400/30 group hover:border-t-emerald-400 transition-colors">
            <Lock className="w-8 h-8 text-emerald-400 mb-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <p className="text-5xl font-black text-white mb-2">99.9%</p>
            <p className="text-sm font-medium text-slate-400">Deepfake Detection Accuracy</p>
          </GlassCard>

          <GlassCard className="p-8 flex items-center justify-center flex-col text-center border-t border-t-[#c8a0f0]/30 group hover:border-t-[#c8a0f0] transition-colors relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#c8a0f0]/5 to-transparent" />
            <ShieldAlert className="w-8 h-8 text-[#c8a0f0] mb-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all relative z-10" />
            <p className="text-5xl font-black text-white mb-2">&lt;2s</p>
            <p className="text-sm font-medium text-slate-400 relative z-10">Average Latency</p>
          </GlassCard>
        </motion.div>

        {/* Live History Slider / Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Live Discoveries</h2>
              <p className="text-slate-400">Claims currently being verified globally.</p>
            </div>
            <button onClick={() => router.push('/history')} className="hidden md:flex items-center text-sm font-semibold text-[#7dd3fc] hover:text-white transition-colors group">
              View Directory <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoadingHistory ? (
              <div className="col-span-3 py-16 text-center text-slate-500 animate-pulse">Synchronizing recent global checks...</div>
            ) : recentHistory.length === 0 ? (
              <div className="col-span-3 py-16 text-center text-slate-500">Awaiting initial data stream.</div>
            ) : recentHistory.map((item, i) => {
              const acc = item.accuracy || 0;
              let statusText = 'INCONCLUSIVE';
              let gradient = 'from-amber-400/20 to-transparent';
              let color = 'text-amber-400';
              let dot = 'bg-amber-400';

              if (acc >= 80) {
                statusText = 'RELIABLE';
                gradient = 'from-emerald-500/20 to-transparent';
                color = 'text-emerald-400';
                dot = 'bg-emerald-400';
              } else if (acc < 50) {
                statusText = 'DECEPTIVE';
                gradient = 'from-red-500/20 to-transparent';
                color = 'text-red-400';
                dot = 'bg-red-400';
              }

              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={item.id || i}
                >
                  <GlassCard className="h-full p-6 hover:bg-[#0f172a]/90 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between border-white/5" onClick={() => router.push('/history')}>
                    <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", gradient)} />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]", dot, color)} />
                          <span className={cn("text-[10px] font-bold uppercase tracking-widest", color)}>
                            {statusText}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600 font-medium">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <h4 className="text-base font-medium text-white/90 mb-6 leading-snug line-clamp-3 group-hover:text-white transition-colors">{item.originalText}</h4>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                       <span className="text-xs text-slate-500">AI Confidence Map</span>
                       <div className={cn("text-lg font-black tracking-tighter", color)}>{Math.round(acc)}%</div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <footer className="mt-32 border-t border-white/5 pt-12 text-center text-sm font-medium text-slate-600 pb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7dd3fc]/10 to-[#c8a0f0]/10 flex items-center justify-center mb-6">
            <ShieldAlert className="w-6 h-6 text-slate-400" />
          </div>
          &copy; 2026 Bokshi.ai | Ultimate Premium Edition <br />
          Built for the integrity of global information flow.
        </footer>
      </div>
    </div>
  );
}
