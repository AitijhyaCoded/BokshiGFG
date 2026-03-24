import type {Metadata} from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarProvider } from '@/hooks/use-sidebar';
import { Sidebar } from '@/components/sidebar';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata: Metadata = {
  title: 'Bokshi | AI Verification',
  description: 'AI-based Fact-Check & Claim Verification dashboard',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased selection:bg-[#7dd3fc]/30 selection:text-white flex h-screen overflow-hidden relative" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* Global Premium Background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-background transition-colors duration-500">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-[100%] bg-[#7dd3fc]/10 dark:bg-[#7dd3fc]/5 blur-[120px] mix-blend-screen animate-breathe" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-[100%] bg-[#c8a0f0]/10 dark:bg-[#c8a0f0]/5 blur-[120px] mix-blend-screen animate-breathe" style={{ animationDelay: "2s" }} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <SidebarProvider>
            <div className="flex w-full h-full overflow-hidden relative z-10 bg-transparent">
              <Sidebar />
              <main className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-4 custom-scrollbar relative">
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
