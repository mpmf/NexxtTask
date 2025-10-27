import React from 'react';
import { Logo } from '../atoms/Logo';
import { Button } from '../atoms/Button';
import { NavLink } from '../molecules/NavLink';

export const Header = () => {
  const glassCardClasses = 'bg-gray-900/75 backdrop-blur-xl border border-white/10 shadow-lg';

  return (
    <header className="sticky top-0 z-30 p-4">
      <nav className={`${glassCardClasses} rounded-2xl max-w-6xl mx-auto px-6 py-3`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10">
              <Logo />
            </div>
            <h1 className="text-2xl font-bold text-gray-100">NEXXT Task</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#">Pricing</NavLink>
            <NavLink href="#">About Us</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="text" to="/signin">
              Sign In
            </Button>
            <Button variant="secondary" to="/signup">
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

