import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Send, 
  User, 
  Bot, 
  MoreVertical, 
  ArrowLeft, 
  Clock, 
  PhoneCall, 
  XCircle, 
  CheckCircle, 
  Copy
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock conversation data
const MOCK_CONVERSATION = {
  id: '1',
  name: 'John Doe',
  phone: '+1234567890',
  status: 'active',
  messages: [
    {
      id: '1',
      content: 'Hello, I have a question about my recent order #123456',
      sender: 'user',
      timestamp: '2023-06-01T10:30:00Z',
    },
    {
      id: '2',
      content: 'Hello John! I\'d be happy to help you with your order #123456. What specific information do you need?',
      sender: 'ai',
      timestamp: '2023-06-01T10:31:00Z',
    },
    {
      id: '3',
      content: 'I still haven\'t received my order and it\'s been a week since I placed it. The tracking number isn\'t working either.',
      sender: 'user',
      timestamp: '2023-06-01T10:32:00Z',
    },
    {
      id: '4',
      content: 'I apologize for the inconvenience. Let me check the status of your order. According to our system, your package has been shipped but there might be a delay with the carrier. The current estimated delivery date is June 5th. Would you like me to follow up with the shipping department for more details?',
      sender: 'ai',
      timestamp: '2023-06-01T10:33:00Z',
    },
    {
      id: '5',
      content: 'Yes, please. I need this package by the weekend for an event.',
      sender: 'user',
      timestamp: '2023-06-01T10:34:00Z',
    },
    {
      id: '6',
      content: 'I understand the urgency. I\'ve escalated this to our shipping department with a priority flag. They will contact the carrier to attempt to expedite the delivery. I\'ll update you as soon as I hear back from them. Is there anything else you need help with in the meantime?',
      sender: 'ai',
      timestamp: '2023-06-01T10:35:00Z',
    },
  ],
};

// Templates for quick replies
const QUICK_REPLY_TEMPLATES = [
  "Thank you for contacting us. I'll be happy to help you today.",
  "I understand your concern. Let me check that for you right away.",
  "I apologize for the inconvenience. We're working to resolve this as quickly as possible.",
  "Could you please provide your order number so I can assist you better?",
  "Is there anything else I can help you with today?"
];

const ConversationDetail = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(MOCK_CONVERSATION);
  const [newMessage, setNewMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);
  
  // Simulate sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    
    setNewMessage('');
    
    // Simulate AI response after a delay
    setIsAiTyping(true);
    setTimeout(() => {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        content: "I understand your concern. Our team is reviewing your request and we'll get back to you as soon as possible. Is there anything else you'd like to know in the meantime?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
      }));
      
      setIsAiTyping(false);
    }, 2000);
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle quick reply template selection
  const handleSelectTemplate = (template) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="flex items-center">
          <a href="/conversations" className="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <ArrowLeft className="h-5 w-5" />
          </a>
          <div className="flex-shrink-0 mr-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {conversation.name}
            </h2>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{conversation.phone}</span>
              <span className="mx-2">•</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                conversation.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                conversation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <PhoneCall className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow mb-4 p-4">
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-md px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 mr-1" />
                  ) : (
                    <Bot className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-medium">
                    {message.sender === 'user' ? 'Customer' : 'AI Assistant'}
                  </span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.sender === 'ai' && (
                  <div className="mt-2 flex justify-end space-x-2">
                    <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400">
                      <Copy className="h-3 w-3" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400">
                      <CheckCircle className="h-3 w-3" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400">
                      <XCircle className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          ))}
          
          {isAiTyping && (
            <div className="flex justify-start">
              <div className="max-w-md px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <div className="flex items-center mb-1">
                  <Bot className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">AI Assistant</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        {showTemplates && (
          <div className="absolute bottom-full left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-2 p-2 z-10">
            <div className="flex justify-between items-center mb-2 px-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick replies</h4>
              <button 
                onClick={() => setShowTemplates(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {QUICK_REPLY_TEMPLATES.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectTemplate(template)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>
          <div className="flex-shrink-0 flex items-center space-x-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
            >
              <span className="text-sm font-medium">Templates</span>
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full ${
                newMessage.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center">
          <Bot className="h-3 w-3 mr-1" />
          <span>AI is enabled • Messages are processed securely</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationDetail;