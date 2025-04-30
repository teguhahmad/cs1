import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Plus, 
  QrCode, 
  RefreshCw, 
  Power, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Mock sessions data
const MOCK_SESSIONS = [
  {
    id: 'session1',
    name: 'Customer Support 1',
    status: 'connected',
    lastActive: '2023-06-01T10:30:00Z',
    messages: 23
  },
  {
    id: 'session2',
    name: 'Sales WhatsApp',
    status: 'disconnected',
    lastActive: '2023-05-29T16:45:00Z',
    messages: 12
  }
];

const Sessions = () => {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeQRSession, setActiveQRSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle creating a new WhatsApp session
  const handleCreateSession = () => {
    if (!newSessionName.trim()) {
      toast.error('Please enter a session name');
      return;
    }

    setIsLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      const newSession = {
        id: `session${Date.now()}`,
        name: newSessionName,
        status: 'initializing',
        lastActive: new Date().toISOString(),
        messages: 0
      };
      
      setSessions([...sessions, newSession]);
      setShowNewSessionModal(false);
      setNewSessionName('');
      setIsLoading(false);
      
      // Show QR code modal for the new session
      setActiveQRSession(newSession);
      setShowQRModal(true);
      
      toast.success('Session created successfully');
    }, 1000);
  };

  // Handle connecting to WhatsApp
  const handleConnect = (session) => {
    setActiveQRSession(session);
    setShowQRModal(true);
  };

  // Handle deleting a session
  const handleDeleteSession = (sessionId) => {
    // Simulate API request
    setIsLoading(true);
    setTimeout(() => {
      setSessions(sessions.filter(session => session.id !== sessionId));
      setIsLoading(false);
      toast.success('Session deleted successfully');
    }, 1000);
  };

  // Format timestamp
  const formatLastActive = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">WhatsApp Sessions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Connect and manage WhatsApp sessions for customer service
          </p>
        </div>
        <button
          onClick={() => setShowNewSessionModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Smartphone className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No WhatsApp sessions</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-md">
            Create a new WhatsApp session to start connecting with your customers via WhatsApp
          </p>
          <button
            onClick={() => setShowNewSessionModal(true)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Session
          </button>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              variants={item}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
            >
              <div className="p-5 flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {session.name}
                    </h3>
                    <StatusBadge status={session.status} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Last active: {formatLastActive(session.lastActive)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Messages: {session.messages}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Smartphone className="h-6 w-6 text-indigo-500" />
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 px-5 py-3 flex justify-between">
                {session.status === 'connected' ? (
                  <>
                    <button
                      onClick={() => {
                        toast.info('Session disconnected');
                        const updatedSessions = [...sessions];
                        const index = updatedSessions.findIndex(s => s.id === session.id);
                        updatedSessions[index] = {...updatedSessions[index], status: 'disconnected'};
                        setSessions(updatedSessions);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 focus:outline-none"
                    >
                      <Power className="h-3.5 w-3.5 mr-1" />
                      Disconnect
                    </button>
                    <button
                      onClick={() => toast.info('Refreshing connection...')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 focus:outline-none"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      Refresh
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleConnect(session)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 focus:outline-none"
                    >
                      <QrCode className="h-3.5 w-3.5 mr-1" />
                      Connect
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowNewSessionModal(false)}></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New WhatsApp Session</h3>
            
            <div className="mb-4">
              <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Session Name
              </label>
              <input
                type="text"
                id="sessionName"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Customer Support WhatsApp"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewSessionModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                disabled={isLoading || !newSessionName.trim()}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading || !newSessionName.trim()
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isLoading ? 'Creating...' : 'Create Session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && activeQRSession && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowQRModal(false)}></div>
          
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Connect WhatsApp</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Scan this QR code with WhatsApp on your phone to connect
            </p>
            
            <div className="bg-white p-4 rounded-lg flex justify-center">
              {/* Placeholder for QR code - in a real app, this would be dynamically generated */}
              <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <QrCode className="h-32 w-32 text-gray-400" />
              </div>
            </div>
            
            <div className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
              <p>Session: {activeQRSession.name}</p>
              <p className="mt-1">This QR code will expire in 60 seconds</p>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  setShowQRModal(false);
                  // Simulate successful connection
                  const updatedSessions = [...sessions];
                  const index = updatedSessions.findIndex(s => s.id === activeQRSession.id);
                  if (index !== -1) {
                    updatedSessions[index] = {...updatedSessions[index], status: 'connected'};
                    setSessions(updatedSessions);
                    toast.success('WhatsApp connected successfully');
                  }
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                I've Scanned the Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  let color, icon, label;
  
  switch (status) {
    case 'connected':
      color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      icon = <CheckCircle className="h-3 w-3 mr-1" />;
      label = 'Connected';
      break;
    case 'disconnected':
      color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      icon = <XCircle className="h-3 w-3 mr-1" />;
      label = 'Disconnected';
      break;
    case 'initializing':
      color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      label = 'Initializing';
      break;
    default:
      color = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      icon = <AlertCircle className="h-3 w-3 mr-1" />;
      label = 'Unknown';
  }
  
  return (
    <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      {label}
    </span>
  );
};

export default Sessions;