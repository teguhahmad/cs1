import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  Clock, 
  Smartphone, 
  ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeConversations: 24,
    totalMessages: 142,
    averageResponseTime: '45s',
    activeSessions: 2
  });

  // Mock chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Messages',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Response Time (s)',
        data: [60, 55, 58, 45, 48, 40, 42],
        borderColor: '#2dd4bf',
        backgroundColor: 'rgba(45, 212, 191, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Activity',
      },
    },
  };

  // Recent conversations mock data
  const recentConversations = [
    {
      id: '1',
      name: 'John Doe',
      phone: '+1234567890',
      lastMessage: 'When will my order arrive?',
      time: '10m ago',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+0987654321',
      lastMessage: 'Thanks for your help!',
      time: '1h ago',
      status: 'resolved',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      phone: '+1122334455',
      lastMessage: 'I need to change my address',
      time: '2h ago',
      status: 'pending',
    },
  ];

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
    <div className="h-full pb-6">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <motion.div variants={item}>
          <StatCard 
            title="Active Conversations" 
            value={stats.activeConversations} 
            icon={<MessageSquare className="h-5 w-5 text-indigo-500" />}
            change="+12%"
            linkTo="/conversations"
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatCard 
            title="Total Messages" 
            value={stats.totalMessages} 
            icon={<Users className="h-5 w-5 text-teal-500" />}
            change="+5%"
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatCard 
            title="Avg. Response Time" 
            value={stats.averageResponseTime} 
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            change="-8%"
            positive={false}
          />
        </motion.div>
        
        <motion.div variants={item}>
          <StatCard 
            title="Active Sessions" 
            value={stats.activeSessions} 
            icon={<Smartphone className="h-5 w-5 text-purple-500" />}
            linkTo="/sessions"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Analytics</h2>
            <select className="text-sm border border-gray-300 rounded p-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div 
          variants={item}
          initial="hidden"
          animate="show" 
          className="bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Conversations</h2>
              <Link to="/conversations" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                View all
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentConversations.map((conversation) => (
              <div key={conversation.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Link to={`/conversations/${conversation.id}`} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{conversation.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{conversation.phone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">{conversation.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{conversation.time}</span>
                    <span className={`text-xs px-2 py-1 rounded-full mt-2 ${
                      conversation.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      conversation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
  change?: string;
  positive?: boolean;
  linkTo?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  positive = true,
  linkTo
}) => {
  const content = (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
          {change && (
            <p className={`text-xs font-medium mt-2 flex items-center ${
              positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              <span>{change}</span>
              <ArrowUpRight className={`h-3 w-3 ml-1 ${!positive && 'transform rotate-180'}`} />
            </p>
          )}
        </div>
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

export default Dashboard;