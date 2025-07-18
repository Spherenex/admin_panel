// components/debug/ForceLogout.js - Add this temporarily to fix login issues
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ForceLogout = () => {
  const { logout, currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const handleForceLogout = async () => {
    try {
      console.log('Force logout initiated...');
      await logout();
      
      // Clear any remaining data
      localStorage.clear();
      sessionStorage.clear();
      
      console.log('Logout completed, redirecting to login...');
      navigate('/login');
      
      // Force page reload to clear any cached state
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error('Force logout error:', error);
      
      // If logout fails, force page reload to login
      window.location.href = '/login';
    }
  };

  const clearAllAndReload = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 z-50 text-center">
      <div className="flex justify-center items-center space-x-4 text-sm">
        <span>
          Logged in as: {currentUser?.email} ({userRole})
        </span>
        <button
          onClick={handleForceLogout}
          className="px-3 py-1 bg-red-700 rounded hover:bg-red-800"
        >
          Force Logout
        </button>
        <button
          onClick={clearAllAndReload}
          className="px-3 py-1 bg-red-700 rounded hover:bg-red-800"
        >
          Clear All & Reload
        </button>
      </div>
    </div>
  );
};

export default ForceLogout;