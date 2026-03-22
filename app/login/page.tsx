'use client';

import { AuthView } from "@neondatabase/auth/react/ui";
import { Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Gradients */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-[#7dd3fc] blur-[140px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-[#c8a0f0] blur-[140px] pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-10 flex flex-col items-center"
      >
        {/* Logo and Branding Header */}
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="relative group cursor-default">
             <div className="absolute -inset-4 bg-gradient-to-r from-[#7dd3fc]/30 to-[#c8a0f0]/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="w-16 h-16 rounded-2xl bg-[#0a0f1c] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-[#7dd3fc]/10 to-transparent" />
               <ShieldCheck className="w-8 h-8 text-white relative z-10" />
             </div>
          </div>
          
          <div className="text-center space-y-1.5 mt-2">
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center justify-center gap-2">
              Bokshi <Sparkles className="w-4 h-4 text-[#7dd3fc] opacity-80" />
            </h1>
            <p className="text-[#94a3b8] text-[11px] font-medium uppercase tracking-[0.2em]">
              AI Verification Engine
            </p>
          </div>
        </div>

        {/* Clean, spacious card for the Auth form */}
        <div className="w-full bg-[#0d1323]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="w-full neon-auth-container">
            <AuthView path="sign-in" />
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-8 text-center flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-500/70 font-semibold uppercase tracking-widest">
             Secure Infrastructure Provider
          </p>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] text-slate-400 font-medium tracking-wide">Neon Auth</div>
            <span className="text-slate-600/50 text-[10px]">&bull;</span>
            <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] text-slate-400 font-medium tracking-wide">Gemini 2.0</div>
          </div>
        </div>
      </motion.div>
      
      <style jsx global>{`
        .neon-auth-container {
          --neon-primary: #7dd3fc;
          --neon-background: transparent;
          --neon-foreground: #f8fafc;
          --neon-card: transparent;
          --neon-border: rgba(255, 255, 255, 0.08); /* subtle borders */
          --neon-input: rgba(255, 255, 255, 0.03);
          --neon-radius: 12px;
        }

        /* Essential Overrides to clean up Better Auth UI */
        .neon-auth-container .better-auth-card {
           background: transparent !important;
           border: none !important;
           box-shadow: none !important;
           padding: 0 !important;
        }

        .neon-auth-container .better-auth-button {
           background: linear-gradient(to right, #7dd3fc, #c8a0f0) !important;
           color: #050810 !important;
           font-weight: 700 !important;
           border-radius: 16px !important;
           font-size: 14px !important;
           height: 48px !important;
           margin-top: 16px !important;
           transition: opacity 0.2s ease, transform 0.2s ease !important;
           border: none !important;
        }

        .neon-auth-container .better-auth-button:hover {
           opacity: 0.95 !important;
           transform: translateY(-1px) !important;
           box-shadow: 0 10px 30px rgba(125, 211, 252, 0.2) !important;
        }

        .neon-auth-container .better-auth-input {
           background: rgba(0, 0, 0, 0.2) !important;
           border: 1px solid rgba(255, 255, 255, 0.06) !important;
           color: white !important;
           padding: 0 16px !important;
           height: 48px !important;
           border-radius: 14px !important;
           font-size: 14px !important;
           transition: all 0.2s ease !important;
        }

        .neon-auth-container .better-auth-input:focus {
           border-color: #7dd3fc !important;
           background: rgba(0, 0, 0, 0.4) !important;
           box-shadow: 0 0 0 1px #7dd3fc !important;
           outline: none !important;
        }

        .neon-auth-container .better-auth-label {
           color: #94a3b8 !important;
           font-size: 12px !important;
           font-weight: 500 !important;
           margin-bottom: 8px !important;
        }

        .neon-auth-container .better-auth-title {
           font-size: 22px !important;
           font-weight: 600 !important;
           color: white !important;
           margin-bottom: 8px !important;
           text-align: center !important;
           width: 100% !important;
           display: block !important;
           letter-spacing: -0.02em !important;
        }

        .neon-auth-container .better-auth-description {
           color: #64748b !important;
           font-size: 14px !important;
           margin-bottom: 32px !important;
           text-align: center !important;
           width: 100% !important;
           display: block !important;
        }
           
        .neon-auth-container .better-auth-link {
           color: #7dd3fc !important;
           font-weight: 500 !important;
           text-decoration: none !important;
           font-size: 12px !important;
           transition: color 0.2s ease !important;
        }
        
        .neon-auth-container .better-auth-link:hover {
           color: #c8a0f0 !important;
        }
        
        .neon-auth-container [role="separator"] {
           border-top-color: rgba(255,255,255,0.08) !important;
           margin-top: 24px !important;
           margin-bottom: 24px !important;
        }
        
        .neon-auth-container [role="separator"] span {
           background: transparent !important;
           color: #64748b !important;
           font-size: 11px !important;
           font-weight: 500 !important;
           text-transform: uppercase !important;
           letter-spacing: 0.1em !important;
        }
      `}</style>
    </div>
  );
}
