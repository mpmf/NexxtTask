import { useState, useEffect } from 'react';
import type { Task } from '../../types/task';
import type { TeamMember } from '../../services/userService';
import { DashboardTaskCard } from '../molecules/DashboardTaskCard';
import { Pagination } from '../molecules/Pagination';
import { TaskStatus } from '../../types/task';

interface DashboardTaskListProps {
  tasks: Task[];
  userProfiles: Map<string, TeamMember>;
  tagFilter: string;
}

const TASKS_PER_PAGE = 10;

export const DashboardTaskList = ({ tasks, userProfiles, tagFilter }: DashboardTaskListProps) => {
  const [activeTasksPage, setActiveTasksPage] = useState(1);
  const [archivedTasksPage, setArchivedTasksPage] = useState(1);

  // Reset pagination when filter changes
  useEffect(() => {
    setActiveTasksPage(1);
    setArchivedTasksPage(1);
  }, [tagFilter]);

  const filterTasksByTag = (taskList: Task[]) => {
    if (!tagFilter.trim()) {
      return taskList;
    }
    
    const filterLower = tagFilter.toLowerCase().trim();
    return taskList.filter(task => 
      task.tags?.some(tag => tag.name.toLowerCase().includes(filterLower))
    );
  };

  const activeTasks = filterTasksByTag(
    tasks.filter(task => task.status === TaskStatus.ACTIVE)
  );

  const archivedTasks = filterTasksByTag(
    tasks.filter(task => task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELED)
  );

  // Pagination calculations
  const totalActivePages = Math.ceil(activeTasks.length / TASKS_PER_PAGE);
  const totalArchivedPages = Math.ceil(archivedTasks.length / TASKS_PER_PAGE);

  const paginatedActiveTasks = activeTasks.slice(
    (activeTasksPage - 1) * TASKS_PER_PAGE,
    activeTasksPage * TASKS_PER_PAGE
  );

  const paginatedArchivedTasks = archivedTasks.slice(
    (archivedTasksPage - 1) * TASKS_PER_PAGE,
    archivedTasksPage * TASKS_PER_PAGE
  );

  return (
    <main className="p-8 mx-8 mb-8 rounded-2xl mt-6" style={{ backgroundColor: 'rgba(17, 24, 39, 0.1)', backdropFilter: 'blur(2px)' }}>
      {/* Active Tasks Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Tasks</h2>
        {activeTasks.length > 0 ? (
          <>
            <div className="flex flex-col space-y-4">
              {paginatedActiveTasks.map(task => (
                <DashboardTaskCard 
                  key={task.id} 
                  task={task} 
                  userProfiles={userProfiles}
                />
              ))}
            </div>
            <Pagination
              currentPage={activeTasksPage}
              totalPages={totalActivePages}
              onPageChange={setActiveTasksPage}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 text-lg">
              {tagFilter ? 'No active tasks match your filter' : 'No active tasks yet'}
            </p>
            {!tagFilter && (
              <p className="text-gray-500 text-sm mt-2">Click "+ Create Task" to get started</p>
            )}
          </div>
        )}
      </section>

      {/* Archived Tasks Section */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Archived Tasks</h2>
        {archivedTasks.length > 0 ? (
          <>
            <div className="flex flex-col space-y-4">
              {paginatedArchivedTasks.map(task => (
                <DashboardTaskCard 
                  key={task.id} 
                  task={task} 
                  userProfiles={userProfiles}
                />
              ))}
            </div>
            <Pagination
              currentPage={archivedTasksPage}
              totalPages={totalArchivedPages}
              onPageChange={setArchivedTasksPage}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 text-lg">
              {tagFilter ? 'No archived tasks match your filter' : 'No archived tasks'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

