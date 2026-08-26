import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 transform active:scale-95 focus:outline-none';
  
  const sizeStyles = {
    sm: 'text-[10px] px-4 py-2',
    md: 'text-xs md:text-sm px-6 py-3',
    lg: 'text-sm md:text-base px-8 py-4',
  };

  const variantStyles = {
    primary: 'bg-brand-orange text-white hover:bg-brand-orange/95 shadow-md hover:shadow-brand-orange/25',
    secondary: 'bg-brand-navy text-white hover:bg-brand-navy/95 shadow-md hover:shadow-brand-navy/20',
    outline: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm shadow-md',
  };

  const widthStyles = fullWidth ? 'w-full' : 'w-auto';
  const disabledStyles = disabled ? 'opacity-75 cursor-not-allowed pointer-events-none' : '';

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyles} ${disabledStyles} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}

export default Button;
