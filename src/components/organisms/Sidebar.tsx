import { Logo } from '../atoms/Logo';
import { NavLink } from '../molecules/NavLink';
import { UserProfile } from '../molecules/UserProfile';

interface SidebarProps {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
}

export const Sidebar = ({ userName, userEmail, onSignOut }: SidebarProps) => {
  return (
    <nav className="glass-card w-64 h-screen flex flex-col fixed top-0 left-0 z-20 rounded-r-3xl">
      <div className="flex items-center justify-center h-20 px-6 space-x-2 border-b border-white/10">
        <div className="w-10 h-10">
          <Logo />
        </div>
        <h1 className="text-2xl font-bold text-gray-100">NEXXT Task</h1>
      </div>
      
      <ul className="flex-1 px-4 py-6 space-y-2">
        <li>
          <NavLink 
            href="#" 
            active={true}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4h.01M12 12h.01M15 12h.01M12 15h.01M15 15h.01M9 15h.01"></path>
              </svg>
            }
          >
            My Tasks
          </NavLink>
        </li>
        <li>
          <NavLink 
            href="#"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            }
          >
            Team
          </NavLink>
        </li>
        <li>
          <NavLink 
            href="#"
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            }
          >
            Reports
          </NavLink>
        </li>
      </ul>

      <UserProfile name={userName} email={userEmail} onSignOut={onSignOut} />
    </nav>
  );
};

