
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, PlusCircle } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    {
      path: '/',
      icon: <Home size={24} />,
      label: 'Home',
    },
    {
      path: '/user',
      icon: <User size={24} />,
      label: 'Profile',
    },
    {
      path: '/add-task',
      icon: <PlusCircle size={32} className="text-primary" />,
      label: 'Add Task',
      highlight: true,
    },
    {
      path: '/settings',
      icon: <Settings size={24} />,
      label: 'Settings',
    },
  ];

  return (
    <div className="bottom-nav-container">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center ${
              item.highlight ? 'relative -top-5' : ''
            }`}
          >
            <div
              className={`${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-gray-500'
              } ${item.highlight ? 'p-2 bg-white rounded-full shadow-md' : ''}`}
            >
              {item.icon}
            </div>
            <span
              className={`text-xs mt-1 ${
                location.pathname === item.path
                  ? 'text-primary font-medium'
                  : 'text-gray-500'
              } ${item.highlight ? 'hidden' : ''}`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
