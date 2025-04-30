import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Page not found</p>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Home className="h-5 w-5 mr-2" />
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;