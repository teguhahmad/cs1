import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../hooks/useTheme';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen dark:bg-gray-900">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};