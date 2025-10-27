interface TaskCardProps {
  title: string;
  progress: number;
  assignees?: string[];
  completed?: boolean;
}

export const TaskCard = ({ title, progress, assignees, completed = false }: TaskCardProps) => {
  const glassCardClasses = 'bg-gray-900/75 backdrop-blur-xl border border-white/10 shadow-lg';
  const progressColor = completed ? 'bg-green-500' : 'bg-teal-400';
  const titleClasses = completed 
    ? 'text-base font-medium text-gray-400 line-through' 
    : 'text-base font-medium text-gray-100';

  return (
    <div className={`${glassCardClasses} rounded-lg p-3 flex items-center space-x-3 ${completed ? 'opacity-70' : ''}`}>
      <div className="flex-1">
        <h3 className={titleClasses}>{title}</h3>
        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
          <div className={`${progressColor} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      {assignees && assignees.length > 0 && (
        <div className="flex -space-x-1">
          {assignees.map((assignee, index) => (
            <div 
              key={index}
              className={`w-6 h-6 rounded-full ring-2 ring-gray-800 ${index % 2 === 0 ? 'bg-orange-400' : 'bg-teal-400'} text-xs flex items-center justify-center text-white`}
            >
              {assignee}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

