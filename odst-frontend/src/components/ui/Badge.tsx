import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block text-[10px] md:text-xs font-semibold uppercase tracking-widest text-brand-orange border border-brand-orange/30 px-3 py-1 rounded bg-brand-orange/5 ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
