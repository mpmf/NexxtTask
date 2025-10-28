import React from 'react';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
  variant?: 'ghost' | 'danger';
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

export const IconButton = ({ 
  children, 
  onClick, 
  className = '',
  title,
  variant = 'ghost',
  type = 'button',
  'aria-label': ariaLabel
}: IconButtonProps) => {
  const variantClasses = {
    ghost: 'text-gray-400 hover:text-gray-200',
    danger: 'text-gray-400 hover:text-red-400'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={`transition-all duration-200 flex-shrink-0 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

