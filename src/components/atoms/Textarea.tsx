import React from 'react';

interface TextareaProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  name?: string;
  rows?: number;
}

export const Textarea = ({ 
  id,
  placeholder, 
  value, 
  onChange,
  className = '',
  name,
  rows = 8
}: TextareaProps) => {
  const baseClasses = 'w-full bg-white/5 border border-white/20 rounded-lg text-gray-100 placeholder-gray-400 px-3 py-3 focus:outline-none focus:border-teal-400 transition-colors duration-200 resize-none';

  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      rows={rows}
      className={`${baseClasses} ${className}`}
    />
  );
};

