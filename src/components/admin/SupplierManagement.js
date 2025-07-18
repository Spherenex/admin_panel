// // SupplierManagement.jsx
// import React, { useState } from 'react';
// import { 
//   Building2, Star, Package, TrendingUp, Mail, Phone, MapPin, 
//   Check, X, Eye, Edit, AlertTriangle, Search, Filter, Plus,
//   Calendar, DollarSign, Award, Users
// } from 'lucide-react';

// const SupplierManagement = () => {
//   const [suppliers, setSuppliers] = useState([
//     {
//       id: 1,
//       companyName: "MedVet Supplies Ltd.",
//       contactPerson: "John Smith",
//       email: "john@medvetsupplies.com",
//       phone: "+1-555-0123",
//       address: "123 Medical Supply St, Healthcare District, NY 10001",
//       businessLicense: "BL-2024-001",
//       taxId: "TAX-123456789",
//       status: "active",
//       rating: 4.8,
//       totalProducts: 85,
//       ordersCompleted: 142,
//       revenue: 45650.00,
//       joinDate: "2024-03-15",
//       lastActive: "2025-07-10",
//       specialties: ["Antibiotics", "Surgical Supplies", "Vaccines"],
//       documents: {
//         businessLicense: "license.pdf",
//         taxCertificate: "tax_cert.pdf",
//         qualityCertification: "quality_cert.pdf"
//       },
//       performance: {
//         onTimeDelivery: 95,
//         responseTime: 2.3,
//         customerSatisfaction: 4.7,
//         productQuality: 4.9
//       }
//     },
//     {
//       id: 2,
//       companyName: "PetCare Solutions Inc.",
//       contactPerson: "Sarah Wilson",
//       email: "sarah@petcaresolutions.com",
//       phone: "+1-555-0456",
//       address: "456 Pet Care Ave, Animal District, CA 90210",
//       businessLicense: "BL-2024-002",
//       taxId: "TAX-987654321",
//       status: "pending",
//       rating: 0,
//       totalProducts: 32,
//       ordersCompleted: 0,
//       revenue: 0,
//       joinDate: "2025-07-08",
//       lastActive: "2025-07-09",
//       specialties: ["Parasite Control", "Nutrition", "Grooming"],
//       documents: {
//         businessLicense: "license.pdf",
//         taxCertificate: "pending",
//         qualityCertification: "pending"
//       },
//       performance: {
//         onTimeDelivery: 0,
//         responseTime: 0,
//         customerSatisfaction: 0,
//         productQuality: 0
//       }
//     },
//     {
//       id: 3,
//       companyName: "VetMed Pharmaceuticals",
//       contactPerson: "Dr. Michael Chen",
//       email: "contact@vetmedpharma.com",
//       phone: "+1-555-0789",
//       address: "789 Pharma Street, Medical Center, TX 75001",
//       businessLicense: "BL-2024-003",
//       taxId: "TAX-456789123",
//       status: "suspended",
//       rating: 3.2,
//       totalProducts: 67,
//       ordersCompleted: 89,
//       revenue: 28900.00,
//       joinDate: "2024-01-20",
//       lastActive: "2025-06-25",
//       specialties: ["Pain Management", "Anesthesia", "Critical Care"],
//       documents: {
//         businessLicense: "license.pdf",
//         taxCertificate: "tax_cert.pdf",
//         qualityCertification: "expired"
//       },
//       performance: {
//         onTimeDelivery: 78,
//         responseTime: 5.2,
//         customerSatisfaction: 3.1,
//         productQuality: 3.5
//       }
//     }
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   const updateSupplierStatus = (supplierId, newStatus) => {
//     setSuppliers(prev => 
//       prev.map(supplier => 
//         supplier.id === supplierId ? { ...supplier, status: newStatus } : supplier
//       )
//     );
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'suspended': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
//       />
//     ));
//   };

//   const filteredSuppliers = suppliers.filter(supplier => {
//     const matchesSearch = supplier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const supplierStats = {
//     total: suppliers.length,
//     active: suppliers.filter(s => s.status === 'active').length,
//     pending: suppliers.filter(s => s.status === 'pending').length,
//     suspended: suppliers.filter(s => s.status === 'suspended').length,
//     totalRevenue: suppliers.reduce((sum, s) => sum + s.revenue, 0),
//     avgRating: suppliers.filter(s => s.rating > 0).reduce((sum, s) => sum + s.rating, 0) / suppliers.filter(s => s.rating > 0).length || 0
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">Supplier Management</h1>
//         <p className="text-gray-600">Manage supplier partnerships and performance</p>
//       </div>

//       {/* Stats Dashboard */}
//       <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
//               <p className="text-2xl font-bold text-gray-900">{supplierStats.total}</p>
//             </div>
//             <Building2 className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Active</p>
//               <p className="text-2xl font-bold text-green-600">{supplierStats.active}</p>
//             </div>
//             <Check className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pending</p>
//               <p className="text-2xl font-bold text-yellow-600">{supplierStats.pending}</p>
//             </div>
//             <AlertTriangle className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Suspended</p>
//               <p className="text-2xl font-bold text-red-600">{supplierStats.suspended}</p>
//             </div>
//             <X className="w-8 h-8 text-red-600" />
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//               <p className="text-2xl font-bold text-green-600">${supplierStats.totalRevenue.toLocaleString()}</p>
//             </div>
//             <DollarSign className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Avg Rating</p>
//               <p className="text-2xl font-bold text-yellow-600">{supplierStats.avgRating.toFixed(1)}</p>
//             </div>
//             <Star className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4 justify-between">
//           <div className="flex flex-col md:flex-row gap-4 flex-1">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search suppliers..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active</option>
//               <option value="pending">Pending</option>
//               <option value="suspended">Suspended</option>
//             </select>
//           </div>
//           <button
//             onClick={() => setShowAddModal(true)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Supplier
//           </button>
//         </div>
//       </div>

//       {/* Suppliers Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {filteredSuppliers.map(supplier => (
//           <div key={supplier.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="p-6">
//               {/* Header */}
//               <div className="flex justify-between items-start mb-4">
//                 <div className="flex items-start space-x-3">
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <Building2 className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-900 text-lg">{supplier.companyName}</h3>
//                     <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
//                   </div>
//                 </div>
//                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
//                   {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
//                 </span>
//               </div>

//               {/* Contact Info */}
//               <div className="space-y-2 mb-4">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Mail className="w-4 h-4 mr-2" />
//                   <span className="truncate">{supplier.email}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Phone className="w-4 h-4 mr-2" />
//                   <span>{supplier.phone}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <MapPin className="w-4 h-4 mr-2" />
//                   <span className="truncate">{supplier.address}</span>
//                 </div>
//               </div>

//               {/* Performance Metrics */}
//               <div className="space-y-3 mb-4">
//                 {supplier.status === 'active' && (
//                   <>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Rating</span>
//                       <div className="flex items-center space-x-1">
//                         {renderStars(supplier.rating)}
//                         <span className="text-sm font-medium ml-1">{supplier.rating}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Products</span>
//                       <span className="text-sm font-medium">{supplier.totalProducts}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Orders Completed</span>
//                       <span className="text-sm font-medium">{supplier.ordersCompleted}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Revenue</span>
//                       <span className="text-sm font-medium text-green-600">${supplier.revenue.toLocaleString()}</span>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Specialties */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">Specialties</p>
//                 <div className="flex flex-wrap gap-1">
//                   {supplier.specialties.slice(0, 3).map((specialty, index) => (
//                     <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
//                       {specialty}
//                     </span>
//                   ))}
//                   {supplier.specialties.length > 3 && (
//                     <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
//                       +{supplier.specialties.length - 3} more
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col gap-2">
//                 <button
//                   onClick={() => setSelectedSupplier(supplier)}
//                   className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
//                 >
//                   <Eye className="w-4 h-4 mr-1" />
//                   View Details
//                 </button>
                
//                 <div className="flex gap-2">
//                   {supplier.status === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => updateSupplierStatus(supplier.id, 'active')}
//                         className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
//                       >
//                         <Check className="w-4 h-4 mr-1" />
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => updateSupplierStatus(supplier.id, 'suspended')}
//                         className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
//                       >
//                         <X className="w-4 h-4 mr-1" />
//                         Reject
//                       </button>
//                     </>
//                   )}
                  
//                   {supplier.status === 'active' && (
//                     <button
//                       onClick={() => updateSupplierStatus(supplier.id, 'suspended')}
//                       className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
//                     >
//                       <X className="w-4 h-4 mr-1" />
//                       Suspend
//                     </button>
//                   )}
                  
//                   {supplier.status === 'suspended' && (
//                     <button
//                       onClick={() => updateSupplierStatus(supplier.id, 'active')}
//                       className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
//                     >
//                       <Check className="w-4 h-4 mr-1" />
//                       Reactivate
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {filteredSuppliers.length === 0 && (
//         <div className="text-center py-12">
//           <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <p className="text-gray-500">No suppliers found matching your criteria</p>
//         </div>
//       )}

//       {/* Supplier Detail Modal */}
//       {selectedSupplier && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold">{selectedSupplier.companyName}</h2>
//                 <button
//                   onClick={() => setSelectedSupplier(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Tabs */}
//               <div className="flex border-b border-gray-200 mb-6">
//                 {['overview', 'performance', 'documents', 'products'].map(tab => (
//                   <button
//                     key={tab}
//                     onClick={() => setActiveTab(tab)}
//                     className={`px-4 py-2 text-sm font-medium ${
//                       activeTab === tab
//                         ? 'text-blue-600 border-b-2 border-blue-600'
//                         : 'text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                   </button>
//                 ))}
//               </div>

//               {/* Tab Content */}
//               {activeTab === 'overview' && (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h3 className="font-semibold mb-3">Company Information</h3>
//                       <div className="space-y-2 text-sm">
//                         <p><strong>Contact Person:</strong> {selectedSupplier.contactPerson}</p>
//                         <p><strong>Email:</strong> {selectedSupplier.email}</p>
//                         <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
//                         <p><strong>Address:</strong> {selectedSupplier.address}</p>
//                         <p><strong>Business License:</strong> {selectedSupplier.businessLicense}</p>
//                         <p><strong>Tax ID:</strong> {selectedSupplier.taxId}</p>
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold mb-3">Business Metrics</h3>
//                       <div className="space-y-2 text-sm">
//                         <p><strong>Join Date:</strong> {selectedSupplier.joinDate}</p>
//                         <p><strong>Last Active:</strong> {selectedSupplier.lastActive}</p>
//                         <p><strong>Status:</strong> 
//                           <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(selectedSupplier.status)}`}>
//                             {selectedSupplier.status}
//                           </span>
//                         </p>
//                         <p><strong>Total Products:</strong> {selectedSupplier.totalProducts}</p>
//                         <p><strong>Orders Completed:</strong> {selectedSupplier.ordersCompleted}</p>
//                         <p><strong>Total Revenue:</strong> ${selectedSupplier.revenue.toLocaleString()}</p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div>
//                     <h3 className="font-semibold mb-3">Specialties</h3>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedSupplier.specialties.map((specialty, index) => (
//                         <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
//                           {specialty}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'performance' && selectedSupplier.status === 'active' && (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <h4 className="font-semibold mb-2">On-Time Delivery</h4>
//                       <div className="flex items-center">
//                         <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
//                           <div
//                             className="bg-green-500 h-2 rounded-full"
//                             style={{ width: `${selectedSupplier.performance.onTimeDelivery}%` }}
//                           />
//                         </div>
//                         <span className="text-sm font-medium">{selectedSupplier.performance.onTimeDelivery}%</span>
//                       </div>
//                     </div>
                    
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <h4 className="font-semibold mb-2">Response Time</h4>
//                       <p className="text-2xl font-bold text-blue-600">{selectedSupplier.performance.responseTime}h</p>
//                       <p className="text-sm text-gray-600">Average response time</p>
//                     </div>
                    
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <h4 className="font-semibold mb-2">Customer Satisfaction</h4>
//                       <div className="flex items-center">
//                         {renderStars(selectedSupplier.performance.customerSatisfaction)}
//                         <span className="ml-2 font-medium">{selectedSupplier.performance.customerSatisfaction}</span>
//                       </div>
//                     </div>
                    
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                       <h4 className="font-semibold mb-2">Product Quality</h4>
//                       <div className="flex items-center">
//                         {renderStars(selectedSupplier.performance.productQuality)}
//                         <span className="ml-2 font-medium">{selectedSupplier.performance.productQuality}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'documents' && (
//                 <div className="space-y-4">
//                   <h3 className="font-semibold">Required Documents</h3>
//                   {Object.entries(selectedSupplier.documents).map(([docType, status]) => (
//                     <div key={docType} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
//                       <span className="font-medium capitalize">{docType.replace(/([A-Z])/g, ' $1')}</span>
//                       <div className="flex items-center gap-2">
//                         <span className={`px-2 py-1 text-xs rounded ${
//                           status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           status === 'expired' ? 'bg-red-100 text-red-800' :
//                           'bg-green-100 text-green-800'
//                         }`}>
//                           {status}
//                         </span>
//                         {status !== 'pending' && (
//                           <button className="text-blue-600 hover:text-blue-800 text-sm">
//                             View
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {activeTab === 'products' && (
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h3 className="font-semibold">Products ({selectedSupplier.totalProducts})</h3>
//                     <button className="text-blue-600 hover:text-blue-800 text-sm">
//                       View All Products
//                     </button>
//                   </div>
//                   <p className="text-gray-600">Product management interface would be integrated here.</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SupplierManagement;


import React, { useState, useEffect } from 'react';
import { 
  Building2, Star, Package, TrendingUp, Mail, Phone, MapPin, 
  Check, X, Eye, Edit, AlertTriangle, Search, Filter, Plus,
  Calendar, DollarSign, Award, Users, Loader, Save
} from 'lucide-react';

// Import Firebase modules
import { getDatabase, ref, set, push, get, onValue, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SupplierManagement = () => {
  // Get Firebase references
  const db = getDatabase();
  const auth = getAuth();
  
  // Supplier state
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Add modal form state
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    businessLicense: '',
    taxId: '',
    specialties: []
  });
  
  // Error state for add modal
  const [errors, setErrors] = useState({});
  
  // Loading state for add modal
  const [modalLoading, setModalLoading] = useState(false);
  
  // Error message for add modal
  const [apiError, setApiError] = useState(null);
  
  // Success state for add modal
  const [submitted, setSubmitted] = useState(false);

  // Fetch suppliers from Firebase on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        
        // Create ref to supplier collection
        const supplierRef = ref(db, 'supplier');
        
        // Set up real-time listener
        const unsubscribe = onValue(supplierRef, (snapshot) => {
          const suppliersList = [];
          
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              suppliersList.push({
                id: childSnapshot.key,
                ...childSnapshot.val(),
                // Set default values for any missing properties
                revenue: childSnapshot.val().revenue || 0,
                totalProducts: childSnapshot.val().totalProducts || 0,
                ordersCompleted: childSnapshot.val().ordersCompleted || 0,
                rating: childSnapshot.val().rating || 0,
                specialties: childSnapshot.val().specialties || [],
                documents: childSnapshot.val().documents || {
                  businessLicense: 'pending',
                  taxCertificate: 'pending',
                  qualityCertification: 'pending'
                },
                performance: childSnapshot.val().performance || {
                  onTimeDelivery: 0,
                  responseTime: 0,
                  customerSatisfaction: 0,
                  productQuality: 0
                }
              });
            });
          }
          
          setSuppliers(suppliersList);
          setIsLoading(false);
        });
        
        // Return cleanup function
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        setIsLoading(false);
      }
    };
    
    fetchSuppliers();
  }, [db]);

  // Handle input changes for add modal
  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
    
    // Clear API error when any field changes
    if (apiError) {
      setApiError(null);
    }
  };

  // Handle adding a specialty
  const handleAddSpecialty = (specialty) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prevData => ({
        ...prevData,
        specialties: [...prevData.specialties, specialty],
        currentSpecialty: ''
      }));
    }
  };

  // Handle removing a specialty
  const handleRemoveSpecialty = (specialty) => {
    setFormData(prevData => ({
      ...prevData,
      specialties: prevData.specialties.filter(s => s !== specialty)
    }));
  };

  // Form validation for add modal
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.companyName) newErrors.companyName = "Company name is required";
    if (!formData.contactPerson) newErrors.contactPerson = "Contact person is required";
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    if (!formData.phone) newErrors.phone = "Phone number is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit for add modal
  const handleAddSupplier = async () => {
    if (validateForm()) {
      setModalLoading(true);
      
      try {
        // Create the supplier object without confirmPassword
        const supplierData = {
          ...formData,
          role: 'supplier',
          totalProducts: 0,
          ordersCompleted: 0,
          revenue: 0,
          rating: 0
        };
        
        // Remove confirmPassword and currentSpecialty as they're not needed
        delete supplierData.confirmPassword;
        delete supplierData.currentSpecialty;
        
        // Check if email already exists in supplier collection
        const supplierRef = ref(db, 'supplier');
        const emailQuery = query(supplierRef, orderByChild('email'), equalTo(supplierData.email));
        const snapshot = await get(emailQuery);
        
        if (snapshot.exists()) {
          throw new Error('email already exists');
        }
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          supplierData.email, 
          supplierData.password
        );
        
        // Get the Firebase Auth UID
        const uid = userCredential.user.uid;
        
        // Remove password before storing in database
        const { password, ...dataToStore } = supplierData;
        
        // Store in supplier collection
        await set(ref(db, `supplier/user-${uid}`), {
          ...dataToStore,
          uid,
          status: 'active',
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          documents: {
            businessLicense: supplierData.businessLicense ? 'approved' : 'pending',
            taxCertificate: 'pending',
            qualityCertification: 'pending'
          },
          performance: {
            onTimeDelivery: 0,
            responseTime: 0,
            customerSatisfaction: 0,
            productQuality: 0
          }
        });
        
        // Also store in users collection for cross-reference
        await set(ref(db, `users/supplier_${Date.now()}`), {
          ...dataToStore,
          uid,
          role: 'supplier',
          status: 'active',
          createdAt: new Date().toISOString()
        });
        
        // Show success state
        setSubmitted(true);
        
        // Reset form and close modal after delay
        setTimeout(() => {
          setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            address: '',
            businessLicense: '',
            taxId: '',
            specialties: []
          });
          setSubmitted(false);
          setShowAddModal(false);
        }, 1500);
      } catch (error) {
        console.error('Error adding supplier:', error);
        
        // Handle specific errors
        if (error.message.includes('email already exists') || error.code === 'auth/email-already-in-use') {
          setErrors(prev => ({
            ...prev,
            email: 'This email is already registered'
          }));
        } else {
          // Set general API error
          setApiError(error.message || 'Failed to add supplier. Please try again.');
        }
      } finally {
        setModalLoading(false);
      }
    }
  };

  // Update supplier status
  const updateSupplierStatus = async (supplierId, newStatus) => {
    try {
      // Update status in Firebase
      await update(ref(db, `supplier/${supplierId}`), {
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
      
      // No need to update local state as the onValue listener will handle it
    } catch (error) {
      console.error("Error updating supplier status:", error);
      alert(`Failed to update supplier status: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const supplierStats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'active').length,
    pending: suppliers.filter(s => s.status === 'pending').length,
    suspended: suppliers.filter(s => s.status === 'suspended').length,
    totalRevenue: suppliers.reduce((sum, s) => sum + (s.revenue || 0), 0),
    avgRating: suppliers.filter(s => s.rating > 0).reduce((sum, s) => sum + s.rating, 0) / 
              (suppliers.filter(s => s.rating > 0).length || 1)
  };

  // Add Supplier Modal
  const AddSupplierModal = () => {
    if (!showAddModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Added!</h3>
                <p className="text-gray-600">Successfully registered with login credentials</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Add New Supplier</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={modalLoading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {apiError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                    {apiError}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      disabled={modalLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Contact Person"
                      value={formData.contactPerson || ''}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      disabled={modalLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={modalLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password || ''}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      disabled={modalLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword || ''}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      disabled={modalLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={modalLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Address"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={modalLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Business License Number"
                      value={formData.businessLicense || ''}
                      onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                      disabled={modalLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Tax ID"
                      value={formData.taxId || ''}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      disabled={modalLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Add specialty"
                        value={formData.currentSpecialty || ''}
                        onChange={(e) => handleInputChange('currentSpecialty', e.target.value)}
                        disabled={modalLoading}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSpecialty(formData.currentSpecialty)}
                        disabled={!formData.currentSpecialty || modalLoading}
                        className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                    
                    {formData.specialties && formData.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.specialties.map((specialty, index) => (
                          <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            <span className="text-xs">{specialty}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSpecialty(specialty)}
                              disabled={modalLoading}
                              className="ml-1 text-blue-800 hover:text-blue-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => setShowAddModal(false)}
                      disabled={modalLoading}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSupplier}
                      disabled={modalLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                    >
                      {modalLoading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Add Supplier
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Supplier Management</h1>
        <p className="text-gray-600">Manage supplier partnerships and performance</p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{supplierStats.total}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{supplierStats.active}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{supplierStats.pending}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-red-600">{supplierStats.suspended}</p>
            </div>
            <X className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${supplierStats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{supplierStats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
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
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
            Add Supplier
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Suppliers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSuppliers.map(supplier => (
              <div key={supplier.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{supplier.companyName}</h3>
                        <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
                      {supplier.status?.charAt(0).toUpperCase() + supplier.status?.slice(1)}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{supplier.phone}</span>
                    </div>
                    {supplier.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{supplier.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3 mb-4">
                    {supplier.status === 'active' && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rating</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(supplier.rating)}
                            <span className="text-sm font-medium ml-1">{supplier.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Products</span>
                          <span className="text-sm font-medium">{supplier.totalProducts}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Orders</span>
                          <span className="text-sm font-medium">{supplier.ordersCompleted}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Revenue</span>
                          <span className="text-sm font-medium text-green-600">${supplier.revenue?.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Specialties */}
                  {supplier.specialties && supplier.specialties.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {supplier.specialties.slice(0, 3).map((specialty, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            {specialty}
                          </span>
                        ))}
                        {supplier.specialties.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{supplier.specialties.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedSupplier(supplier)}
                      className="w-full flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    
                    <div className="flex gap-2">
                      {supplier.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateSupplierStatus(supplier.id, 'active')}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateSupplierStatus(supplier.id, 'suspended')}
                            className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                      
                      {supplier.status === 'active' && (
                        <button
                          onClick={() => updateSupplierStatus(supplier.id, 'suspended')}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Suspend
                        </button>
                      )}
                      
                      {supplier.status === 'suspended' && (
                        <button
                          onClick={() => updateSupplierStatus(supplier.id, 'active')}
                          className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Reactivate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSuppliers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No suppliers found matching your criteria</p>
            </div>
          )}
        </>
      )}

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedSupplier.companyName}</h2>
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                {['overview', 'performance', 'documents', 'products'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Company Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Contact Person:</strong> {selectedSupplier.contactPerson}</p>
                        <p><strong>Email:</strong> {selectedSupplier.email}</p>
                        <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
                        <p><strong>Address:</strong> {selectedSupplier.address || 'Not provided'}</p>
                        <p><strong>Business License:</strong> {selectedSupplier.businessLicense || 'Not provided'}</p>
                        <p><strong>Tax ID:</strong> {selectedSupplier.taxId || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Business Metrics</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Join Date:</strong> {selectedSupplier.createdAt ? new Date(selectedSupplier.createdAt).toLocaleDateString() : 'Not available'}</p>
                        <p><strong>Last Active:</strong> {selectedSupplier.lastActive ? new Date(selectedSupplier.lastActive).toLocaleDateString() : 'Not available'}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(selectedSupplier.status)}`}>
                            {selectedSupplier.status}
                          </span>
                        </p>
                        <p><strong>Total Products:</strong> {selectedSupplier.totalProducts || 0}</p>
                        <p><strong>Orders Completed:</strong> {selectedSupplier.ordersCompleted || 0}</p>
                        <p><strong>Total Revenue:</strong> ${(selectedSupplier.revenue || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedSupplier.specialties && selectedSupplier.specialties.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.specialties.map((specialty, index) => (
                          <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'performance' && selectedSupplier.status === 'active' && (
                <div className="space-y-6">
                  {selectedSupplier.performance ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">On-Time Delivery</h4>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${selectedSupplier.performance.onTimeDelivery || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{selectedSupplier.performance.onTimeDelivery || 0}%</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Response Time</h4>
                        <p className="text-2xl font-bold text-blue-600">{selectedSupplier.performance.responseTime || 0}h</p>
                        <p className="text-sm text-gray-600">Average response time</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Customer Satisfaction</h4>
                        <div className="flex items-center">
                          {renderStars(selectedSupplier.performance.customerSatisfaction || 0)}
                          <span className="ml-2 font-medium">{selectedSupplier.performance.customerSatisfaction || 0}</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Product Quality</h4>
                        <div className="flex items-center">
                          {renderStars(selectedSupplier.performance.productQuality || 0)}
                          <span className="ml-2 font-medium">{selectedSupplier.performance.productQuality || 0}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No performance data available yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Required Documents</h3>
                  {selectedSupplier.documents && Object.entries(selectedSupplier.documents).map(([docType, status]) => (
                    <div key={docType} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className="font-medium capitalize">{docType.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {status}
                        </span>
                        {status !== 'pending' && (
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Products ({selectedSupplier.totalProducts || 0})</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View All Products
                    </button>
                  </div>
                  <p className="text-gray-600">Product management interface would be integrated here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add Supplier Modal */}
      <AddSupplierModal />
    </div>
  );
};

export default SupplierManagement;