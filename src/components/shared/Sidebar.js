// components/shared/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: '🏠' },
          { path: '/admin/users', label: 'User Management', icon: '👥' },
          { path: '/admin/vets', label: 'Vet Management', icon: '🩺' },
          { path: '/admin/suppliers', label: 'Supplier Management', icon: '📦' },
          { path: '/admin/medicine-approval', label: 'Medicine Approval', icon: '💊' },
          { path: '/admin/inventory', label: 'Inventory Manager', icon: '📊' },
          { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
        ];
      case 'vet':
        return [
          { path: '/vet', label: 'Dashboard', icon: '🏠' },
          { path: '/vet/profile', label: 'Profile', icon: '👤' },
          { path: '/vet/appointments', label: 'Appointments', icon: '📅' },
        ];
      case 'user':
        return [
          { path: '/user', label: 'Dashboard', icon: '🏠' },
          { path: '/user/profile', label: 'Profile', icon: '👤' },
          { path: '/user/book-appointment', label: 'Book Appointment', icon: '📅' },
          { path: '/user/medicine-store', label: 'Medicine Store', icon: '💊' },
          { path: '/user/emergency', label: 'Emergency Consult', icon: '🚨' },
        ];
      case 'supplier':
        return [
          { path: '/supplier', label: 'Dashboard', icon: '🏠' },
          { path: '/supplier/upload-medicine', label: 'Upload Medicine', icon: '📤' },
          { path: '/supplier/inventory', label: 'Inventory Tracker', icon: '📊' },
          { path: '/supplier/orders', label: 'Order History', icon: '📋' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold capitalize">{user?.role} Panel</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                  location.pathname === item.path ? 'bg-gray-700' : ''
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
export default Sidebar;