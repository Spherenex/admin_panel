// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Context Provider
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Public and shared components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import SupplierManagement from './components/admin/SupplierManagement';
import VeterinarianManagement from './components/admin/VeterinarianManagement';
import MedicineApproval from './components/admin/MedicineApproval';
import InventoryManage from './components/admin/InventoryManagement';
import AdminAnalytics from './components/admin/AdminAnalytics';
import OrderManagement from './components/admin/OrderManagement';
import SystemSettings from './components/admin/SystemSettings';

// Veterinary components
import VetDashboard from './components/veterinary/VetDashboard';
import VetProfile from './components/veterinary/VetProfile';
import AppointmentManager from './components/veterinary/AppointmentManager';

// User components
import UserDashboard from './components/user/UserDashboard';
import BookAppointment from './components/user/BookAppointment';
import AppointmentHistory from './components/user/AppointmentHistory';
import MedicineStore from './components/user/MedicineStore';
import EmergencyConsult from './components/user/EmergencyConsult';
import UserProfile from './components/user/UserProfile';

// Supplier components
import SupplierDashboard from './components/supplier/SupplierDashboard';
import MedicineUpload from './components/supplier/MedicineUpload';
import InventoryTracker from './components/supplier/InventoryTracker';
import OrderHistory from './components/supplier/OrderHistory';

import './styles/globals.css';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please check the console for errors</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/AdminDashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/suppliers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SupplierManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/vets" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <VeterinarianManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/medicines" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MedicineApproval />
                </ProtectedRoute>
              } />
              <Route path="/admin/inventory" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <InventoryManage />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SystemSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <OrderManagement />
                </ProtectedRoute>
              } />

              {/* Veterinary routes */}
              <Route path="/veterinary" element={
                <ProtectedRoute allowedRoles={['veterinary']}>
                  <VetDashboard />
                </ProtectedRoute>
              } />
              <Route path="/veterinary/vetDashboard" element={
                <ProtectedRoute allowedRoles={['veterinary']}>
                  <VetDashboard />
                </ProtectedRoute>
              } />
              <Route path="/veterinary/profile" element={
                <ProtectedRoute allowedRoles={['veterinary']}>
                  <VetProfile />
                </ProtectedRoute>
              } />
              <Route path="/veterinary/appointments" element={
                <ProtectedRoute allowedRoles={['veterinary']}>
                  <AppointmentManager />
                </ProtectedRoute>
              } />

              {/* User routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/user/book" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <BookAppointment />
                </ProtectedRoute>
              } />

              <Route
                path="/user/appointments"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <AppointmentHistory />
                  </ProtectedRoute>
                }
              />


              <Route path="/user/emergency" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <EmergencyConsult />
                </ProtectedRoute>
              } />
              <Route path="/user/medicines" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <MedicineStore />
                </ProtectedRoute>
              } />
              <Route path="/user/profile" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserProfile />
                </ProtectedRoute>
              } />

              {/* Supplier routes */}
              <Route path="/supplier" element={
                <ProtectedRoute allowedRoles={['supplier']}>
                  <SupplierDashboard />
                </ProtectedRoute>
              } />
              <Route path="/supplier/supplierDashboard" element={
                <ProtectedRoute allowedRoles={['supplier']}>
                  <SupplierDashboard />
                </ProtectedRoute>
              } />
              <Route path="/supplier/upload" element={
                <ProtectedRoute allowedRoles={['supplier']}>
                  <MedicineUpload />
                </ProtectedRoute>
              } />
              <Route path="/supplier/inventory" element={
                <ProtectedRoute allowedRoles={['supplier']}>
                  <InventoryTracker />
                </ProtectedRoute>
              } />
              <Route path="/supplier/orders" element={
                <ProtectedRoute allowedRoles={['supplier']}>
                  <OrderHistory />
                </ProtectedRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;