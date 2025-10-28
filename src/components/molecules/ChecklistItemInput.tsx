import { Checkbox } from '../atoms/Checkbox';
import { Input } from '../atoms/Input';
import { IconButton } from '../atoms/IconButton';

interface ChecklistItemInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder?: string;
}

export const ChecklistItemInput = ({ 
  value, 
  onChange, 
  onRemove,
  placeholder = 'Checklist item...'
}: ChecklistItemInputProps) => {
  return (
    <div className="flex items-center space-x-3 group">
      <Checkbox checked={false} onChange={() => {}} />
      <Input 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm"
      />
      <IconButton
        onClick={onRemove}
        variant="danger"
        aria-label="Remove checklist item"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </IconButton>
    </div>
  );
};

