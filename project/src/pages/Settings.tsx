import React, { useState } from 'react';
import { 
  Save, 
  Lock, 
  Globe, 
  Bell, 
  Moon, 
  Sun, 
  MessageSquare, 
  RefreshCw,
  Bot
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from '../hooks/useTheme';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    openRouterApiKey: '',
    aiModel: 'gpt-4-turbo',
    language: 'en',
    notifications: true,
    autoReply: true,
    humanHandoverThreshold: 3,
    sessionTimeout: 60,
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSave = () => {
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      toast.success('Settings saved successfully');
    }, 1000);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Bot className="h-5 w-5 mr-2 text-indigo-500" />
            AI Configuration
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="openRouterApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OpenRouter API Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="password"
                name="openRouterApiKey"
                id="openRouterApiKey"
                value={settings.openRouterApiKey}
                onChange={handleChange}
                className="block w-full pr-10 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="sk-xxxxxxxxxxxx"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your OpenRouter API key is stored securely and is only used to process messages
            </p>
          </div>
          
          <div>
            <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              AI Model
            </label>
            <select
              id="aiModel"
              name="aiModel"
              value={settings.aiModel}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="gpt-4-turbo">GPT-4 Turbo (OpenAI)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</option>
              <option value="claude-3-opus">Claude 3 Opus (Anthropic)</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet (Anthropic)</option>
              <option value="gemini-pro">Gemini Pro (Google)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Select the AI model to use for processing customer messages
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="autoReply"
                name="autoReply"
                type="checkbox"
                checked={settings.autoReply}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="autoReply" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable auto-reply
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Automatically reply to customer messages using AI
            </p>
          </div>
          
          <div>
            <label htmlFor="humanHandoverThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Human Handover Threshold
            </label>
            <input
              type="number"
              name="humanHandoverThreshold"
              id="humanHandoverThreshold"
              min="1"
              max="10"
              value={settings.humanHandoverThreshold}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Number of messages after which to suggest human handover
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Globe className="h-5 w-5 mr-2 text-indigo-500" />
            System Settings
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Language
            </label>
            <select
              id="language"
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
              <option value="id">Indonesian</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              name="sessionTimeout"
              id="sessionTimeout"
              min="15"
              max="1440"
              value={settings.sessionTimeout}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Time before inactive sessions are automatically closed
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="notifications"
                name="notifications"
                type="checkbox"
                checked={settings.notifications}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable notifications
              </label>
            </div>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Switch between light and dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-8 w-16 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
            >
              <div className={`transform transition-transform duration-200 ${theme === 'dark' ? 'translate-x-4' : '-translate-x-4'}`}>
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-indigo-500" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-500" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
            Message Templates
          </h2>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Create and manage quick reply templates for common responses
          </p>
          
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => toast.info('Template editor coming soon!')}
          >
            Manage Templates
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 pb-10">
        <button
          onClick={() => {
            // Reset to defaults
            setSettings({
              openRouterApiKey: '',
              aiModel: 'gpt-4-turbo',
              language: 'en',
              notifications: true,
              autoReply: true,
              humanHandoverThreshold: 3,
              sessionTimeout: 60,
            });
            toast.info('Settings reset to defaults');
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </button>
        
        <button
          onClick={handleSave}
          disabled={loading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;