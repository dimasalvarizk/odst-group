import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block font-sans text-[10px] md:text-xs font-semibold uppercase tracking-widest text-slate-600 border border-brand-gold px-3.5 py-1 rounded bg-transparent ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
