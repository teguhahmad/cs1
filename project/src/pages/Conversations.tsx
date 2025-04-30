import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MessageSquare, User, Clock, ArrowUpDown } from 'lucide-react';

// Mock conversation data
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1234567890',
    lastMessage: 'Thank you for your assistance with my order issue.',
    time: '10 minutes ago',
    messages: 5,
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+0987654321',
    lastMessage: 'When will my order be delivered?',
    time: '1 hour ago',
    messages: 3,
    status: 'pending',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    phone: '+1122334455',
    lastMessage: 'I need to change my shipping address.',
    time: '2 hours ago',
    messages: 8,
    status: 'resolved',
  },
  {
    id: '4',
    name: 'Sarah Williams',
    phone: '+5566778899',
    lastMessage: 'Is there any discount code available for this month?',
    time: '1 day ago',
    messages: 4,
    status: 'active',
  },
  {
    id: '5',
    name: 'David Brown',
    phone: '+1231231234',
    lastMessage: 'How do I reset my password?',
    time: '1 day ago',
    messages: 6,
    status: 'resolved',
  },
];

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter conversations based on search term and status
  const filteredConversations = MOCK_CONVERSATIONS.filter(conversation => {
    const matchesSearch = 
      conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.phone.includes(searchTerm) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || conversation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block pl-9 pr-6 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            Sort
          </button>
        </div>
      </div>
      
      {filteredConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No conversations found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
            Try adjusting your search or filter parameters
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((conversation) => (
              <li key={conversation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Link to={`/conversations/${conversation.id}`} className="block p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 pt-1">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <User className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            {conversation.name}
                          </h3>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            conversation.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            conversation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{conversation.phone}</p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{conversation.lastMessage}</p>
                      </div>
                    </div>
                    <div className="ml-2 flex flex-col items-end">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {conversation.time}
                      </div>
                      <div className="mt-2 px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-xs font-medium text-indigo-800 dark:text-indigo-200">
                        {conversation.messages} messages
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Conversations;