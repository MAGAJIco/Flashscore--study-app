import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Notification({ message, type, onClose, duration = 3000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }[type];

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in-right flex items-center gap-3 max-w-md`}>
      <span className="text-2xl">{icon}</span>
      <p className="flex-1">{message}</p>
      <button 
        onClick={onClose}
        className="text-white hover:text-gray-200 text-xl font-bold"
      >
        ×
      </button>
    </div>
  );
}
