// components/shared/Alert.jsx
import React from 'react';

const Alert = ({ type, message, onClose }) => {
  const getAlertClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className={`border rounded-md p-4 ${getAlertClasses()}`}>
      <div className="flex items-center">
        <span className="text-xl mr-2">{getIcon()}</span>
        <span className="flex-1">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
export default Alert;