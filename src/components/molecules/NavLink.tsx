import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
}

export const NavLink = ({ href, children, icon, active = false }: NavLinkProps) => {
  const activeClasses = active 
    ? 'bg-white/10 text-gray-100 font-medium' 
    : 'text-gray-400 hover:bg-white/5 hover:text-gray-100';
  
  return (
    <a 
      href={href} 
      className={`flex items-center px-4 py-3 rounded-lg transition duration-200 ${activeClasses}`}
    >
      {icon && <span className="w-5 h-5 mr-3">{icon}</span>}
      {children}
    </a>
  );
};

