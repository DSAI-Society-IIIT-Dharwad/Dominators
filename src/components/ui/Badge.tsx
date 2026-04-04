import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeVariant = 'critical' | 'high' | 'medium' | 'low' | 'success' | 'info' | 'warning';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  glow?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'info', 
  glow = false,
  className,
  ...props 
}) => {
  const variants = {
    critical: "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    info: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200 uppercase tracking-wider",
        variants[variant],
        glow && "shadow-[0_0_15px_currentColor/0.2]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
