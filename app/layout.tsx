import type {Metadata} from 'next';
import { Epilogue } from 'next/font/google';
import './globals.css'; // Global styles
import { AuthProvider } from '@/components/auth-provider';
import { LayoutWrapper } from '@/components/layout-wrapper';

const epilogue = Epilogue({ subsets: ['latin'], variable: '--font-epilogue' });

export const metadata: Metadata = {
  title: 'Bokshi | AI Verification',
  description: 'AI-based Fact-Check & Claim Verification dashboard',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${epilogue.variable} font-sans`}>
      <body className="bg-[#0a0e1a] text-slate-200 antialiased selection:bg-[#7dd3fc]/30 selection:text-white flex h-screen w-full overflow-hidden" suppressHydrationWarning>
        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
