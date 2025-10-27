import { useAuth } from '../hooks/useAuth';
import Home from './Home';
import Dashboard from './Dashboard';

export default function Root() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return user ? <Dashboard /> : <Home />;
}

