import type { Tag } from '../../types/task';

interface TagBadgeProps {
  tag: Tag;
}

export const TagBadge = ({ tag }: TagBadgeProps) => {
  const getTagColor = (tagName: string, providedColor?: string) => {
    if (providedColor) {
      return providedColor;
    }
    
    const colors = ['#f97316', '#2dd4bf', '#14b8a6', '#ea580c', '#5eead4', '#a855f7', '#eab308'];
    const index = tagName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const backgroundColor = getTagColor(tag.name, tag.color);

  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${backgroundColor}33`,
        color: backgroundColor
      }}
    >
      {tag.name}
    </span>
  );
};

