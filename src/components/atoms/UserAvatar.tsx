interface UserAvatarProps {
  userName: string;
  userEmail: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ userName, userEmail, size = 'md' }: UserAvatarProps) => {
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

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm'
  };

  const backgroundColor = getAvatarColor(userEmail);
  const textColor = backgroundColor === '#fef3e2' ? '#000000' : '#ffffff';

  return (
    <div 
      className={`inline-flex ${sizeClasses[size]} rounded-full ring-2 ring-gray-800 items-center justify-center font-semibold`}
      style={{ backgroundColor, color: textColor }}
    >
      {getInitials(userName)}
    </div>
  );
};

