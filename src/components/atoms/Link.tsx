import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  href?: string;
  to?: string;
  children: React.ReactNode;
  className?: string;
}

export const Link = ({ href, to, children, className = '' }: LinkProps) => {
  const baseClasses = 'text-teal-400 hover:text-teal-300 transition-colors duration-200';
  
  if (to) {
    return (
      <RouterLink to={to} className={`${baseClasses} ${className}`}>
        {children}
      </RouterLink>
    );
  }
  
  return (
    <a href={href} className={`${baseClasses} ${className}`}>
      {children}
    </a>
  );
};

