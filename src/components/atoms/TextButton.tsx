import React from 'react';

interface TextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md';
  type?: 'button' | 'submit' | 'reset';
}

export const TextButton = ({ 
  children, 
  onClick, 
  className = '',
  size = 'md',
  type = 'button'
}: TextButtonProps) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-medium text-teal-400 hover:text-teal-300 transition duration-200 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};


