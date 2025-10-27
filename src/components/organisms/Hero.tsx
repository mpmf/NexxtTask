import React from 'react';
import { Button } from '../atoms/Button';
import { AppMockup } from './AppMockup';

export const Hero = () => {
  return (
    <main className="relative z-10 pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-6xl font-extrabold text-gray-900 leading-tight">
          Organize. Collaborate. Achieve.
        </h2>
        <h3 className="text-5xl font-extrabold text-gray-700 mt-2">
          The <span className="text-teal-500">NEXXT</span> level of task management.
        </h3>
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Stop juggling tabs and tools. NEXXT Task brings all your checklists, comments, and team assignments into one clear, focused workspace.
        </p>
        <Button to="/signup" className="mt-10 inline-block">
          Get Started for Free
        </Button>
      </div>

      <AppMockup />
    </main>
  );
};

