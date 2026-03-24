import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function GlassCard({ children, className, elevated = false, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "rounded-2xl border transition-all duration-500 relative overflow-hidden",
        elevated 
          ? "bg-gradient-to-br from-[#0f172a]/90 to-[#0a0e1a]/90 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" 
          : "bg-gradient-to-br from-[#0f172a]/50 to-[#0a0e1a]/50 backdrop-blur-xl border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:border-white/10",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
