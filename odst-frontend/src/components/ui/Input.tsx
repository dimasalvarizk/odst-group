import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'number';
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Input({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/35 focus:border-brand-orange bg-white text-slate-800 transition-all text-sm disabled:opacity-75 disabled:cursor-not-allowed text-left ${className}`}
      dir="auto"
    />
  );
}

export default Input;
