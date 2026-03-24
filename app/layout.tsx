import type {Metadata} from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles
import { SidebarProvider } from '@/hooks/use-sidebar';
import { Sidebar } from '@/components/sidebar';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: 'Bokshi | AI Verification',
  description: 'AI-based Fact-Check & Claim Verification dashboard',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`}>
      <body className="bg-[#0a0e1a] text-slate-200 antialiased selection:bg-[#7dd3fc]/30 selection:text-white flex h-screen overflow-hidden" suppressHydrationWarning>
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
      </body>
    </html>
  );
}
