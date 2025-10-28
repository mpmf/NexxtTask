import { Checkbox } from '../atoms/Checkbox';

interface UserAssignmentItemProps {
  userId: string;
  userName: string;
  userEmail: string;
  isSelected: boolean;
  onToggle: (userId: string) => void;
}

export const UserAssignmentItem = ({ 
  userId, 
  userName, 
  userEmail,
  isSelected, 
  onToggle 
}: UserAssignmentItemProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (email: string) => {
    const colors = ['#f97316', '#2dd4bf', '#fef3e2', '#14b8a6', '#ea580c'];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const backgroundColor = getAvatarColor(userEmail);
  const textColor = backgroundColor === '#fef3e2' ? '#000000' : '#ffffff';

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-3">
        <div 
          className="inline-flex h-8 w-8 rounded-full items-center justify-center text-xs font-semibold"
          style={{ backgroundColor, color: textColor }}
        >
          {getInitials(userName)}
        </div>
        <div>
          <p className="text-gray-100 text-sm">{userName}</p>
          <p className="text-gray-400 text-xs">{userEmail}</p>
        </div>
      </div>
      <Checkbox
        checked={isSelected}
        onChange={() => onToggle(userId)}
      />
    </div>
  );
};

