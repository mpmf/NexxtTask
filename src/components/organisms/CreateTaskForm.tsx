import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { TextButton } from '../atoms/TextButton';
import { ChecklistSection } from '../molecules/ChecklistSection';

interface ChecklistItem {
  tempId: string;
  content: string;
}

interface Checklist {
  tempId: string;
  title: string;
  items: ChecklistItem[];
}

interface CreateTaskFormProps {
  title: string;
  description: string;
  checklists: Checklist[];
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onChecklistTitleChange: (checklistId: string, title: string) => void;
  onChecklistItemChange: (checklistId: string, itemId: string, content: string) => void;
  onChecklistItemRemove: (checklistId: string, itemId: string) => void;
  onChecklistItemAdd: (checklistId: string) => void;
  onChecklistRemove: (checklistId: string) => void;
  onChecklistAdd: () => void;
}

export const CreateTaskForm = ({
  title,
  description,
  checklists,
  onTitleChange,
  onDescriptionChange,
  onChecklistTitleChange,
  onChecklistItemChange,
  onChecklistItemRemove,
  onChecklistItemAdd,
  onChecklistRemove,
  onChecklistAdd
}: CreateTaskFormProps) => {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="mb-6">
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-300 mb-1">
            Task Title
          </label>
          <Input
            id="task-title"
            placeholder="Write a title here..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <Textarea
            id="task-description"
            placeholder="Add a more detailed description..."
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Progress Checklists</h3>
        <div className="space-y-4">
          {checklists.map((checklist) => (
            <ChecklistSection
              key={checklist.tempId}
              title={checklist.title}
              items={checklist.items}
              onTitleChange={(title) => onChecklistTitleChange(checklist.tempId, title)}
              onItemChange={(itemId, content) => onChecklistItemChange(checklist.tempId, itemId, content)}
              onItemRemove={(itemId) => onChecklistItemRemove(checklist.tempId, itemId)}
              onAddItem={() => onChecklistItemAdd(checklist.tempId)}
              onRemove={() => onChecklistRemove(checklist.tempId)}
            />
          ))}
        </div>
        <TextButton
          onClick={onChecklistAdd}
          className="mt-4"
        >
          + Add another checklist
        </TextButton>
      </div>
    </div>
  );
};

