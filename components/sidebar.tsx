'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, History, Shield, Settings, Plus, LifeBuoy, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'History', href: '/history', icon: History },
  { name: 'Verified Sources', href: '/sources', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full flex flex-col bg-[#0a0e1a] border-r border-[#7dd3fc]/10 z-20 shrink-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#7dd3fc]/10 flex items-center justify-center border border-[#7dd3fc]/20 shadow-[0_0_15px_rgba(125,211,252,0.1)]">
          <ShieldCheck className="w-6 h-6 text-[#7dd3fc]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Bokshi.com</h1>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">AI Verification</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors group"
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-[#7dd3fc]/10 border border-[#7dd3fc]/20 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={clsx("w-5 h-5 relative z-10 transition-colors", isActive ? "text-[#7dd3fc]" : "text-slate-400 group-hover:text-slate-200")} />
              <span className={clsx("relative z-10 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-2">
        <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#0f1524]/60 backdrop-blur-md border border-[#7dd3fc]/20 text-sm font-medium text-[#7dd3fc] hover:bg-[#7dd3fc]/10 hover:shadow-[0_0_20px_rgba(125,211,252,0.1)] transition-all duration-300">
          <Plus className="w-4 h-4" />
          New Fact-Check
        </Link>
        <button suppressHydrationWarning className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
          <LifeBuoy className="w-5 h-5" />
          Support
        </button>
        <button suppressHydrationWarning className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
