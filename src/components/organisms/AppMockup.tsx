import React from 'react';
import { BrowserMockupBar } from '../molecules/BrowserMockupBar';
import { TaskCard } from '../molecules/TaskCard';

export const AppMockup = () => {
  const glassCardClasses = 'bg-gray-900/75 backdrop-blur-xl border border-white/10 shadow-lg';

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4">
      <div className={`${glassCardClasses} rounded-2xl shadow-2xl overflow-hidden`} style={{ borderWidth: '2px' }}>
        <BrowserMockupBar />
        
        <div className="flex h-96">
          <div className="w-48 p-4 space-y-3" style={{ backgroundColor: 'rgba(17, 24, 39, 0.6)' }}>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-white/10 text-gray-100 flex items-center justify-center text-xs">My</div>
              <span className="text-gray-100 text-sm font-medium">My Tasks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-white/5 text-gray-400 flex items-center justify-center text-xs">Tm</div>
              <span className="text-gray-400 text-sm">Team</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-3" style={{ backgroundColor: 'rgba(17, 24, 39, 0.1)', backdropFilter: 'blur(2px)' }}>
            <TaskCard 
              title="Design new Homepage" 
              progress={75} 
              assignees={['A', 'B']} 
            />
            <TaskCard 
              title="Implement Login API" 
              progress={100} 
              completed={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

