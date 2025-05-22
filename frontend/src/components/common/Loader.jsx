// src/components/common/Loader.jsx
import React from 'react';

const Loader = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-t-2 border-b-2',
    md: 'h-8 w-8 border-t-2 border-b-2',
    lg: 'h-12 w-12 border-t-3 border-b-3'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-indigo-600 ${sizes[size]}`}
      ></div>
    </div>
  );
};

export default Loader;