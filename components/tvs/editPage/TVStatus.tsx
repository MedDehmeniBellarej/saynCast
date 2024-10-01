// src/components/tvs/TVStatus.tsx
import React from 'react';

interface TVStatusProps {
  isActive: boolean;
}

const TVStatus: React.FC<TVStatusProps> = ({ isActive }) => {
  return (
    <div className={`flex items-center p-4 rounded-md ${isActive ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
      <div className={`w-4 h-4 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <div className={`text-lg font-semibold ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900 dark:text-gray-100'}`}>
        {isActive ? 'Active' : 'Inactive'}
      </div>
    </div>
  );
};

export default TVStatus;
