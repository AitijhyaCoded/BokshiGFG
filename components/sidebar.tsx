'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, History, Shield, Settings, LifeBuoy, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { useSidebar } from '@/hooks/use-sidebar';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Verified Sources', href: '/results', icon: Shield },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebar();

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="h-full flex flex-col bg-[#0a0e1a] border-r border-[#7dd3fc]/10 z-20 shrink-0 overflow-hidden"
    >
      {/* Logo Area */}
      <div className={clsx("p-6 flex items-center transition-all duration-300", isCollapsed ? "justify-center px-0" : "gap-3")}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7dd3fc] to-[#c8a0f0] flex items-center justify-center shadow-[0_0_20px_rgba(125,211,252,0.3)] shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#030712]" />
        </div>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <h1 className="text-xl font-bold tracking-tight text-white truncate">
                Bokshi.<span className="text-[#7dd3fc]">AI</span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isCollapsed && (
          <button 
            onClick={toggle}
            className="p-1.5 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="px-4 mb-4">
          <button 
            onClick={toggle}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "relative flex items-center rounded-xl text-sm font-medium transition-colors group h-12",
                isCollapsed ? "justify-center px-0" : "px-4 gap-3"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-[#7dd3fc]/10 border border-[#7dd3fc]/20 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={clsx("w-5 h-5 relative z-10 transition-colors shrink-0", isActive ? "text-[#7dd3fc]" : "text-slate-400 group-hover:text-slate-200")} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={clsx("relative z-10 transition-colors truncate", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200")}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className={clsx("p-4 space-y-2", isCollapsed && "flex flex-col items-center")}>
        <button 
          suppressHydrationWarning 
          className={clsx(
            "flex items-center rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors h-12 w-full",
            isCollapsed ? "justify-center px-0" : "px-4 gap-3"
          )}
          title={isCollapsed ? "Support" : undefined}
        >
          <LifeBuoy className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Support</span>}
        </button>
        <button 
          suppressHydrationWarning 
          className={clsx(
            "flex items-center rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors h-12 w-full",
            isCollapsed ? "justify-center px-0" : "px-4 gap-3"
          )}
          title={isCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </motion.div>
  );
}
