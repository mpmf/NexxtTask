import { Button } from '../atoms/Button';

interface CreateTaskHeaderProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const CreateTaskHeader = ({ onCancel, onSave, isSaving }: CreateTaskHeaderProps) => {
  return (
    <header className="glass-card sticky top-0 z-10 mx-8 mt-6 rounded-3xl">
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-100">Create New Task</h2>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Task'}
          </Button>
        </div>
      </div>
    </header>
  );
};

