import { cn } from '@/components/ui/glass-card';

export function Button({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }) {
  return (
    <button 
      suppressHydrationWarning
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7dd3fc]/50",
        variant === 'primary' && "bg-[#7dd3fc]/10 text-[#7dd3fc] border border-[#7dd3fc]/30 hover:bg-[#7dd3fc]/20 hover:shadow-[0_0_30px_rgba(125,211,252,0.15)]",
        variant === 'secondary' && "bg-white/5 text-white border border-white/10 hover:bg-white/10",
        variant === 'ghost' && "text-slate-400 hover:text-white hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
