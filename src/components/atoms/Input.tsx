import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
}

export const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  className = '',
  name
}: InputProps) => {
  const baseClasses = 'w-full bg-white/5 border-0 rounded-none shadow-none border-b-2 border-white/20 px-1 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:shadow-none transition-colors duration-200';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`${baseClasses} ${className}`}
    />
  );
};
