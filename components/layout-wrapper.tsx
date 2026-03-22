'use client';

import { usePathname } from 'next/navigation';
import { SidebarProvider } from '@/hooks/use-sidebar';
import { Sidebar } from '@/components/sidebar';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.startsWith('/login');

  if (isLoginPage) {
    return (
      <main className="w-full flex-1 h-full flex flex-col overflow-y-auto relative bg-[#0a0e1a]">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex w-full h-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto relative">
          {/* Ambient background glow */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7dd3fc]/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#c8a0f0]/5 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
