import React from 'react';
import { FeatureCard } from '../molecules/FeatureCard';

export const Features = () => {
  const features = [
    {
      title: 'Progress Checklists',
      description: 'Stop guessing. Our progress bars update automatically based on completed checklist items. Know exactly where every task stands.'
    },
    {
      title: 'Comments & Activity Log',
      description: 'Keep conversations and actions in context. Discuss tasks in the comments, and see a full audit trail in the activity log.'
    },
    {
      title: 'Team Assignments',
      description: 'Assign multiple users to any task. Everyone sees what they need to do, and you see who\'s working on what.'
    }
  ];

  return (
    <section id="features" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">All-in-one. As it should be.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

