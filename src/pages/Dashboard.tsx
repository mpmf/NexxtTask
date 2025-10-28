import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { DecorativeBlobs } from '../components/atoms/DecorativeBlobs';
import { Sidebar } from '../components/organisms/Sidebar';
import { DashboardHeader } from '../components/organisms/DashboardHeader';
import { DashboardTaskList } from '../components/organisms/DashboardTaskList';
import { getTasks } from '../services/taskService';
import { getUsersByIds } from '../services/userService';
import type { Task } from '../types/task';
import type { TeamMember } from '../services/userService';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<string, TeamMember>>(new Map());
  const [tagFilter, setTagFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bodyStyle = {
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #e0f2f7 0%, #d4edee 50%, #fef3e2 100%)',
    minHeight: '100vh'
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);

        const allUserIds = new Set<string>();
        fetchedTasks.forEach(task => {
          task.assignments?.forEach(assignment => {
            allUserIds.add(assignment.user_id);
          });
        });

        if (allUserIds.size > 0) {
          const profiles = await getUsersByIds(Array.from(allUserIds));
          setUserProfiles(profiles);
        }
      } catch (err) {
        console.error('Error loading tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative text-gray-300" style={bodyStyle}>
      <DecorativeBlobs />
      
      <div className="flex h-screen">
        <Sidebar userName={displayName} userEmail={user?.email || ''} onSignOut={handleLogout} />
        
        <div className="flex-1 h-screen overflow-y-auto" style={{ marginLeft: '16rem' }}>
          <DashboardHeader 
            tagFilter={tagFilter}
            onTagFilterChange={setTagFilter}
          />
          
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-600 text-lg">Loading tasks...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : (
            <DashboardTaskList 
              tasks={tasks}
              userProfiles={userProfiles}
              tagFilter={tagFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
}

