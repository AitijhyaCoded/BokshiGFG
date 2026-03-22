'use client';

import { authClient } from "@/lib/auth-client";
import { GlassCard } from "@/components/ui/glass-card";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function SettingsPage() {
  const session = authClient.useSession();
  
  if (session.isPending) return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#7dd3fc]/20 border-t-[#7dd3fc] rounded-full animate-spin" />
    </div>
  );
  
  if (!session.data) return (
    <div className="min-h-full flex items-center justify-center text-slate-500">
      Not authenticated. Please log in.
    </div>
  );

  const { user } = session.data;

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7dd3fc]/10 border border-[#7dd3fc]/20 text-[10px] font-bold uppercase tracking-wider text-[#7dd3fc] mb-6">
        Account Management
      </div>
      <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Profile Settings</h1>
      <p className="text-slate-400 mb-12">Manage your account details and security preferences.</p>
      
      <div className="grid gap-8">
        <GlassCard className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7dd3fc]/5 blur-3xl rounded-full" />
          
          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-[#0a101f] border border-[#7dd3fc]/20 flex items-center justify-center shadow-2xl relative z-10 shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="text-4xl font-bold text-[#7dd3fc]">
                {user.name?.[0] || user.email[0].toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-6 relative z-10 w-full">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{user.name || 'Bokshi User'}</h2>
              <p className="text-sm text-slate-500 font-medium">Verified Identity</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#7dd3fc]/70 flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <div className="text-sm text-slate-200 bg-white/[0.03] p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                  {user.email}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#c8a0f0]/70 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> Security Level
                </label>
                <div className="text-sm text-emerald-400 bg-emerald-500/[0.03] p-4 rounded-xl border border-emerald-500/10 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    Tier 1 Verification
                  </span>
                  <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-tighter">Active</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                 <Calendar className="w-3 h-3 text-slate-600" /> Member since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
               </div>
               <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-not-allowed">
                 Edit Profile
               </div>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 border-red-500/10 bg-red-500/[0.02]">
           <div className="flex items-center justify-between">
             <div>
               <h3 className="text-sm font-bold text-red-400 mb-1">Danger Zone</h3>
               <p className="text-xs text-slate-500">Permanently delete your account and all verification history.</p>
             </div>
             <button className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors">
               Delete Account
             </button>
           </div>
        </GlassCard>
      </div>
    </div>
  );
}
