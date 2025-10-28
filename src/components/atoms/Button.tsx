import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text' | 'ghost';
  href?: string;
  to?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  href, 
  to, 
  className = '', 
  onClick, 
  type = 'button',
  disabled = false 
}: ButtonProps) => {
  const baseClasses = 'font-medium transition-all duration-300';
  
  const variantClasses = {
    primary: 'bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 transform hover:-translate-y-0.5',
    secondary: 'bg-orange-500 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg hover:bg-orange-600 transform hover:-translate-y-0.5',
    text: 'text-gray-300 hover:text-teal-400 transition duration-200',
    ghost: 'text-gray-300 text-sm font-medium py-2 px-4 rounded-lg hover:bg-white/10 transition duration-300'
  };

  const getDisabledClasses = () => {
    if (!disabled) return '';
    if (variant === 'ghost' || variant === 'text') {
      return 'opacity-50 cursor-not-allowed';
    }
    return 'opacity-50 cursor-not-allowed hover:bg-orange-500 hover:translate-y-0';
  };

  const disabledClasses = getDisabledClasses();

  const classes = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  if (to) {
    return (
      <Link 
        to={to} 
        className={classes}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a 
        href={href} 
        className={classes}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type}
      className={classes} 
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
