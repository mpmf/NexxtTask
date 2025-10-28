import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Input } from '../atoms/Input';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagInput = ({ tags, onAddTag, onRemoveTag }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const addTags = (input: string) => {
    // Split by comma and filter out empty strings
    const newTags = input
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && !tags.includes(tag));
    
    // Add each unique tag
    newTags.forEach(tag => onAddTag(tag));
    
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTags(inputValue);
    } else if (e.key === ',' && inputValue.trim()) {
      // Also trigger on comma key to provide immediate feedback
      e.preventDefault();
      addTags(inputValue);
    }
  };

  const handleBlur = () => {
    // When input loses focus, convert any remaining text to tags
    if (inputValue.trim()) {
      addTags(inputValue);
    }
  };

  const getTagColor = (tag: string) => {
    const colors = ['#f97316', '#2dd4bf', '#14b8a6', '#ea580c', '#5eead4'];
    const index = tag.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: getTagColor(tag) }}
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-2 hover:text-gray-200 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        placeholder="Add tags (separate with commas or press Enter)..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    </div>
  );
};

