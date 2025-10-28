import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { DecorativeBlobs } from '../components/atoms/DecorativeBlobs';
import { Sidebar } from '../components/organisms/Sidebar';
import { DashboardHeader } from '../components/organisms/DashboardHeader';
import { TaskList } from '../components/organisms/TaskList';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const bodyStyle = {
    fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #e0f2f7 0%, #d4edee 50%, #fef3e2 100%)',
    minHeight: '100vh'
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

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
          <DashboardHeader />
          <TaskList />
        </div>
      </div>
    </div>
  );
}

