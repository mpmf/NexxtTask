import type { Task, TaskStatus as TaskStatusType } from '../../types/task';
import type { TeamMember } from '../../services/userService';
import { TagBadge } from '../atoms/TagBadge';
import { UserAvatar } from '../atoms/UserAvatar';
import { TaskStatus } from '../../types/task';

interface DashboardTaskCardProps {
  task: Task;
  userProfiles: Map<string, TeamMember>;
}

export const DashboardTaskCard = ({ task, userProfiles }: DashboardTaskCardProps) => {
  const glassCardClasses = 'bg-gray-900/75 backdrop-blur-xl border border-white/10 shadow-lg';
  const isArchived = task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELED;
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isCanceled = task.status === TaskStatus.CANCELED;

  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500';
    if (isCanceled) return 'bg-gray-500';
    return 'bg-teal-400';
  };

  const getTitleClasses = () => {
    if (isArchived) {
      return 'text-lg font-medium text-gray-400 line-through truncate';
    }
    return 'text-lg font-medium text-gray-100 truncate';
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <div className="w-24 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            DONE
          </span>
        </div>
      );
    }
    if (isCanceled) {
      return (
        <div className="w-24 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            CANCELED
          </span>
        </div>
      );
    }
    return null;
  };

  const assignedUsers = task.assignments
    ?.map(assignment => userProfiles.get(assignment.user_id))
    .filter((user): user is TeamMember => user !== undefined) || [];

  return (
    <div className={`${glassCardClasses} rounded-2xl p-4 flex flex-row items-center space-x-4 ${isArchived ? 'opacity-70' : ''}`}>
      {/* Title and Tags */}
      <div className="flex-1">
        <h3 className={getTitleClasses()}>{task.title}</h3>
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {task.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
        )}
      </div>
      
      {/* Progress */}
      <div className="w-1/4">
        <div className={`flex justify-between text-sm mb-1 ${isArchived ? 'text-gray-400' : 'text-gray-300'}`}>
          <span>Progress</span>
          <span>{task.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className={`${getProgressColor()} h-2 rounded-full`} style={{ width: `${task.progress || 0}%` }}></div>
        </div>
      </div>

      {/* Status Badge or User Badges */}
      {isArchived ? (
        getStatusBadge()
      ) : (
        assignedUsers.length > 0 && (
          <div className="flex -space-x-2 overflow-hidden pl-2">
            {assignedUsers.map((user) => (
              <UserAvatar
                key={user.id}
                userName={user.full_name}
                userEmail={user.email}
                size="md"
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

