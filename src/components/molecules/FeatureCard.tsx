interface FeatureCardProps {
  title: string;
  description: string;
}

export const FeatureCard = ({ title, description }: FeatureCardProps) => {
  const glassCardClasses = 'bg-gray-900/75 backdrop-blur-xl border border-white/10 shadow-lg';

  return (
    <div className={`${glassCardClasses} rounded-2xl p-8`}>
      <h3 className="text-2xl font-semibold text-gray-100">{title}</h3>
      <p className="mt-4 text-gray-300">{description}</p>
    </div>
  );
};

