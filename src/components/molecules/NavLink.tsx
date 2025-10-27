import React from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, children }: NavLinkProps) => (
  <a href={href} className="text-gray-300 hover:text-teal-400 transition duration-200">
    {children}
  </a>
);

