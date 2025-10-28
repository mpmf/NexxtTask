import React from 'react';

interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  name?: string;
}

export const Input = ({ 
  id,
  type = 'text', 
  placeholder, 
  value, 
  onChange,
  onKeyDown,
  onBlur,
  className = '',
  name
}: InputProps) => {
  const baseClasses = 'w-full bg-white/5 border-0 rounded-none shadow-none border-b-2 border-white/20 px-1 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:shadow-none transition-colors duration-200';

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      name={name}
      className={`${baseClasses} ${className}`}
    />
  );
};
