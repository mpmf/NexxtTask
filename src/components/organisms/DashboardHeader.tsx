import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';

export const DashboardHeader = () => {
  return (
    <header className="glass-card sticky top-0 z-10 mx-8 mt-6 rounded-3xl">
      <div className="px-6 pt-4 pb-3">
        <h2 className="text-2xl font-semibold text-gray-100 mb-3">My Tasks</h2>
        <div className="flex justify-between items-center">
          <div className="flex-1 max-w-sm">
            <Input 
              placeholder="Filter by tag..."
            />
          </div>
          
          <Button variant="secondary" to="/create-task">
            + Create Task
          </Button>
        </div>
      </div>
    </header>
  );
};

