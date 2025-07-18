// src/components/user/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Camera,
  Package,
  Heart,
  Clock,
  CheckCircle
} from 'lucide-react';

// Mock components - replace with actual imports when available
const BookAppointments = ({ className }) => (
  <div className={className}>
    <Calendar className="w-5 h-5 mr-2" />
    Book Appointment
  </div>
);

const EmergencyConsults = ({ className }) => (
  <div className={className}>
    <Clock className="w-5 h-5 mr-2" />
    Emergency Consult
  </div>
);

const MedicineStore = ({ className }) => (
  <div className={className}>
    <Package className="w-5 h-5 mr-2" />
    Medicine Store
  </div>
);

const UserProfile = () => {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, City, State 12345',
    dateJoined: '2023-01-15',
    profileImage: null
  });

  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 3,
      weight: '30 kg',
      lastVisit: '2024-06-15'
    },
    {
      id: 2,
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Persian',
      age: 2,
      weight: '4 kg',
      lastVisit: '2024-06-10'
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      date: '2024-06-20',
      items: ['Vitamins', 'Flea Treatment'],
      total: 45.99,
      status: 'Delivered'
    },
    {
      id: 2,
      date: '2024-06-18',
      items: ['Dog Food', 'Treats'],
      total: 89.50,
      status: 'Processing'
    }
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2024-07-15',
      time: '10:00 AM',
      vet: 'Dr. Smith',
      pet: 'Buddy',
      type: 'Regular Checkup',
      status: 'Confirmed'
    },
    {
      id: 2,
      date: '2024-07-20',
      time: '2:30 PM',
      vet: 'Dr. Johnson',
      pet: 'Whiskers',
      type: 'Vaccination',
      status: 'Pending'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address
    });
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address
    });
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">Member since {formatDate(user.dateJoined)}</p>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* My Pets */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Pets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map(pet => (
                  <div key={pet.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Species:</span> {pet.species}</p>
                      <p><span className="font-medium">Breed:</span> {pet.breed}</p>
                      <p><span className="font-medium">Age:</span> {pet.age} years</p>
                      <p><span className="font-medium">Weight:</span> {pet.weight}</p>
                      <p><span className="font-medium">Last Visit:</span> {formatDate(pet.lastVisit)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <BookAppointments className="w-full flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer" />
                <EmergencyConsults className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors cursor-pointer" />
                <MedicineStore className="w-full flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors cursor-pointer" />
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Order #{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.items.join(', ')}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">{formatDate(order.date)}</span>
                      <span className="text-sm font-medium text-gray-900">${order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{appointment.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Pet:</span> {appointment.pet}</p>
                      <p><span className="font-medium">Vet:</span> {appointment.vet}</p>
                      <p><span className="font-medium">Date:</span> {formatDate(appointment.date)} at {appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;