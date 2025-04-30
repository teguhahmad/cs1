import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  X,
  PhoneCall, 
  Bot, 
  Smartphone
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-indigo-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">CS AI Assistant</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md text-indigo-300 hover:text-white md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md text-indigo-100 ${
                isActive
                  ? 'bg-indigo-800 font-medium'
                  : 'hover:bg-indigo-600 transition-colors'
              }`
            }
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>

          <NavLink
            to="/conversations"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md text-indigo-100 mt-2 ${
                isActive
                  ? 'bg-indigo-800 font-medium'
                  : 'hover:bg-indigo-600 transition-colors'
              }`
            }
            onClick={() => setOpen(false)}
          >
            <MessageSquare className="h-5 w-5 mr-3" />
            Conversations
          </NavLink>

          <NavLink
            to="/sessions"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md text-indigo-100 mt-2 ${
                isActive
                  ? 'bg-indigo-800 font-medium'
                  : 'hover:bg-indigo-600 transition-colors'
              }`
            }
            onClick={() => setOpen(false)}
          >
            <Smartphone className="h-5 w-5 mr-3" />
            WhatsApp Sessions
          </NavLink>

          <div className="mt-8 mb-4 px-4">
            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Support
            </p>
          </div>

          <a
            href="#"
            className="flex items-center px-4 py-3 rounded-md text-indigo-100 hover:bg-indigo-600 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            <PhoneCall className="h-5 w-5 mr-3" />
            Contact Support
          </a>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md text-indigo-100 mt-2 ${
                isActive
                  ? 'bg-indigo-800 font-medium'
                  : 'hover:bg-indigo-600 transition-colors'
              }`
            }
            onClick={() => setOpen(false)}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </NavLink>
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <div className="bg-indigo-800 rounded-md p-3 text-indigo-100">
            <p className="text-sm font-medium">Server Status</p>
            <div className="flex items-center mt-2">
              <div className="h-2 w-2 rounded-full bg-green-400 mr-2"></div>
              <p className="text-xs">Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;