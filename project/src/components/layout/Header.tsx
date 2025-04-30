import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/conversations') return 'Conversations';
    if (path.startsWith('/conversations/')) return 'Conversation Details';
    if (path === '/sessions') return 'WhatsApp Sessions';
    if (path === '/settings') return 'Settings';
    return 'CS AI Assistant';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative ml-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                CS
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;