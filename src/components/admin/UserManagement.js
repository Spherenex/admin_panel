
import React, { useState } from 'react';
import { Users, UserCheck, UserX, Plus, Search, Filter, Edit, Eye, Shield } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.j@vetclinic.com",
      phone: "+1-555-0123",
      type: "veterinarian",
      status: "active",
      registrationDate: "2025-06-15",
      lastLogin: "2025-07-10",
      licenseNumber: "VET-2024-001",
      specialization: "Small Animals",
      clinicName: "City Veterinary Clinic"
    },
    {
      id: 2,
      name: "MedVet Supplies",
      email: "contact@medvetsupplies.com",
      phone: "+1-555-0456",
      type: "supplier",
      status: "active",
      registrationDate: "2025-05-20",
      lastLogin: "2025-07-09",
      businessLicense: "SUP-2024-001",
      companyAddress: "123 Supply St, Industrial Area",
      productsListed: 45
    },
    {
      id: 3,
      name: "Dr. Mike Chen",
      email: "mchen@animalcare.com",
      phone: "+1-555-0789",
      type: "veterinarian",
      status: "pending",
      registrationDate: "2025-07-08",
      lastLogin: "Never",
      licenseNumber: "VET-2024-002",
      specialization: "Exotic Animals",
      clinicName: "Exotic Animal Care Center"
    },
    {
      id: 4,
      name: "PetCare Solutions",
      email: "admin@petcaresol.com",
      phone: "+1-555-0321",
      type: "supplier",
      status: "suspended",
      registrationDate: "2025-04-10",
      lastLogin: "2025-07-01",
      businessLicense: "SUP-2024-002",
      companyAddress: "456 Commerce Blvd, Business District",
      productsListed: 23
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const updateUserStatus = (userId, newStatus) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'veterinarian' ? <UserCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || user.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const userStats = {
    total: users.length,
    veterinarians: users.filter(u => u.type === 'veterinarian').length,
    suppliers: users.filter(u => u.type === 'supplier').length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage veterinarians and suppliers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Veterinarians</p>
              <p className="text-2xl font-bold text-green-600">{userStats.veterinarians}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suppliers</p>
              <p className="text-2xl font-bold text-purple-600">{userStats.suppliers}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{userStats.pending}</p>
            </div>
            <UserX className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="veterinarian">Veterinarians</option>
              <option value="supplier">Suppliers</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          {getTypeIcon(user.type)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 capitalize">{user.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.registrationDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'pending' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="text-green-600 hover:text-green-900 text-xs px-2 py-1 border border-green-600 rounded"
                        >
                          Approve
                        </button>
                      )}
                      {user.status === 'active' && (
                        <button
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          className="text-red-600 hover:text-red-900 text-xs px-2 py-1 border border-red-600 rounded"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No users found matching your criteria</p>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                  <p><strong>Type:</strong> {selectedUser.type}</p>
                  <p><strong>Status:</strong> {selectedUser.status}</p>
                </div>
                
                {selectedUser.type === 'veterinarian' && (
                  <div>
                    <h3 className="font-semibold mb-2">Professional Information</h3>
                    <p><strong>License Number:</strong> {selectedUser.licenseNumber}</p>
                    <p><strong>Specialization:</strong> {selectedUser.specialization}</p>
                    <p><strong>Clinic:</strong> {selectedUser.clinicName}</p>
                  </div>
                )}
                
                {selectedUser.type === 'supplier' && (
                  <div>
                    <h3 className="font-semibold mb-2">Business Information</h3>
                    <p><strong>Business License:</strong> {selectedUser.businessLicense}</p>
                    <p><strong>Address:</strong> {selectedUser.companyAddress}</p>
                    <p><strong>Products Listed:</strong> {selectedUser.productsListed}</p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <p><strong>Registration Date:</strong> {selectedUser.registrationDate}</p>
                  <p><strong>Last Login:</strong> {selectedUser.lastLogin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;