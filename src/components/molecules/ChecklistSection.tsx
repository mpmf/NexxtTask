import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';
import { TextButton } from '../atoms/TextButton';
import { ChecklistItemInput } from './ChecklistItemInput';

interface ChecklistItem {
  tempId: string;
  content: string;
}

interface ChecklistSectionProps {
  title: string;
  items: ChecklistItem[];
  onTitleChange: (title: string) => void;
  onItemChange: (itemId: string, content: string) => void;
  onItemRemove: (itemId: string) => void;
  onAddItem: () => void;
  onRemove: () => void;
}

export const ChecklistSection = ({ 
  title, 
  items, 
  onTitleChange, 
  onItemChange,
  onItemRemove,
  onAddItem,
  onRemove
}: ChecklistSectionProps) => {
  return (
    <div className="p-4 rounded-lg border border-white/10 bg-white/5 group relative">
      <IconButton
        onClick={onRemove}
        variant="danger"
        title="Remove checklist"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </IconButton>
      
      <Input 
        placeholder="Checklist Title (e.g., Homepage Design)"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="mb-3"
      />
      
      <div className="space-y-2">
        {items.map((item) => (
          <ChecklistItemInput
            key={item.tempId}
            value={item.content}
            onChange={(content) => onItemChange(item.tempId, content)}
            onRemove={() => onItemRemove(item.tempId)}
          />
        ))}
      </div>
      
      <TextButton
        onClick={onAddItem}
        size="sm"
        className="mt-3"
      >
        + Add new item...
      </TextButton>
    </div>
  );
};

