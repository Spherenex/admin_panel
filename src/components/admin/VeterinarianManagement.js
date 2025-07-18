// import React, { useState } from 'react';
// import { CheckCircle, XCircle, Eye, Edit, Trash2, Plus, Search } from 'lucide-react';

// const VeterinarianManagement = () => {
//   const [veterinarians, setVeterinarians] = useState([
//     {
//       id: 1,
//       name: 'Dr. Sarah Johnson',
//       email: 'sarah@vet.com',
//       phone: '+91 9876543210',
//       specialization: 'Small Animals',
//       experience: 8,
//       status: 'active',
//       documentsVerified: true,
//       joinedDate: '2024-01-15',
//       consultations: 145,
//       rating: 4.8
//     },
//     {
//       id: 2,
//       name: 'Dr. Mike Chen',
//       email: 'mike@vet.com',
//       phone: '+91 9876543211',
//       specialization: 'Exotic Animals',
//       experience: 5,
//       status: 'pending',
//       documentsVerified: false,
//       joinedDate: '2024-07-10',
//       consultations: 0,
//       rating: 0
//     },
//     {
//       id: 3,
//       name: 'Dr. Emily Davis',
//       email: 'emily@vet.com',
//       phone: '+91 9876543212',
//       specialization: 'Surgery',
//       experience: 12,
//       status: 'active',
//       documentsVerified: true,
//       joinedDate: '2023-09-20',
//       consultations: 298,
//       rating: 4.9
//     },
//     {
//       id: 4,
//       name: 'Dr. Robert Wilson',
//       email: 'robert@vet.com',
//       phone: '+91 9876543213',
//       specialization: 'Cardiology',
//       experience: 15,
//       status: 'suspended',
//       documentsVerified: true,
//       joinedDate: '2023-11-05',
//       consultations: 67,
//       rating: 4.2
//     }
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [showAddModal, setShowAddModal] = useState(false);

//   const filteredVeterinarians = veterinarians.filter(vet => {
//     const matchesSearch = vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          vet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          vet.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = filterStatus === 'all' || vet.status === filterStatus;
    
//     return matchesSearch && matchesStatus;
//   });

//   const handleStatusChange = (id, newStatus) => {
//     setVeterinarians(vets =>
//       vets.map(vet =>
//         vet.id === id ? { ...vet, status: newStatus } : vet
//       )
//     );
//   };

//   const handleApprove = (id) => {
//     handleStatusChange(id, 'active');
//   };

//   const handleReject = (id) => {
//     handleStatusChange(id, 'rejected');
//   };

//   const handleSuspend = (id) => {
//     handleStatusChange(id, 'suspended');
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       active: 'bg-green-100 text-green-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       suspended: 'bg-red-100 text-red-800',
//       rejected: 'bg-gray-100 text-gray-800'
//     };
    
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-semibold text-gray-800">Veterinarian Management</h2>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Add Veterinarian
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search veterinarians..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="pending">Pending</option>
//               <option value="suspended">Suspended</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//           <div className="text-sm text-gray-600">
//             Total: {filteredVeterinarians.length} veterinarians
//           </div>
//         </div>
//       </div>

//       {/* Veterinarians Table */}
//       <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Veterinarian
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Specialization
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Consultations
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Rating
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredVeterinarians.map((vet) => (
//                 <tr key={vet.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
//                         <span className="text-white font-medium">
//                           {vet.name.split(' ').map(n => n[0]).join('')}
//                         </span>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{vet.name}</div>
//                         <div className="text-sm text-gray-500">{vet.experience} years experience</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{vet.email}</div>
//                     <div className="text-sm text-gray-500">{vet.phone}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {vet.specialization}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getStatusBadge(vet.status)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {vet.consultations}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {vet.rating > 0 ? `${vet.rating}/5` : 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-2">
//                       <button className="text-blue-600 hover:text-blue-800">
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       {vet.status === 'pending' && (
//                         <>
//                           <button
//                             onClick={() => handleApprove(vet.id)}
//                             className="text-green-600 hover:text-green-800"
//                           >
//                             <CheckCircle className="h-4 w-4" />
//                           </button>
//                           <button
//                             onClick={() => handleReject(vet.id)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <XCircle className="h-4 w-4" />
//                           </button>
//                         </>
//                       )}
//                       {vet.status === 'active' && (
//                         <button
//                           onClick={() => handleSuspend(vet.id)}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <XCircle className="h-4 w-4" />
//                         </button>
//                       )}
//                       <button className="text-gray-600 hover:text-gray-800">
//                         <Edit className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add Veterinarian Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-full max-w-md">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Veterinarian</h3>
//             <form className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Dr. John Doe"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="john@vet.com"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   type="tel"
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="+91 9876543210"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
//                 <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
//                   <option value="">Select Specialization</option>
//                   <option value="Small Animals">Small Animals</option>
//                   <option value="Large Animals">Large Animals</option>
//                   <option value="Exotic Animals">Exotic Animals</option>
//                   <option value="Surgery">Surgery</option>
//                   <option value="Cardiology">Cardiology</option>
//                   <option value="Dermatology">Dermatology</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
//                 <input
//                   type="number"
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="5"
//                 />
//               </div>
//               <div className="flex items-center justify-end space-x-4 mt-6">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Add Veterinarian
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VeterinarianManagement;



import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Edit, Trash2, Plus, Search } from 'lucide-react';
import VeterinarianModal from './VeterinarianModal'; // Import the new modal component

const VeterinarianManagement = () => {
  const [veterinarians, setVeterinarians] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah@vet.com',
      phone: '+91 9876543210',
      specialization: 'Small Animals',
      experience: 8,
      status: 'active',
      documentsVerified: true,
      joinedDate: '2024-01-15',
      consultations: 145,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Dr. Mike Chen',
      email: 'mike@vet.com',
      phone: '+91 9876543211',
      specialization: 'Exotic Animals',
      experience: 5,
      status: 'pending',
      documentsVerified: false,
      joinedDate: '2024-07-10',
      consultations: 0,
      rating: 0
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      email: 'emily@vet.com',
      phone: '+91 9876543212',
      specialization: 'Surgery',
      experience: 12,
      status: 'active',
      documentsVerified: true,
      joinedDate: '2023-09-20',
      consultations: 298,
      rating: 4.9
    },
    {
      id: 4,
      name: 'Dr. Robert Wilson',
      email: 'robert@vet.com',
      phone: '+91 9876543213',
      specialization: 'Cardiology',
      experience: 15,
      status: 'suspended',
      documentsVerified: true,
      joinedDate: '2023-11-05',
      consultations: 67,
      rating: 4.2
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Handler for adding a new veterinarian
  const handleSaveVeterinarian = (vetData) => {
    // Create new veterinarian object
    const newVet = {
      id: Date.now(), // Use timestamp as ID
      name: vetData.name,
      email: vetData.email,
      phone: vetData.phone,
      specialization: vetData.specialization,
      experience: Number(vetData.experience) || 0,
      status: 'pending',
      documentsVerified: false,
      joinedDate: new Date().toISOString().split('T')[0],
      consultations: 0,
      rating: 0
    };
    
    // Add to state
    setVeterinarians(prev => [...prev, newVet]);
    
    // Close modal
    setShowAddModal(false);
  };

  const filteredVeterinarians = veterinarians.filter(vet => {
    const matchesSearch = vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vet.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || vet.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setVeterinarians(vets =>
      vets.map(vet =>
        vet.id === id ? { ...vet, status: newStatus } : vet
      )
    );
  };

  const handleApprove = (id) => {
    handleStatusChange(id, 'active');
  };

  const handleReject = (id) => {
    handleStatusChange(id, 'rejected');
  };

  const handleSuspend = (id) => {
    handleStatusChange(id, 'suspended');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Veterinarian Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Veterinarian
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search veterinarians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Total: {filteredVeterinarians.length} veterinarians
          </div>
        </div>
      </div>

      {/* Veterinarians Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veterinarian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVeterinarians.map((vet) => (
                <tr key={vet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {vet.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{vet.name}</div>
                        <div className="text-sm text-gray-500">{vet.experience} years experience</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{vet.email}</div>
                    <div className="text-sm text-gray-500">{vet.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vet.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(vet.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vet.consultations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vet.rating > 0 ? `${vet.rating}/5` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      {vet.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(vet.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(vet.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {vet.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(vet.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Use the new modal component */}
      <VeterinarianModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveVeterinarian}
      />
    </div>
  );
};

export default VeterinarianManagement;