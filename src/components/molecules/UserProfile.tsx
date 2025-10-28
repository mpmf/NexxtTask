interface UserProfileProps {
  name: string;
  email: string;
  onSignOut: () => void;
}

export const UserProfile = ({ name, email, onSignOut }: UserProfileProps) => {
  const initial = name.charAt(0).toUpperCase();
  
  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex items-center space-x-3">
        <div className="inline-flex h-10 w-10 rounded-full ring-2 ring-white/10 bg-orange-500 items-center justify-center text-white font-medium">
          {initial}
        </div>
        <div>
          <p className="text-gray-100 font-medium text-sm">
            {name}
          </p>
          <div className="text-xs space-x-1">
            <a href="#" className="text-gray-400 hover:text-teal-400 transition duration-200">
              View Profile
            </a>
            <span className="text-gray-400">/</span>
            <button 
              onClick={onSignOut}
              className="text-gray-400 hover:text-teal-400 transition duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

