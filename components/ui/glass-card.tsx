import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GlassCard({ children, className, elevated = false }: { children: React.ReactNode, className?: string, elevated?: boolean }) {
  return (
    <div className={cn(
      "rounded-2xl border border-[#7dd3fc]/10",
      elevated 
        ? "bg-[#0f1524]/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
        : "bg-[#0f1524]/60 backdrop-blur-md",
      className
    )}>
      {children}
    </div>
  );
}
