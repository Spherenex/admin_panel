// import React, { useState } from 'react';
// import { 
//   Package, 
//   Upload, 
//   TrendingUp, 
//   ShoppingCart, 
//   AlertCircle, 
//   DollarSign,
//   Clock,
//   CheckCircle,
//   Truck,
//   List,
//   XCircle,
//   RefreshCw,
//   Search,
//   Filter
// } from 'lucide-react';

// const SupplierDashboard = () => {
//   // State for active tab and dashboard data
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [formData, setFormData] = useState({
//     name: '',
//     category: '',
//     currentStock: '',
//     minStock: '',
//     price: '',
//     expiryDate: '',
//     batchNumber: ''
//   });

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     console.log('Submitting form data:', formData);
//     // Would typically send to API here
//     alert('Medicine uploaded successfully!');
//     setFormData({
//       name: '',
//       category: '',
//       currentStock: '',
//       minStock: '',
//       price: '',
//       expiryDate: '',
//       batchNumber: ''
//     });
//     setActiveTab('dashboard');
//   };

//   // Mock dashboard data - in a real app, this would come from an API
//   const dashboardData = {
//     totalProducts: 156,
//     pendingOrders: 23,
//     monthlyRevenue: 45000,
//     lowStockItems: 8,
//     recentOrders: [
//       { id: 'ORD001', customerName: 'City Veterinary Clinic', medicine: 'Amoxicillin 500mg', quantity: 100, status: 'pending', date: '2024-12-15', total: 1250.00 },
//       { id: 'ORD002', customerName: 'Animal Care Center', medicine: 'Metacam 1.5mg/ml', quantity: 50, status: 'shipped', date: '2024-12-14', total: 1250.75 },
//       { id: 'ORD003', customerName: 'Pet Emergency Hospital', medicine: 'Frontline Plus', quantity: 75, status: 'delivered', date: '2024-12-13', total: 3450.25 },
//       { id: 'ORD004', customerName: 'Rural Vet Services', medicine: 'Rimadyl 25mg', quantity: 60, status: 'cancelled', date: '2024-12-12', total: 890.40 },
//       { id: 'ORD005', customerName: 'Companion Animal Hospital', medicine: 'Baytril 68mg', quantity: 40, status: 'delivered', date: '2024-12-10', total: 1560.80 }
//     ],
//     lowStockProducts: [
//       { name: 'Vetmedin 1.25mg', currentStock: 15, minStock: 50, maxStock: 300 },
//       { name: 'Rimadyl 25mg', currentStock: 8, minStock: 30, maxStock: 120 },
//       { name: 'Revolution for Cats', currentStock: 12, minStock: 25, maxStock: 75 },
//       { name: 'Metacam 1.5mg/ml', currentStock: 45, minStock: 50, maxStock: 200 },
//     ],
//     inventory: [
//       {
//         id: 1,
//         name: 'Amoxicillin 500mg',
//         category: 'Antibiotics',
//         currentStock: 250,
//         minStock: 100,
//         maxStock: 500,
//         price: 12.50,
//         expiryDate: '2025-08-15',
//         batchNumber: 'AMX2024001',
//         status: 'in-stock'
//       },
//       {
//         id: 2,
//         name: 'Metacam 1.5mg/ml',
//         category: 'Pain Relief',
//         currentStock: 45,
//         minStock: 50,
//         maxStock: 200,
//         price: 28.75,
//         expiryDate: '2025-06-20',
//         batchNumber: 'MTC2024002',
//         status: 'low-stock'
//       },
//       {
//         id: 3,
//         name: 'Frontline Plus Large Dog',
//         category: 'Parasiticides',
//         currentStock: 0,
//         minStock: 25,
//         maxStock: 100,
//         price: 45.99,
//         expiryDate: '2025-12-10',
//         batchNumber: 'FTL2024003',
//         status: 'out-of-stock'
//       },
//       {
//         id: 4,
//         name: 'Vetmedin 1.25mg',
//         category: 'Cardiac',
//         currentStock: 15,
//         minStock: 50,
//         maxStock: 300,
//         price: 55.20,
//         expiryDate: '2025-09-30',
//         batchNumber: 'VMD2024004',
//         status: 'low-stock'
//       },
//       {
//         id: 5,
//         name: 'Revolution for Cats',
//         category: 'Parasiticides',
//         currentStock: 12,
//         minStock: 25,
//         maxStock: 75,
//         price: 32.40,
//         expiryDate: '2025-07-18',
//         batchNumber: 'REV2024005',
//         status: 'low-stock'
//       }
//     ],
//     categories: ['All', 'Antibiotics', 'Pain Relief', 'Parasiticides', 'Cardiac', 'Vaccines', 'Supplements']
//   };

//   // Status helpers
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'processing': return 'bg-blue-100 text-blue-800';
//       case 'shipped': return 'bg-purple-100 text-purple-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       case 'in-stock': return 'bg-green-100 text-green-800';
//       case 'low-stock': return 'bg-yellow-100 text-yellow-800';
//       case 'out-of-stock': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <Clock className="w-4 h-4" />;
//       case 'processing': return <RefreshCw className="w-4 h-4" />;
//       case 'shipped': return <Truck className="w-4 h-4" />;
//       case 'delivered': return <CheckCircle className="w-4 h-4" />;
//       case 'cancelled': return <XCircle className="w-4 h-4" />;
//       case 'in-stock': return <CheckCircle className="w-4 h-4" />;
//       case 'low-stock': return <AlertCircle className="w-4 h-4" />;
//       case 'out-of-stock': return <XCircle className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   // Filter inventory based on search term and category
//   const filteredInventory = dashboardData.inventory
//     .filter(product => 
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (filterCategory === 'all' || filterCategory === 'All' || product.category === filterCategory)
//     );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
//               <p className="text-gray-600">Manage your veterinary medicine inventory and orders</p>
//             </div>

//             {/* Navigation Tabs */}
//             <div className="flex space-x-4 items-center">
//               <div className="border-b border-gray-200">
//                 <nav className="-mb-px flex space-x-6">
//                   <button
//                     onClick={() => setActiveTab('dashboard')}
//                     className={`py-2 font-medium text-sm ${
//                       activeTab === 'dashboard'
//                         ? 'border-b-2 border-blue-500 text-blue-600'
//                         : 'text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Dashboard
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('inventory')}
//                     className={`py-2 font-medium text-sm ${
//                       activeTab === 'inventory'
//                         ? 'border-b-2 border-blue-500 text-blue-600'
//                         : 'text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Inventory
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('orders')}
//                     className={`py-2 font-medium text-sm ${
//                       activeTab === 'orders'
//                         ? 'border-b-2 border-blue-500 text-blue-600'
//                         : 'text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Orders
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('upload')}
//                     className={`py-2 font-medium text-sm ${
//                       activeTab === 'upload'
//                         ? 'border-b-2 border-blue-500 text-blue-600'
//                         : 'text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Upload Medicine
//                   </button>
//                 </nav>
//               </div>

//               <button
//                 onClick={() => setActiveTab('upload')}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <Upload className="w-4 h-4" />
//                 <span>Upload Medicine</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === 'dashboard' && (
//           <>
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Total Products</p>
//                     <p className="text-3xl font-bold text-gray-900">{dashboardData.totalProducts}</p>
//                   </div>
//                   <Package className="w-8 h-8 text-blue-600" />
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Pending Orders</p>
//                     <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingOrders}</p>
//                   </div>
//                   <ShoppingCart className="w-8 h-8 text-yellow-600" />
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
//                     <p className="text-3xl font-bold text-gray-900">${dashboardData.monthlyRevenue.toLocaleString()}</p>
//                   </div>
//                   <DollarSign className="w-8 h-8 text-green-600" />
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
//                     <p className="text-3xl font-bold text-gray-900">{dashboardData.lowStockItems}</p>
//                   </div>
//                   <AlertCircle className="w-8 h-8 text-red-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Recent Orders */}
//               <div className="bg-white rounded-lg shadow">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
//                     <button
//                       onClick={() => setActiveTab('orders')}
//                       className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                     >
//                       View All
//                     </button>
//                   </div>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   {dashboardData.recentOrders.slice(0, 3).map((order) => (
//                     <div key={order.id} className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between mb-1">
//                             <p className="text-sm font-medium text-gray-900">{order.id}</p>
//                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                               {getStatusIcon(order.status)}
//                               <span className="ml-1 capitalize">{order.status}</span>
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-800">{order.customerName}</p>
//                           <p className="text-sm text-gray-600">{order.medicine}</p>
//                           <div className="flex justify-between mt-1">
//                             <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
//                             <p className="text-xs font-medium">${order.total.toFixed(2)}</p>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="text-xs text-gray-400 mt-2">{order.date}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Low Stock Alerts */}
//               <div className="bg-white rounded-lg shadow">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
//                     <button
//                       onClick={() => setActiveTab('inventory')}
//                       className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                     >
//                       Manage Inventory
//                     </button>
//                   </div>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   {dashboardData.lowStockProducts.map((product, index) => (
//                     <div key={index} className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-900">{product.name}</p>
//                           <div className="mt-1">
//                             <div className="flex items-center text-xs text-gray-600">
//                               <span>Current: {product.currentStock}</span>
//                               <span className="mx-2">•</span>
//                               <span>Min: {product.minStock}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center">
//                           <AlertCircle className="w-5 h-5 text-red-500" />
//                         </div>
//                       </div>
//                       <div className="mt-2">
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className="bg-red-600 h-2 rounded-full"
//                             style={{ width: `${Math.min((product.currentStock / product.minStock) * 100, 100)}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="mt-8 bg-white rounded-lg shadow p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <button
//                   onClick={() => setActiveTab('upload')}
//                   className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Upload className="w-6 h-6 text-blue-600" />
//                   <div>
//                     <p className="font-medium text-gray-900">Upload New Medicine</p>
//                     <p className="text-sm text-gray-600">Add products to your catalog</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('inventory')}
//                   className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Package className="w-6 h-6 text-green-600" />
//                   <div>
//                     <p className="font-medium text-gray-900">Manage Inventory</p>
//                     <p className="text-sm text-gray-600">Update stock levels</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('orders')}
//                   className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <ShoppingCart className="w-6 h-6 text-purple-600" />
//                   <div>
//                     <p className="font-medium text-gray-900">View Orders</p>
//                     <p className="text-sm text-gray-600">Manage order fulfillment</p>
//                   </div>
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {activeTab === 'inventory' && (
//           <div className="bg-white rounded-lg shadow overflow-hidden p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Inventory Management</h2>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={() => setActiveTab('upload')}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//                 >
//                   <Upload className="w-4 h-4" />
//                   <span>Add Product</span>
//                 </button>
//               </div>
//             </div>

//             {/* Search and Filter Controls */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//               >
//                 {dashboardData.categories.map(category => (
//                   <option key={category} value={category}>
//                     {category}
//                   </option>
//                 ))}
//               </select>

//               <div className="flex items-center space-x-2">
//                 <Filter className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm text-gray-600">
//                   {filteredInventory.length} products
//                 </span>
//               </div>
//             </div>

//             {/* Inventory Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredInventory.map((product) => (
//                 <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
//                       <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                         {product.category}
//                       </span>
//                     </div>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
//                       {getStatusIcon(product.status)}
//                       <span className="ml-1 capitalize">{product.status.replace('-', ' ')}</span>
//                     </span>
//                   </div>

//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Current Stock:</span>
//                       <span className="font-semibold">{product.currentStock}</span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Min/Max:</span>
//                       <span className="text-sm">{product.minStock}/{product.maxStock}</span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Price:</span>
//                       <span className="font-semibold">${product.price.toFixed(2)}</span>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <span className="text-sm text-gray-600">Expiry:</span>
//                       <span className="text-sm">{product.expiryDate}</span>
//                     </div>

//                     {/* Stock Level Bar */}
//                     <div className="mt-4">
//                       <div className="flex justify-between text-xs text-gray-600 mb-1">
//                         <span>Stock Level</span>
//                         <span>{Math.round((product.currentStock / product.maxStock) * 100)}%</span>
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div
//                           className={`h-2 rounded-full transition-all ${
//                             product.currentStock <= product.minStock
//                               ? 'bg-red-500'
//                               : product.currentStock <= product.minStock * 1.5
//                               ? 'bg-yellow-500'
//                               : 'bg-green-500'
//                           }`}
//                           style={{ width: `${Math.min((product.currentStock / product.maxStock) * 100, 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>

//                     {/* Quick Stock Update */}
//                     <div className="flex items-center space-x-2 mt-4">
//                       <input
//                         type="number"
//                         placeholder="Update stock"
//                         className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             // Handle stock update
//                             e.target.value = '';
//                           }
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {activeTab === 'orders' && (
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold">Order Management</h2>
//             </div>

//             {/* Orders Table */}
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Order ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {dashboardData.recentOrders.map((order) => (
//                     <tr key={order.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{order.id}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.customerName}</div>
//                         <div className="text-sm text-gray-500">{order.medicine}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.date}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                           {getStatusIcon(order.status)}
//                           <span className="ml-1 capitalize">{order.status}</span>
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         ${order.total.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
//                         {order.status === 'pending' && (
//                           <select
//                             className="text-xs border border-gray-300 rounded px-2 py-1"
//                             defaultValue=""
//                           >
//                             <option value="" disabled>Update Status</option>
//                             <option value="processing">Processing</option>
//                             <option value="shipped">Shipped</option>
//                             <option value="cancelled">Cancel</option>
//                           </select>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {activeTab === 'upload' && (
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-6">Upload New Medicine</h2>

//             <div className="space-y-6">
//               {/* Basic Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="e.g., Amoxicillin 500mg"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category *
//                   </label>
//                   <select
//                     name="category"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={formData.category}
//                     onChange={handleInputChange}
//                   >
//                     <option value="">Select Category</option>
//                     {dashboardData.categories.slice(1).map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Pricing & Inventory */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Stock *
//                   </label>
//                   <input
//                     type="number"
//                     name="currentStock"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0"
//                     value={formData.currentStock}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Minimum Stock *
//                   </label>
//                   <input
//                     type="number"
//                     name="minStock"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0"
//                     value={formData.minStock}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Price *
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="price"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="0.00"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               {/* Dates and Batch */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Expiry Date *
//                   </label>
//                   <input
//                     type="date"
//                     name="expiryDate"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={formData.expiryDate}
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Batch Number *
//                   </label>
//                   <input
//                     type="text"
//                     name="batchNumber"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="e.g., BAT2024001"
//                     value={formData.batchNumber}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//               </div>

//               {/* Submit buttons */}
//               <div className="flex justify-end space-x-3 mt-6">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//                   onClick={() => setActiveTab('dashboard')}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   onClick={handleSubmit}
//                 >
//                   Upload Medicine
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupplierDashboard;

// import { useState, useEffect } from 'react';
// import {
//   Package,
//   Upload,
//   TrendingUp,
//   ShoppingCart,
//   AlertCircle,
//   DollarSign,
//   Clock,
//   CheckCircle,
//   Truck,
//   List,
//   XCircle,
//   RefreshCw,
//   Search,
//   Filter,
//   Edit3,
//   Trash2,
//   Plus,
//   ShieldCheck
// } from 'lucide-react';
// import {
//   ref,
//   get,
//   set,
//   update,
//   remove,
//   push,
//   child,
//   query,
//   orderByChild,
//   onValue,
//   equalTo
// } from 'firebase/database';
// import { database } from '../../firebase/config'; // Adjust path as needed
// import { useAuth } from '../../context/AuthContext'; // Assuming you have an auth context
// // import { onValue, ref, get, child } from 'firebase/database';

// // Hardcoded orders data (will be moved to Firebase in a real implementation)
// const hardcodedOrders = [
//   {
//     id: 'ORD001',
//     customerName: 'City Veterinary Clinic',
//     customerEmail: 'orders@cityvethospital.com',
//     customerPhone: '+1-555-0123',
//     customerAddress: '123 Main St, Downtown, State 12345',
//     orderDate: '2024-12-15',
//     deliveryDate: '2024-12-18',
//     status: 'pending',
//     priority: 'normal',
//     totalAmount: 1875.50,
//     items: [
//       { id: 1, name: 'Amoxicillin 500mg', quantity: 100, price: 12.50, total: 1250.00 },
//       { id: 2, name: 'Metacam 1.5mg/ml', quantity: 25, price: 25.02, total: 625.50 }
//     ],
//     shippingMethod: 'Express Delivery',
//     trackingNumber: null,
//     notes: 'Urgent order for emergency cases'
//   },
//   // Other orders...
// ];

// const SupplierDashboard = () => {
//   // State for active tab and dashboard data
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [filterApproval, setFilterApproval] = useState('all');
//   const [inventory, setInventory] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [currentSupplier, setCurrentSupplier] = useState(null);
//   const [supplierOrders, setSupplierOrders] = useState([]);
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState({
//     totalProducts: 0,
//     pendingOrders: 0,
//     monthlyRevenue: 0,
//     lowStockItems: 0,
//     recentOrders: [],
//     lowStockProducts: []
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [dbStatus, setDbStatus] = useState(null);

//   // Add product modal state
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);



//   const fetchCurrentSupplier = async () => {
//     if (!user || !user.uid) return;

//     try {
//       // Query supplier by user ID
//       const suppliersRef = ref(database, 'supplier');
//       const supplierQuery = query(suppliersRef, orderByChild('userId'), equalTo(user.uid));

//       const snapshot = await get(supplierQuery);

//       if (snapshot.exists()) {
//         // Get the first supplier associated with this user
//         const suppliersData = snapshot.val();
//         const supplierId = Object.keys(suppliersData)[0];

//         setCurrentSupplier({
//           id: supplierId,
//           ...suppliersData[supplierId]
//         });

//         console.log("Current supplier fetched:", supplierId);

//         // After getting supplier ID, fetch their orders
//         fetchSupplierOrders(supplierId);
//       } else {
//         console.log("No supplier found for current user");
//         setError("No supplier account found for your user. Please contact admin.");
//       }
//     } catch (error) {
//       console.error("Error fetching supplier details:", error);
//       setError(`Failed to load supplier details: ${error.message}`);
//     }
//   };

//   const fetchSupplierOrders = (supplierId) => {
//     if (!supplierId) return;

//     try {
//       console.log("Fetching orders for supplier:", supplierId);

//       const ordersRef = ref(database, 'orders');

//       // Listen for orders changes
//       const unsubscribe = onValue(ordersRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const ordersData = snapshot.val();
//           const allOrders = Object.keys(ordersData).map(key => ({
//             id: key,
//             ...ordersData[key]
//           }));

//           // Filter orders by supplier ID
//           const filteredOrders = allOrders.filter(order => order.supplierId === supplierId);

//           console.log(`Found ${filteredOrders.length} orders for supplier ${supplierId}`);
//           setSupplierOrders(filteredOrders);

//           // Update orders state for the dashboard display
//           setOrders(filteredOrders);
//         } else {
//           setSupplierOrders([]);
//           setOrders([]);
//         }
//       });

//       // Return cleanup function
//       return unsubscribe;
//     } catch (error) {
//       console.error("Error fetching supplier orders:", error);
//       setError(`Failed to load orders: ${error.message}`);
//     }
//   };




//   // Add product form state
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     category: '',
//     description: '',
//     activeIngredient: '',
//     dosageForm: '',
//     strength: '',
//     packSize: '',
//     minStock: 0,
//     maxStock: 0,
//     price: 0,
//     expiryDate: '',
//     batchNumber: '',
//     manufacturer: '',
//     species: ''
//   });

//   const categories = ['all', 'Antibiotics', 'Pain Relief', 'Parasiticides', 'Cardiac', 'Vaccines', 'Supplements', 'Anesthetics', 'Surgical', 'Dermatology', 'Ophthalmology', 'Emergency Care'];
//   const approvalStatuses = ['all', 'pending', 'approved', 'rejected'];

//   // Reference to medicines in the database
//   const medicinesRef = ref(database, 'medicines');
//   const ordersRef = ref(database, 'orders');

//   // Test database connection and create medicines node if it doesn't exist
//   const testDbConnection = async () => {
//     try {
//       console.log("Testing database connection...");
//       // Check if medicines node exists
//       const dbRef = ref(database);
//       const snapshot = await get(child(dbRef, 'medicines'));

//       if (!snapshot.exists()) {
//         console.log("Medicines node does not exist in database. Creating it...");
//         setDbStatus("Creating medicines collection in database...");
//       } else {
//         console.log("Medicines node exists in database!");
//         setDbStatus("");
//       }
//     } catch (error) {
//       console.error("Database connection test failed:", error);
//       setDbStatus(`Database connection error: ${error.message}`);
//       setError(`Database connection error: ${error.message}. Check your Firebase configuration.`);
//     }
//   };

//   // Print the database URL to console for debugging
//   useEffect(() => {
//     const dbURL = database._databaseId && database._databaseId.url;
//     console.log("Connected to Firebase database:", dbURL);
//     console.log("Medicines reference path:", medicinesRef.toString());

//     // Test database connection on component mount
//     testDbConnection();
//   }, []);

//   // Initialize data from Firebase on component mount
//   useEffect(() => {
//     setLoading(true);

//     try {
//       // Check admin status from localStorage
//       try {
//         const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
//         setIsAdmin(userIsAdmin);
//       } catch (adminError) {
//         console.error("Error reading admin status:", adminError);
//       }

//       // Set up real-time listener for medicines
//       console.log("Setting up real-time listener for medicines...");
//       const unsubscribeMedicines = onValue(medicinesRef, (snapshot) => {
//         console.log("Medicines data update received:", snapshot.exists() ? "Data exists" : "No data");

//         if (snapshot.exists()) {
//           // Convert Firebase object to array
//           const medicinesData = snapshot.val();
//           console.log("Raw medicines data:", medicinesData);

//           const medicinesArray = Object.entries(medicinesData).map(([key, value]) => ({
//             id: key,
//             ...value
//           }));
//           console.log("Processed medicines array:", medicinesArray);

//           setInventory(medicinesArray);
//         } else {
//           console.log("No medicines found in database");
//           setInventory([]);
//         }
//       }, (error) => {
//         console.error("Error loading inventory:", error);
//         setError(`Failed to load inventory data: ${error.message}. Please refresh the page.`);
//         setInventory([]);
//       });

//       // For orders, we'll use the hardcoded data for now
//       // In a real implementation, you would set up another onValue listener for orders
//       setOrders(hardcodedOrders);

//       setLoading(false);

//       // Return cleanup function
//       return () => {
//         unsubscribeMedicines();
//       };
//     } catch (error) {
//       console.error("Error initializing data:", error);
//       setError("Failed to load dashboard data. Please refresh the page.");
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCurrentSupplier();

//     // Cleanup on unmount
//     return () => {
//       // Any cleanup needed
//     };
//   }, [user?.uid]);

//   // Recalculate dashboard metrics whenever inventory or orders change
//   useEffect(() => {
//     calculateDashboardMetrics();
//   }, [inventory, orders]);

//   // Toggle admin mode with safer localStorage access
//   const toggleAdminMode = () => {
//     const newAdminState = !isAdmin;
//     setIsAdmin(newAdminState);
//     try {
//       localStorage.setItem('isAdmin', newAdminState);
//     } catch (error) {
//       console.error("Error saving admin state to localStorage:", error);
//       // Continue anyway, state is in memory
//     }
//     setSuccessMessage(newAdminState ? 'Admin mode activated' : 'Admin mode deactivated');
//     setTimeout(() => setSuccessMessage(null), 3000);
//   };


//   const calculateDashboardMetrics = () => {
//     if (!inventory.length && !supplierOrders.length) return;

//     // Get low stock products
//     const lowStockProducts = inventory.filter(product =>
//       product.status === 'low-stock' || product.status === 'out-of-stock'
//     );

//     // Calculate monthly revenue (assuming current month)
//     const today = new Date();
//     const currentMonth = today.getMonth();
//     const currentYear = today.getFullYear();

//     const monthlyRevenue = supplierOrders
//       .filter(order => {
//         const orderDate = new Date(order.orderDate);
//         return orderDate.getMonth() === currentMonth &&
//           orderDate.getFullYear() === currentYear &&
//           order.status === 'delivered';
//       })
//       .reduce((sum, order) => sum + order.totalAmount, 0);

//     // Get pending orders
//     const pendingOrders = supplierOrders.filter(order => order.status === 'pending').length;

//     // Sort orders by date (newest first) for recent orders
//     const recentOrders = [...supplierOrders].sort((a, b) =>
//       new Date(b.orderDate) - new Date(a.orderDate)
//     ).slice(0, 5);

//     setDashboardData({
//       totalProducts: inventory.length,
//       pendingOrders,
//       monthlyRevenue,
//       lowStockItems: lowStockProducts.length,
//       recentOrders,
//       lowStockProducts: lowStockProducts.slice(0, 4) // Top 4 low stock items
//     });
//   };

//   // Status helpers
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'processing': return 'bg-blue-100 text-blue-800';
//       case 'shipped': return 'bg-purple-100 text-purple-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       case 'in-stock': return 'bg-green-100 text-green-800';
//       case 'low-stock': return 'bg-yellow-100 text-yellow-800';
//       case 'out-of-stock': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getApprovalStatusColor = (approvalStatus) => {
//     switch (approvalStatus) {
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <Clock className="w-4 h-4" />;
//       case 'processing': return <RefreshCw className="w-4 h-4" />;
//       case 'shipped': return <Truck className="w-4 h-4" />;
//       case 'delivered': return <CheckCircle className="w-4 h-4" />;
//       case 'cancelled': return <XCircle className="w-4 h-4" />;
//       case 'in-stock': return <CheckCircle className="w-4 h-4" />;
//       case 'low-stock': return <AlertCircle className="w-4 h-4" />;
//       case 'out-of-stock': return <XCircle className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   const getApprovalStatusIcon = (approvalStatus) => {
//     switch (approvalStatus) {
//       case 'approved': return <ShieldCheck className="w-4 h-4" />;
//       case 'pending': return <Clock className="w-4 h-4" />;
//       case 'rejected': return <XCircle className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   // Filter inventory based on search term and category
//   const filteredInventory = inventory
//     .filter(product =>
//       product.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (filterCategory === 'all' || filterCategory === 'All' || product.category === filterCategory) &&
//       (filterApproval === 'all' || product.approvalStatus === filterApproval)
//     );

//   // Handle updating product stock
//   const handleUpdateStock = async (productId, newStock) => {
//     try {
//       console.log(`Updating stock for product ${productId} to ${newStock}`);

//       // Find the product
//       const product = inventory.find(p => p.id === productId);

//       // Only allow stock updates for approved products
//       if (product.approvalStatus !== 'approved') {
//         setError("Cannot update stock for products that haven't been approved.");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }

//       const parsedStock = parseInt(newStock);
//       const newStatus = parsedStock === 0 ? 'out-of-stock' :
//         parsedStock <= product.minStock ? 'low-stock' : 'in-stock';

//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         currentStock: parsedStock,
//         status: newStatus
//       });

//       console.log(`Stock for product ${productId} updated successfully to ${newStock}`);
//       setSuccessMessage("Stock updated successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error updating stock:", error);
//       setError(`Failed to update stock: ${error.message}. Please try again.`);
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   // Handle adding a new product
//   const handleAddProduct = async () => {
//     try {
//       console.log("Adding new product:", newProduct);

//       // Form validation
//       if (!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber) {
//         setError("Please fill out all required fields");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }

//       // Process species from string to array
//       const speciesArray = newProduct.species
//         ? newProduct.species.split(',').map(s => s.trim()).filter(s => s)
//         : [];

//       // Structure product data
//       const productToAdd = {
//         name: newProduct.name,
//         category: newProduct.category,
//         description: newProduct.description,
//         activeIngredient: newProduct.activeIngredient,
//         dosageForm: newProduct.dosageForm,
//         strength: newProduct.strength,
//         packSize: newProduct.packSize,
//         minStock: parseInt(newProduct.minStock) || 0,
//         maxStock: parseInt(newProduct.maxStock) || 0,
//         currentStock: 0,
//         price: parseFloat(newProduct.price) || 0,
//         expiryDate: newProduct.expiryDate,
//         batchNumber: newProduct.batchNumber,
//         manufacturer: newProduct.manufacturer,
//         species: speciesArray,
//         status: 'out-of-stock',      // Stock status 
//         approvalStatus: 'pending',   // Approval status
//         timestamp: Date.now(),       // For sorting
//         createdAt: new Date().toISOString()
//       };

//       console.log("Structured product data:", productToAdd);

//       // Add to Firebase with generated key
//       const newProductRef = push(medicinesRef);
//       console.log("New product reference:", newProductRef.key);

//       await set(newProductRef, productToAdd);
//       console.log("Product added successfully with ID:", newProductRef.key);

//       // Reset form
//       setNewProduct({
//         name: '',
//         category: '',
//         description: '',
//         activeIngredient: '',
//         dosageForm: '',
//         strength: '',
//         packSize: '',
//         minStock: 0,
//         maxStock: 0,
//         price: 0,
//         expiryDate: '',
//         batchNumber: '',
//         manufacturer: '',
//         species: ''
//       });

//       // Close modal
//       setShowAddModal(false);

//       // Show success message
//       setSuccessMessage("Product added successfully and is awaiting admin approval");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setError(`Failed to add product: ${error.message}. Please try again.`);
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   // Handle adding a test product
//   const handleAddTestProduct = async () => {
//     try {
//       console.log("Adding test product to verify database connection...");

//       // Simple test product
//       const testProduct = {
//         name: `Test Product ${new Date().toISOString()}`,
//         category: "Test",
//         description: "Test product to verify database connection",
//         currentStock: 5,
//         minStock: 2,
//         maxStock: 10,
//         price: 9.99,
//         expiryDate: new Date().toISOString().split('T')[0],
//         batchNumber: "TEST-" + Math.floor(Math.random() * 1000),
//         status: "in-stock",
//         approvalStatus: "approved",
//         timestamp: Date.now(),
//         createdAt: new Date().toISOString()
//       };

//       // Add to Firebase with generated key
//       const testProductRef = push(medicinesRef);
//       await set(testProductRef, testProduct);

//       console.log("Test product added successfully with ID:", testProductRef.key);
//       setSuccessMessage("Test product added successfully to verify database connection");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error adding test product:", error);
//       setError(`Failed to add test product: ${error.message}. Please check your database connection.`);
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   // Handle order status update
//   // const handleUpdateOrderStatus = async (orderId, newStatus) => {
//   //   try {
//   //     // In a real implementation, this would update the order in Firebase
//   //     // For now, we're just updating the local state
//   //     const updatedOrders = orders.map(order => 
//   //       order.id === orderId ? { ...order, status: newStatus } : order
//   //     );

//   //     setOrders(updatedOrders);
//   //     setSuccessMessage(`Order status updated to ${newStatus}`);
//   //     setTimeout(() => setSuccessMessage(null), 3000);
//   //   } catch (error) {
//   //     console.error("Error updating order status:", error);
//   //     setError("Failed to update order status. Please try again.");
//   //     setTimeout(() => setError(null), 3000);
//   //   }
//   // };
//   const handleUpdateOrderStatus = async (orderId, newStatus) => {
//     try {
//       console.log(`Updating status for order ${orderId} to ${newStatus}`);

//       // Update in Firebase
//       const orderRef = ref(database, `orders/${orderId}`);
//       await update(orderRef, {
//         status: newStatus,
//         updatedAt: new Date().toISOString(),
//         updatedBy: currentSupplier?.id || 'supplier'
//       });

//       // Update local state
//       const updatedOrders = supplierOrders.map(order =>
//         order.id === orderId ? { ...order, status: newStatus } : order
//       );

//       setSupplierOrders(updatedOrders);
//       setOrders(updatedOrders);

//       setSuccessMessage(`Order status updated to ${newStatus}`);
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       setError("Failed to update order status. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };


//   // Handle approve product
//   const handleApproveProduct = async (productId) => {
//     try {
//       console.log(`Approving product ${productId}`);

//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         approvalStatus: 'approved'
//       });

//       console.log(`Product ${productId} approved successfully`);
//       setSuccessMessage("Product approved successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error approving product:", error);
//       setError(`Failed to approve product: ${error.message}. Please try again.`);
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   // Handle reject product
//   const handleRejectProduct = async (productId) => {
//     try {
//       console.log(`Rejecting product ${productId}`);

//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         approvalStatus: 'rejected'
//       });

//       console.log(`Product ${productId} rejected successfully`);
//       setSuccessMessage("Product rejected");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error rejecting product:", error);
//       setError(`Failed to reject product: ${error.message}. Please try again.`);
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
//               <p className="text-gray-600">Manage your veterinary medicine inventory and orders</p>
//               {dbStatus && (
//                 <p className="text-xs text-gray-500 mt-1">{dbStatus}</p>
//               )}
//             </div>


//             <div className="flex space-x-4 items-center gap-4">
//               <div className="border-b border-gray-200">
//                 <nav className="-mb-px flex space-x-6">
//                   <button
//                     onClick={() => setActiveTab('dashboard')}
//                     className={`py-2 font-medium text-sm ${activeTab === 'dashboard'
//                         ? 'border-b-2 border-white-500 text-white-600'
//                         : 'text-white-500 hover:text-gray-700'
//                       }`}
//                   >
//                     Dashboard
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('inventory')}
//                     className={`py-2 font-medium text-sm ${activeTab === 'inventory'
//                         ? 'border-b-2 border-white-500 text-blue-600'
//                         : 'text-white-500 hover:text-gray-700'
//                       }`}
//                   >
//                     Inventory
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('orders')}
//                     className={`py-2 font-medium text-sm ${activeTab === 'orders'
//                         ? 'border-b-2 border-white-500 text-blue-600'
//                         : 'text-white-500 hover:text-gray-700'
//                       }`}
//                   >
//                     Orders
//                   </button>
//                 </nav>
//               </div>

//               <button
//                 onClick={(e) => {
//                   e.preventDefault(); // Prevent any default navigation
//                   setShowAddModal(true); // Show the modal instead of navigating
//                 }}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <Upload className="w-4 h-4" />
//                 <span>Add Product</span>
//               </button>

//               {/* <button 
//                 onClick={handleAddTestProduct}
//                 className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
//               >
//                 <AlertCircle className="w-4 h-4" />
//                 <span>Test DB</span>
//               </button> */}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-red-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Success Message */}
//         {successMessage && (
//           <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-green-700">{successMessage}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'dashboard' && (
//           <>
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Total Products</p>
//                     <p className="text-3xl font-bold text-gray-900">{dashboardData.totalProducts}</p>
//                   </div>
//                   <Package className="w-8 h-8 text-blue-600" />
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Pending Orders</p>
//                     <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingOrders}</p>
//                   </div>
//                   <ShoppingCart className="w-8 h-8 text-yellow-600" />
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
//                     <p className="text-3xl font-bold text-gray-900">₹{dashboardData.monthlyRevenue.toLocaleString()}</p>
//                   </div>

//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
//                     <p className="text-3xl font-bold text-gray-900">{dashboardData.lowStockItems}</p>
//                   </div>
//                   <AlertCircle className="w-8 h-8 text-red-600" />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Recent Orders */}
//               <div className="bg-white rounded-lg shadow">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
//                     <button
//                       onClick={() => setActiveTab('orders')}
//                       className="text-white-600 hover:text-blue-800 text-sm font-medium"
//                     >
//                       View All
//                     </button>
//                   </div>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   {dashboardData.recentOrders.length === 0 ? (
//                     <div className="p-6 text-center">
//                       <p className="text-gray-500">No recent orders</p>
//                     </div>
//                   ) : (
//                     dashboardData.recentOrders.slice(0, 3).map((order) => (
//                       <div key={order.id} className="p-6">
//                         <div className="flex items-center justify-between">
//                           <div className="flex-1">
//                             <div className="flex items-center justify-between mb-1">
//                               <p className="text-sm font-medium text-gray-900">{order.id}</p>
//                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                                 {getStatusIcon(order.status)}
//                                 <span className="ml-1 capitalize">{order.status}</span>
//                               </span>
//                             </div>
//                             <p className="text-sm text-gray-800">{order.customerName}</p>
//                             {order.items && order.items.length > 0 && (
//                               <p className="text-sm text-gray-600">{order.items[0].name} {order.items.length > 1 ? `+ ${order.items.length - 1} more` : ''}</p>
//                             )}
//                             <div className="flex justify-between mt-1">
//                               <p className="text-xs text-gray-500">
//                                 Qty: {order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 'N/A'}
//                               </p>
//                               <p className="text-xs font-medium">₹{order.totalAmount.toFixed(2)}</p>
//                             </div>
//                           </div>
//                         </div>
//                         <p className="text-xs text-gray-400 mt-2">{new Date(order.orderDate).toLocaleDateString()}</p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>

//               {/* Low Stock Alerts */}
//               <div className="bg-white rounded-lg shadow">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
//                     <button
//                       onClick={() => setActiveTab('inventory')}
//                       className="text-white-600 hover:text-blue-800 text-sm font-medium"
//                     >
//                       Manage Inventory
//                     </button>
//                   </div>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   {dashboardData.lowStockProducts.length === 0 ? (
//                     <div className="p-6 text-center">
//                       <p className="text-gray-500">No low stock items</p>
//                     </div>
//                   ) : (
//                     dashboardData.lowStockProducts.map((product, index) => (
//                       <div key={product.id || index} className="p-6">
//                         <div className="flex items-center justify-between">
//                           <div className="flex-1">
//                             <p className="text-sm font-medium text-gray-900">{product.name}</p>
//                             <div className="mt-1">
//                               <div className="flex items-center text-xs text-gray-600">
//                                 <span>Current: {product.currentStock}</span>
//                                 <span className="mx-2">•</span>
//                                 <span>Min: {product.minStock}</span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex items-center">
//                             {product.currentStock === 0 ? (
//                               <XCircle className="w-5 h-5 text-red-500" />
//                             ) : (
//                               <AlertCircle className="w-5 h-5 text-yellow-500" />
//                             )}
//                           </div>
//                         </div>
//                         <div className="mt-2">
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className={`h-2 rounded-full ${product.currentStock === 0 ? 'bg-red-600' : 'bg-yellow-500'}`}
//                               style={{ width: `${Math.min((product.currentStock / product.minStock) * 100, 100)}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="mt-8 bg-white rounded-lg shadow p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <button
//                   onClick={() => setShowAddModal(true)}
//                   className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Upload className="w-6 h-6 text-blue-600" />
//                   <div>
//                     <p className="font-medium text-gray-900">Add New Medicine</p>
//                     <p className="text-sm text-gray-600">Add products to your catalog</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('inventory')}
//                   className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <Package className="w-6 h-6 text-green-600" />
//                   <div>
//                     <p className="font-medium text-gray-900">Manage Inventory</p>
//                     <p className="text-sm text-gray-600">Update stock levels</p>
//                   </div>
//                 </button>

//                 <button
//                   onClick={() => setActiveTab('orders')}
//                   className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   <ShoppingCart className="w-6 h-6 text-purple-600" />
//                   <div>
//                     <p className="font-medium text-gray-900">View Orders</p>
//                     <p className="text-sm text-gray-600">Manage order fulfillment</p>
//                   </div>
//                 </button>
//               </div>
//             </div>
//           </>
//         )}

//         {activeTab === 'inventory' && (
//           <div className="bg-white rounded-lg shadow overflow-hidden p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Inventory Management</h2>
//               <div className="flex space-x-3">
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault(); // Prevent any default navigation
//                     setShowAddModal(true); // Show the modal instead of navigating
//                   }}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span>Add Product</span>
//                 </button>
//               </div>
//             </div>

//             {/* Search and Filter Controls */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filterCategory}
//                 onChange={(e) => setFilterCategory(e.target.value)}
//               >
//                 {categories.map(category => (
//                   <option key={category} value={category}>
//                     {category === 'all' ? 'All Categories' : category}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filterApproval}
//                 onChange={(e) => setFilterApproval(e.target.value)}
//               >
//                 {approvalStatuses.map(status => (
//                   <option key={status} value={status}>
//                     {status === 'all' ? 'All Approval Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
//                   </option>
//                 ))}
//               </select>

//               <div className="flex items-center space-x-2">
//                 <Filter className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm text-gray-600">
//                   {filteredInventory.length} products
//                 </span>
//               </div>
//             </div>

//             {/* Empty state */}
//             {inventory.length === 0 && (
//               <div className="text-center py-8">
//                 <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No products in inventory</h3>
//                 <p className="text-gray-500 mb-4">Start by adding products to your inventory</p>
//                 <div className="flex space-x-4 justify-center">
//                   <button
//                     onClick={() => setShowAddModal(true)}
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Add Your First Product
//                   </button>
//                   <button
//                     onClick={handleAddTestProduct}
//                     className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
//                   >
//                     Add Test Product
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Inventory Grid */}
//             {inventory.length > 0 && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredInventory.map((product) => (
//                   <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex-1">
//                         <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
//                         <div className="flex flex-wrap gap-2 mb-2">
//                           <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                             {product.category}
//                           </span>
//                           {/* Approval Status Badge */}
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(product.approvalStatus)}`}>
//                             {getApprovalStatusIcon(product.approvalStatus)}
//                             <span className="ml-1 capitalize">{product.approvalStatus}</span>
//                           </span>
//                         </div>
//                       </div>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
//                         {getStatusIcon(product.status)}
//                         <span className="ml-1 capitalize">{product.status ? product.status.replace('-', ' ') : 'unknown'}</span>
//                       </span>
//                     </div>

//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Current Stock:</span>
//                         <span className="font-semibold">{product.currentStock}</span>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Min/Max:</span>
//                         <span className="text-sm">{product.minStock}/{product.maxStock}</span>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Price:</span>
//                         <span className="font-semibold">₹{parseFloat(product.price).toFixed(2)}</span>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Expiry:</span>
//                         <span className="text-sm">{product.expiryDate}</span>
//                       </div>

//                       {/* Stock Level Bar */}
//                       <div className="mt-4">
//                         <div className="flex justify-between text-xs text-gray-600 mb-1">
//                           <span>Stock Level</span>
//                           <span>
//                             {product.maxStock ? Math.round(((product.currentStock || 0) / product.maxStock) * 100) : 0}%
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div
//                             className={`h-2 rounded-full transition-all ${(product.currentStock || 0) <= (product.minStock || 0)
//                                 ? 'bg-red-500'
//                                 : (product.currentStock || 0) <= ((product.minStock || 0) * 1.5)
//                                   ? 'bg-yellow-500'
//                                   : 'bg-green-500'
//                               }`}
//                             style={{ width: `${Math.min(product.maxStock ? ((product.currentStock || 0) / product.maxStock) * 100 : 0, 100)}%` }}
//                           ></div>
//                         </div>
//                       </div>

//                       {/* Admin Approval Buttons - Only shown for pending products when in admin mode */}
//                       {isAdmin && product.approvalStatus === 'pending' && (
//                         <div className="flex space-x-2 mt-4">
//                           <button
//                             onClick={() => handleApproveProduct(product.id)}
//                             className="flex-1 bg-green-600 text-white py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
//                           >
//                             <CheckCircle className="w-3 h-3" />
//                             <span className="text-xs">Approve</span>
//                           </button>
//                           <button
//                             onClick={() => handleRejectProduct(product.id)}
//                             className="flex-1 bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
//                           >
//                             <XCircle className="w-3 h-3" />
//                             <span className="text-xs">Reject</span>
//                           </button>
//                         </div>
//                       )}

//                       {/* Quick Stock Update - Only enabled for approved products */}
//                       <div className="flex items-center space-x-2 mt-4">
//                         <input
//                           type="number"
//                           placeholder={product.approvalStatus === 'approved' ? "Update stock" : "Awaiting approval"}
//                           className={`flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${product.approvalStatus !== 'approved' ? 'bg-gray-100 cursor-not-allowed' : ''
//                             }`}
//                           disabled={product.approvalStatus !== 'approved'}
//                           min="0"
//                           onKeyPress={(e) => {
//                             if (e.key === 'Enter' && e.target.value) {
//                               handleUpdateStock(product.id, e.target.value);
//                               e.target.value = '';
//                             }
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* {activeTab === 'orders' && (
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold">Order Management</h2>
//               <p className="text-gray-600">Manage customer orders and update statuses</p>
//             </div>


//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Order ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {orders.map((order) => (
//                     <tr key={order.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{order.id}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{order.customerName}</div>
//                         <div className="text-sm text-gray-500">{order.items && order.items[0] ? order.items[0].name : ''}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                           {getStatusIcon(order.status)}
//                           <span className="ml-1 capitalize">{order.status}</span>
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         ${order.totalAmount.toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
//                         {order.status === 'pending' && (
//                           <select
//                             className="text-xs border border-gray-300 rounded px-2 py-1"
//                             defaultValue=""
//                             onChange={(e) => {
//                               if (e.target.value) {
//                                 handleUpdateOrderStatus(order.id, e.target.value);
//                               }
//                             }}
//                           >
//                             <option value="" disabled>Update Status</option>
//                             <option value="processing">Processing</option>
//                             <option value="shipped">Shipped</option>
//                             <option value="cancelled">Cancel</option>
//                           </select>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//          */}

//         {activeTab === 'orders' && (
//           <div className="bg-white rounded-lg shadow overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold">Assigned Orders Management</h2>
//               <p className="text-gray-600">Manage orders assigned to your company</p>
//               {currentSupplier && (
//                 <div className="mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg inline-block">
//                   <span className="font-medium">Supplier: {currentSupplier.companyName}</span>
//                 </div>
//               )}
//             </div>

//             {/* Orders Table */}
//             <div className="overflow-x-auto">
//               {supplierOrders.length > 0 ? (
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Order ID
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Customer
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {supplierOrders.map((order) => (
//                       <tr key={order.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{order.id}</div>
//                           <div className="text-xs text-gray-500">Assigned: {new Date(order.assignedAt).toLocaleDateString()}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{order.customerName}</div>
//                           <div className="text-sm text-gray-500">{order.items && order.items[0] ? order.items[0].name : ''}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                             {getStatusIcon(order.status)}
//                             <span className="ml-1 capitalize">{order.status}</span>
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           ₹{order.totalAmount.toFixed(2)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
//                           {['pending', 'processing', 'shipped'].includes(order.status) && (
//                             <select
//                               className="text-xs border border-gray-300 rounded px-2 py-1"
//                               defaultValue=""
//                               onChange={(e) => {
//                                 if (e.target.value) {
//                                   handleUpdateOrderStatus(order.id, e.target.value);
//                                 }
//                               }}
//                             >
//                               <option value="" disabled>Update Status</option>
//                               {order.status === 'pending' && (
//                                 <>
//                                   <option value="processing">Processing</option>
//                                   <option value="cancelled">Cancel</option>
//                                 </>
//                               )}
//                               {order.status === 'processing' && (
//                                 <>
//                                   <option value="shipped">Shipped</option>
//                                   <option value="cancelled">Cancel</option>
//                                 </>
//                               )}
//                               {order.status === 'shipped' && <option value="delivered">Delivered</option>}
//                             </select>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div className="text-center py-8">
//                   <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900">No Orders Assigned</h3>
//                   <p className="text-gray-500 mt-1">When admin assigns orders to your company, they will appear here</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Add Product Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Add New Product</h2>
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Add Product Form Fields */}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Product Name*
//                   </label>
//                   <input
//                     type="text"
//                     value={newProduct.name}
//                     onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category*
//                   </label>
//                   <select
//                     value={newProduct.category}
//                     onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.filter(c => c !== 'all').map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={newProduct.description}
//                     onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     rows="2"
//                   ></textarea>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Active Ingredient
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.activeIngredient}
//                       onChange={(e) => setNewProduct({ ...newProduct, activeIngredient: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Manufacturer
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.manufacturer}
//                       onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Dosage Form
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.dosageForm}
//                       onChange={(e) => setNewProduct({ ...newProduct, dosageForm: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Strength
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.strength}
//                       onChange={(e) => setNewProduct({ ...newProduct, strength: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Pack Size
//                   </label>
//                   <input
//                     type="text"
//                     value={newProduct.packSize}
//                     onChange={(e) => setNewProduct({ ...newProduct, packSize: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Species (comma separated)
//                   </label>
//                   <input
//                     type="text"
//                     value={newProduct.species}
//                     onChange={(e) => setNewProduct({ ...newProduct, species: e.target.value })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Min Stock*
//                     </label>
//                     <input
//                       type="number"
//                       value={newProduct.minStock}
//                       onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Max Stock*
//                     </label>
//                     <input
//                       type="number"
//                       value={newProduct.maxStock}
//                       onChange={(e) => setNewProduct({ ...newProduct, maxStock: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Price*
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={newProduct.price}
//                       onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Expiry Date*
//                     </label>
//                     <input
//                       type="date"
//                       value={newProduct.expiryDate}
//                       onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Batch Number*
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.batchNumber}
//                       onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-sm text-yellow-800">
//                     <Clock className="inline w-4 h-4 mr-1" />
//                     New products will be marked as "Pending Approval" and must be approved by an admin before they can be sold.
//                   </p>
//                 </div>

//                 <div className="flex space-x-3 mt-6">
//                   <button
//                     onClick={handleAddProduct}
//                     className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                     disabled={!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber}
//                   >
//                     Add Product
//                   </button>
//                   <button
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupplierDashboard;




import { useState, useEffect } from 'react';
import {
  Package,
  Upload,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  List,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Edit3,
  Trash2,
  Plus,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import {
  ref,
  get,
  set,
  update,
  remove,
  push,
  child,
  query,
  orderByChild,
  onValue,
  equalTo
} from 'firebase/database';
import { database } from '../../firebase/config'; // Adjust path as needed
import { useAuth } from '../../context/AuthContext'; // Assuming you have an auth context

const SupplierDashboard = () => {
  // State for active tab and dashboard data
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterApproval, setFilterApproval] = useState('all');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    lowStockItems: 0,
    recentOrders: [],
    lowStockProducts: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState('all');

  // Add product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Create test orders function for reuse
  const getTestOrders = () => {
    return [
      {
        id: 'test-order-1',
        assignedAt: new Date().toISOString(),
        assignmentStatus: "assigned",
        createdAt: new Date().toISOString(),
        status: "processing",
        supplierId: "-OVMQmaoerT5qvcDBHVU",
        supplierName: "Test Supplier",
        totalAmount: 1250.50,
        userName: "Test Customer 1",
        userEmail: "test1@example.com",
        items: [
          { medicineName: "Amoxicillin 500mg", quantity: 10, price: 125.05, total: 1250.50 }
        ]
      },
      {
        id: 'test-order-2',
        assignedAt: new Date(Date.now() - 86400000).toISOString(), // yesterday
        assignmentStatus: "assigned",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        status: "pending",
        supplierId: "-OVMQmaoerT5qvcDBHVU",
        supplierName: "Test Supplier",
        totalAmount: 800.75,
        userName: "Test Customer 2",
        userEmail: "test2@example.com",
        items: [
          { medicineName: "Metacam 1.5mg/ml", quantity: 5, price: 160.15, total: 800.75 }
        ]
      },
      {
        id: 'test-order-3',
        assignedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        assignmentStatus: "assigned",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        status: "shipped",
        supplierId: "-OVMQmaoerT5qvcDBHVU",
        supplierName: "Test Supplier",
        totalAmount: 560.25,
        userName: "Test Customer 3",
        userEmail: "test3@example.com",
        items: [
          { medicineName: "Bravecto Chews", quantity: 3, price: 186.75, total: 560.25 }
        ]
      }
    ];
  };

  const fetchCurrentSupplier = async () => {
    if (!user || !user.uid) {
      console.log("No user logged in, setting loading to false and using test data");
      const testSupplierId = "-OVMQmaoerT5qvcDBHVU"; // Default supplier ID from screenshot
      setCurrentSupplier({
        id: testSupplierId,
        companyName: "Test Supplier"
      });

      // Fetch all orders instead of just supplier orders
      fetchAllOrders();
      return;
    }

    try {
      console.log("Fetching supplier for user ID:", user.uid);
      // Query supplier by user ID
      const suppliersRef = ref(database, 'supplier');
      const supplierQuery = query(suppliersRef, orderByChild('userId'), equalTo(user.uid));

      const snapshot = await get(supplierQuery);

      if (snapshot.exists()) {
        // Get the first supplier associated with this user
        const suppliersData = snapshot.val();
        const supplierId = Object.keys(suppliersData)[0];

        setCurrentSupplier({
          id: supplierId,
          ...suppliersData[supplierId]
        });

        console.log("Current supplier fetched:", supplierId);

        // Fetch all orders instead of just supplier orders
        fetchAllOrders();
      } else {
        console.log("No supplier found for current user - checking for alternative user field");

        // Try with 'uid' field as backup
        const supplierQueryAlt = query(suppliersRef, orderByChild('uid'), equalTo(user.uid));
        const snapshotAlt = await get(supplierQueryAlt);

        if (snapshotAlt.exists()) {
          const suppliersData = snapshotAlt.val();
          const supplierId = Object.keys(suppliersData)[0];

          setCurrentSupplier({
            id: supplierId,
            ...suppliersData[supplierId]
          });

          console.log("Current supplier fetched with alt field:", supplierId);
          fetchAllOrders();
        } else {
          // For development purposes, let's hard-code a supplier ID to test the UI
          console.log("No supplier found at all - using default for testing");
          const testSupplierId = "-OVMQmaoerT5qvcDBHVU"; // Based on your Firebase screenshot
          setCurrentSupplier({
            id: testSupplierId,
            companyName: "Test Supplier"
          });

          fetchAllOrders();
          setError("No supplier account found for your user. Using test mode.");
        }
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      setError(`Failed to load supplier details: ${error.message}`);

      // Fallback to test data on error
      const testSupplierId = "-OVMQmaoerT5qvcDBHVU";
      setCurrentSupplier({
        id: testSupplierId,
        companyName: "Test Supplier"
      });

      fetchAllOrders();
    }
  };

  // Fetch all orders function - doesn't filter by supplier
  const fetchAllOrders = () => {
    try {
      console.log("Fetching all orders from the database");

      const ordersRef = ref(database, 'orders');

      // For testing, set loading to false after 10 seconds in case of timeout
      const timeoutId = setTimeout(() => {
        console.log("Order fetch timeout - forcing loading to false and using test data");
        const testOrders = getTestOrders();
        setOrders(testOrders);
        calculateDashboardMetrics();
        setLoading(false);
      }, 10000);

      // Listen for orders changes
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        clearTimeout(timeoutId); // Clear the timeout since we got a response

        console.log("Orders data received, snapshot exists:", snapshot.exists());

        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          console.log("Orders data structure:", Object.keys(ordersData));

          // Convert all orders to array with ID
          const allOrders = Object.keys(ordersData).map(key => ({
            id: key,
            ...ordersData[key]
          }));

          console.log("All orders found:", allOrders.length);

          // Sort orders by date (newest first)
          const sortedOrders = allOrders.sort((a, b) => {
            const dateA = a.createdAt || a.orderDate || a.date || '';
            const dateB = b.createdAt || b.orderDate || b.date || '';
            return new Date(dateB) - new Date(dateA);
          });

          console.log("Final sorted orders:", sortedOrders);
          setOrders(sortedOrders);

          // Calculate dashboard metrics after updating orders
          calculateDashboardMetrics();
        } else {
          console.log("No orders found in database, adding test orders");

          // Create some test orders if none exist in the database
          const testOrders = getTestOrders();

          setOrders(testOrders);

          // Call calculateDashboardMetrics after setting orders
          calculateDashboardMetrics();
        }

        setLoading(false);
      }, (error) => {
        console.error("Error fetching orders:", error);
        setError(`Failed to load orders: ${error.message}`);

        // Add test orders on error as well
        const testOrders = getTestOrders();

        setOrders(testOrders);

        // Call calculateDashboardMetrics after setting orders
        calculateDashboardMetrics();
        setLoading(false);
      });

      // Return cleanup function
      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up order listener:", error);
      setError(`Failed to set up orders listener: ${error.message}`);

      // Add test orders on error
      const testOrders = getTestOrders();

      setOrders(testOrders);

      // Call calculateDashboardMetrics after setting orders
      calculateDashboardMetrics();
      setLoading(false);
    }
  };

  // Add product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    activeIngredient: '',
    dosageForm: '',
    strength: '',
    packSize: '',
    minStock: 0,
    maxStock: 0,
    price: 0,
    expiryDate: '',
    batchNumber: '',
    manufacturer: '',
    species: ''
  });

  const categories = ['all', 'Antibiotics', 'Pain Relief', 'Parasiticides', 'Cardiac', 'Vaccines', 'Supplements', 'Anesthetics', 'Surgical', 'Dermatology', 'Ophthalmology', 'Emergency Care'];
  const approvalStatuses = ['all', 'pending', 'approved', 'rejected'];
  const orderStatuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  // Reference to medicines in the database
  const medicinesRef = ref(database, 'medicines');
  const ordersRef = ref(database, 'orders');

  // Test database connection and create medicines node if it doesn't exist
  const testDbConnection = async () => {
    try {
      console.log("Testing database connection...");
      // Check if medicines node exists
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'medicines'));

      if (!snapshot.exists()) {
        console.log("Medicines node does not exist in database. Creating it...");
        setDbStatus("Creating medicines collection in database...");
      } else {
        console.log("Medicines node exists in database!");
        setDbStatus("");
      }
    } catch (error) {
      console.error("Database connection test failed:", error);
      setDbStatus(`Database connection error: ${error.message}`);
      setError(`Database connection error: ${error.message}. Check your Firebase configuration.`);
    }
  };

  // Print the database URL to console for debugging
  useEffect(() => {
    const dbURL = database._databaseId && database._databaseId.url;
    console.log("Connected to Firebase database:", dbURL);
    console.log("Medicines reference path:", medicinesRef.toString());

    // Test database connection on component mount
    testDbConnection();
  }, []);

  // Initialize data from Firebase on component mount
  useEffect(() => {
    setLoading(true);
    console.log("Component mounted, initializing data...");

    try {
      // Set a timeout to prevent infinite loading
      const loadingTimeout = setTimeout(() => {
        console.log("Loading timeout reached, forcing loading to false");
        setLoading(false);
      }, 15000);

      // Check admin status from localStorage
      try {
        const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(userIsAdmin);
      } catch (adminError) {
        console.error("Error reading admin status:", adminError);
      }

      // Set up real-time listener for medicines
      console.log("Setting up real-time listener for medicines...");
      const unsubscribeMedicines = onValue(medicinesRef, (snapshot) => {
        console.log("Medicines data update received:", snapshot.exists() ? "Data exists" : "No data");

        if (snapshot.exists()) {
          // Convert Firebase object to array
          const medicinesData = snapshot.val();
          console.log("Raw medicines data received");

          const medicinesArray = Object.entries(medicinesData).map(([key, value]) => ({
            id: key,
            ...value
          }));
          console.log("Processed medicines array:", medicinesArray.length, "items");

          setInventory(medicinesArray);
        } else {
          console.log("No medicines found in database");
          setInventory([]);
        }
      }, (error) => {
        console.error("Error loading inventory:", error);
        setError(`Failed to load inventory data: ${error.message}. Please refresh the page.`);
        setInventory([]);
      });

      // Return cleanup function
      return () => {
        clearTimeout(loadingTimeout);
        unsubscribeMedicines();
      };
    } catch (error) {
      console.error("Error initializing data:", error);
      setError("Failed to load dashboard data. Please refresh the page.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentSupplier();

    // Cleanup on unmount
    return () => {
      // Any cleanup needed
    };
  }, [user?.uid]);

  // Recalculate dashboard metrics whenever inventory or orders change
  useEffect(() => {
    calculateDashboardMetrics();
  }, [inventory, orders]);

  // Toggle admin mode with safer localStorage access
  const toggleAdminMode = () => {
    const newAdminState = !isAdmin;
    setIsAdmin(newAdminState);
    try {
      localStorage.setItem('isAdmin', newAdminState);
    } catch (error) {
      console.error("Error saving admin state to localStorage:", error);
      // Continue anyway, state is in memory
    }
    setSuccessMessage(newAdminState ? 'Admin mode activated' : 'Admin mode deactivated');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const calculateDashboardMetrics = () => {
    console.log("Calculating dashboard metrics", {
      inventoryLength: inventory.length,
      ordersLength: orders.length
    });

    // If no data yet, initialize with empty values
    if (!inventory.length && !orders.length) {
      setDashboardData({
        totalProducts: 0,
        pendingOrders: 0,
        monthlyRevenue: 0,
        lowStockItems: 0,
        recentOrders: [],
        lowStockProducts: []
      });
      return;
    }

    // Get low stock products
    const lowStockProducts = inventory.filter(product =>
      product.status === 'low-stock' || product.status === 'out-of-stock'
    );

    // Calculate monthly revenue (assuming current month)
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlyRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt || order.orderDate || order.date || '');
        return orderDate.getMonth() === currentMonth &&
          orderDate.getFullYear() === currentYear &&
          order.status === 'delivered';
      })
      .reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);

    // Get pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    // Sort orders by date (newest first) for recent orders
    const recentOrders = [...orders].sort((a, b) => {
      const dateA = a.createdAt || a.orderDate || a.date || '';
      const dateB = b.createdAt || b.orderDate || b.date || '';
      return new Date(dateB) - new Date(dateA);
    }).slice(0, 5);

    console.log("Recent orders calculated:", recentOrders.length);

    setDashboardData({
      totalProducts: inventory.length,
      pendingOrders,
      monthlyRevenue,
      lowStockItems: lowStockProducts.length,
      recentOrders,
      lowStockProducts: lowStockProducts.slice(0, 4) // Top 4 low stock items
    });
  };

  // Status helpers
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (approvalStatus) => {
    switch (approvalStatus) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'in-stock': return <CheckCircle className="w-4 h-4" />;
      case 'low-stock': return <AlertCircle className="w-4 h-4" />;
      case 'out-of-stock': return <XCircle className="w-4 h-4" />;
      case 'assigned': return <ShieldCheck className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getApprovalStatusIcon = (approvalStatus) => {
    switch (approvalStatus) {
      case 'approved': return <ShieldCheck className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  // Filter inventory based on search term and category
  const filteredInventory = inventory
    .filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || filterCategory === 'All' || product.category === filterCategory) &&
      (filterApproval === 'all' || product.approvalStatus === filterApproval)
    );

  // Filter orders based on status - now using all orders
  const filteredOrders = orders
    .filter(order =>
      orderFilterStatus === 'all' || order.status === orderFilterStatus
    );

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '₹0.00';
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  // Handle updating product stock
  const handleUpdateStock = async (productId, newStock) => {
    try {
      console.log(`Updating stock for product ${productId} to ${newStock}`);

      // Find the product
      const product = inventory.find(p => p.id === productId);

      // Only allow stock updates for approved products
      if (product.approvalStatus !== 'approved') {
        setError("Cannot update stock for products that haven't been approved.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      const parsedStock = parseInt(newStock);
      const newStatus = parsedStock === 0 ? 'out-of-stock' :
        parsedStock <= product.minStock ? 'low-stock' : 'in-stock';

      // Update in Firebase
      const productRef = ref(database, `medicines/${productId}`);
      await update(productRef, {
        currentStock: parsedStock,
        status: newStatus
      });

      console.log(`Stock for product ${productId} updated successfully to ${newStock}`);
      setSuccessMessage("Stock updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating stock:", error);
      setError(`Failed to update stock: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle adding a new product
  const handleAddProduct = async () => {
    try {
      console.log("Adding new product:", newProduct);

      // Form validation
      if (!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber) {
        setError("Please fill out all required fields");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Process species from string to array
      const speciesArray = newProduct.species
        ? newProduct.species.split(',').map(s => s.trim()).filter(s => s)
        : [];

      // Structure product data
      const productToAdd = {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        activeIngredient: newProduct.activeIngredient,
        dosageForm: newProduct.dosageForm,
        strength: newProduct.strength,
        packSize: newProduct.packSize,
        minStock: parseInt(newProduct.minStock) || 0,
        maxStock: parseInt(newProduct.maxStock) || 0,
        currentStock: 0,
        price: parseFloat(newProduct.price) || 0,
        expiryDate: newProduct.expiryDate,
        batchNumber: newProduct.batchNumber,
        manufacturer: newProduct.manufacturer,
        species: speciesArray,
        status: 'out-of-stock',      // Stock status 
        approvalStatus: 'pending',   // Approval status
        timestamp: Date.now(),       // For sorting
        createdAt: new Date().toISOString()
      };

      console.log("Structured product data:", productToAdd);

      // Add to Firebase with generated key
      const newProductRef = push(medicinesRef);
      console.log("New product reference:", newProductRef.key);

      await set(newProductRef, productToAdd);
      console.log("Product added successfully with ID:", newProductRef.key);

      // Reset form
      setNewProduct({
        name: '',
        category: '',
        description: '',
        activeIngredient: '',
        dosageForm: '',
        strength: '',
        packSize: '',
        minStock: 0,
        maxStock: 0,
        price: 0,
        expiryDate: '',
        batchNumber: '',
        manufacturer: '',
        species: ''
      });

      // Close modal
      setShowAddModal(false);

      // Show success message
      setSuccessMessage("Product added successfully and is awaiting admin approval");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      setError(`Failed to add product: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle adding a test product
  const handleAddTestProduct = async () => {
    try {
      console.log("Adding test product to verify database connection...");

      // Simple test product
      const testProduct = {
        name: `Test Product ${new Date().toISOString()}`,
        category: "Test",
        description: "Test product to verify database connection",
        currentStock: 5,
        minStock: 2,
        maxStock: 10,
        price: 9.99,
        expiryDate: new Date().toISOString().split('T')[0],
        batchNumber: "TEST-" + Math.floor(Math.random() * 1000),
        status: "in-stock",
        approvalStatus: "approved",
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      };

      // Add to Firebase with generated key
      const testProductRef = push(medicinesRef);
      await set(testProductRef, testProduct);

      console.log("Test product added successfully with ID:", testProductRef.key);
      setSuccessMessage("Test product added successfully to verify database connection");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error adding test product:", error);
      setError(`Failed to add test product: ${error.message}. Please check your database connection.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`Updating status for order ${orderId} to ${newStatus}`);

      // Update in Firebase
      const orderRef = ref(database, `orders/${orderId}`);
      await update(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        updatedBy: currentSupplier?.id || 'supplier'
      });

      // Update local state
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      setOrders(updatedOrders);

      setSuccessMessage(`Order status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  // View order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  // Handle approve product
  const handleApproveProduct = async (productId) => {
    try {
      console.log(`Approving product ${productId}`);

      // Update in Firebase
      const productRef = ref(database, `medicines/${productId}`);
      await update(productRef, {
        approvalStatus: 'approved'
      });

      console.log(`Product ${productId} approved successfully`);
      setSuccessMessage("Product approved successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error approving product:", error);
      setError(`Failed to approve product: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("EMERGENCY LOGOUT: Starting forced logout process");

      // 1. Set a permanent flag in localStorage (not sessionStorage which gets cleared)
      localStorage.setItem('FORCE_LOGOUT', 'true');

      // 2. Mark the session as inactive directly in Firebase
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        try {
          const db = database();
          const sessionRef = ref(db, `sessions/${sessionId}`);
          await set(sessionRef, { active: false, forceLoggedOut: true });
          console.log("EMERGENCY LOGOUT: Marked session inactive in Firebase");
        } catch (dbError) {
          console.error("EMERGENCY LOGOUT: Error updating Firebase, continuing logout", dbError);
        }
      }

      // 3. Aggressively clear ALL storage
      console.log("EMERGENCY LOGOUT: Clearing all storage");
      localStorage.clear();
      sessionStorage.clear();

      // 4. Set the logout flag again (since we just cleared it)
      localStorage.setItem('FORCE_LOGOUT', 'true');

      // 5. Call the auth context logout for good measure, but don't wait for it
      try {
        LogOut();
      } catch (logoutError) {
        console.error("EMERGENCY LOGOUT: Error in context logout, continuing", logoutError);
      }

      // 6. Display a visual indicator that logout is in progress
      document.body.innerHTML = `
      <div style="text-align: center; margin-top: 100px; font-family: Arial, sans-serif;">
        <h1 style="color: #2563EB;">Logging out...</h1>
        <p>Please wait, you are being securely logged out.</p>
        <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #2563EB; border-radius: 50%; margin: 20px auto; animation: spin 1s linear infinite;"></div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
      </div>
    `;

      // 7. Use a short timeout to ensure display updates before redirect
      setTimeout(() => {
        console.log("EMERGENCY LOGOUT: Forcing navigation to home page");
        // 8. CRITICAL: Use window.location.replace with a timestamp to bust cache
        window.location.replace('/?logout=' + Date.now());
      }, 800);

    } catch (error) {
      console.error('EMERGENCY LOGOUT: Critical error during logout:', error);
      alert('Logout failed. Please close your browser to complete logout.');
      // Last resort - still try to redirect
      window.location.replace('/?error=true');
    }
  };


  // Handle reject product
  const handleRejectProduct = async (productId) => {
    try {
      console.log(`Rejecting product ${productId}`);

      // Update in Firebase
      const productRef = ref(database, `medicines/${productId}`);
      await update(productRef, {
        approvalStatus: 'rejected'
      });

      console.log(`Product ${productId} rejected successfully`);
      setSuccessMessage("Product rejected");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error rejecting product:", error);
      setError(`Failed to reject product: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Format a date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading dashboard data...</p>
        <button
          onClick={() => setLoading(false)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Skip Loading
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
              <p className="text-gray-600">Manage your veterinary medicine inventory and orders</p>
              {dbStatus && (
                <p className="text-xs text-gray-500 mt-1">{dbStatus}</p>
              )}
            </div>


            <div className="flex space-x-4 items-center gap-4">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`py-2 font-medium text-sm ${activeTab === 'dashboard'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`py-2 font-medium text-sm ${activeTab === 'inventory'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Inventory
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`py-2 font-medium text-sm ${activeTab === 'orders'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Orders
                  </button>
                </nav>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent any default navigation
                  setShowAddModal(true); // Show the modal instead of navigating
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Add Product</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.pendingOrders}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">₹{dashboardData.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <p className="text-3xl font-bold text-gray-900">{dashboardData.lowStockItems}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {(() => {
                    console.log("Rendering recent orders, orders length:", orders.length);

                    // If no orders exist, create test orders on the fly
                    const ordersToDisplay = orders.length > 0 ? orders : getTestOrders();

                    console.log("Orders to display:", ordersToDisplay.length);

                    // Always show at least 3 orders, or all if less than 3
                    return ordersToDisplay.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {order.id.length > 8 ? `${order.id.substring(0, 8)}...` : order.id}
                              </p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1 capitalize">{order.status}</span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">{order.customerName || order.userName || "Customer"}</p>
                            {order.supplierName && (
                              <p className="text-xs text-blue-600">Supplier: {order.supplierName}</p>
                            )}
                            {order.items && order.items.length > 0 && (
                              <p className="text-sm text-gray-600">
                                {order.items[0].name || order.items[0].medicineName || "Medicine"}
                                {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                              </p>
                            )}
                            <div className="flex justify-between mt-1">
                              <p className="text-xs text-gray-500">
                                Qty: {order.dosage || order.quantity || order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                              </p>
                              {/* <p className="text-xs font-medium">{formatCurrency(order.totalAmount)}</p> */}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(order.createdAt || order.orderDate || order.date)}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Manage Inventory
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {dashboardData.lowStockProducts.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No low stock items</p>
                    </div>
                  ) : (
                    dashboardData.lowStockProducts.map((product, index) => (
                      <div key={product.id || index} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <div className="mt-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <span>Current: {product.currentStock}</span>
                                <span className="mx-2">•</span>
                                <span>Min: {product.minStock}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {product.currentStock === 0 ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${product.currentStock === 0 ? 'bg-red-600' : 'bg-yellow-500'}`}
                              style={{ width: `${Math.min((product.currentStock / product.minStock) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Add New Medicine</p>
                    <p className="text-sm text-gray-600">Add products to your catalog</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Package className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Manage Inventory</p>
                    <p className="text-sm text-gray-600">Update stock levels</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">View Orders</p>
                    <p className="text-sm text-gray-600">Manage order fulfillment</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Inventory Management</h2>
              <div className="flex space-x-3">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default navigation
                    setShowAddModal(true); // Show the modal instead of navigating
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterApproval}
                onChange={(e) => setFilterApproval(e.target.value)}
              >
                {approvalStatuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Approval Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredInventory.length} products
                </span>
              </div>
            </div>

            {/* Empty state */}
            {inventory.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products in inventory</h3>
                <p className="text-gray-500 mb-4">Start by adding products to your inventory</p>
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Product
                  </button>
                  <button
                    onClick={handleAddTestProduct}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Add Test Product
                  </button>
                </div>
              </div>
            )}

            {/* Inventory Grid */}
            {inventory.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInventory.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                          {/* Approval Status Badge */}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(product.approvalStatus)}`}>
                            {getApprovalStatusIcon(product.approvalStatus)}
                            <span className="ml-1 capitalize">{product.approvalStatus}</span>
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        <span className="ml-1 capitalize">{product.status ? product.status.replace('-', ' ') : 'unknown'}</span>
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Stock:</span>
                        <span className="font-semibold">{product.currentStock}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Min/Max:</span>
                        <span className="text-sm">{product.minStock}/{product.maxStock}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold">₹{parseFloat(product.price).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Expiry:</span>
                        <span className="text-sm">{product.expiryDate}</span>
                      </div>

                      {/* Stock Level Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Stock Level</span>
                          <span>
                            {product.maxStock ? Math.round(((product.currentStock || 0) / product.maxStock) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${(product.currentStock || 0) <= (product.minStock || 0)
                              ? 'bg-red-500'
                              : (product.currentStock || 0) <= ((product.minStock || 0) * 1.5)
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              }`}
                            style={{ width: `${Math.min(product.maxStock ? ((product.currentStock || 0) / product.maxStock) * 100 : 0, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Admin Approval Buttons - Only shown for pending products when in admin mode */}
                      {isAdmin && product.approvalStatus === 'pending' && (
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => handleApproveProduct(product.id)}
                            className="flex-1 bg-green-600 text-white py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <span className="text-xs">Approve</span>
                          </button>
                          <button
                            onClick={() => handleRejectProduct(product.id)}
                            className="flex-1 bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                          >
                            <XCircle className="w-3 h-3" />
                            <span className="text-xs">Reject</span>
                          </button>
                        </div>
                      )}

                      {/* Quick Stock Update - Only enabled for approved products */}
                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="number"
                          placeholder={product.approvalStatus === 'approved' ? "Update stock" : "Awaiting approval"}
                          className={`flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${product.approvalStatus !== 'approved' ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          disabled={product.approvalStatus !== 'approved'}
                          min="0"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value) {
                              handleUpdateStock(product.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Orders Management</h2>
              <p className="text-gray-600">Manage orders assigned to your company</p>
              {currentSupplier && (
                <div className="mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg inline-block">
                  {/* <span className="font-medium">Viewing all orders in the system</span> */}
                </div>
              )}
            </div>

            {/* Orders Filter */}
            <div className="px-6 py-3 bg-gray-50 flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter by status:</span>
              <select
                value={orderFilterStatus}
                onChange={(e) => setOrderFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {orderStatuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-600 ml-auto">
                {filteredOrders.length} orders found
              </span>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              {filteredOrders.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supplier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.id.substring(0, 8)}...</div>
                          <div className="text-xs text-gray-500">
                            {order.assignedAt ? `Assigned: ${formatDate(order.assignedAt)}` : 'Not assigned'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customerName || order.userName}</div>
                          <div className="text-sm text-gray-500">
                            {order.items && order.items[0] ?
                              (order.items[0].name || order.items[0].medicineName || 'Item') :
                              'No items'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(order.createdAt || order.orderDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.supplierName || 'Unassigned'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </span>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(order.totalAmount)}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            View
                          </button>
                          {/* {['pending', 'processing', 'shipped'].includes(order.status) && 
                           (currentSupplier?.id === order.supplierId || isSupplier) && (
                            <select
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleUpdateOrderStatus(order.id, e.target.value);
                                }
                              }}
                            >
                              <option value="" disabled>Update Status</option>
                              {order.status === 'pending' && (
                                <>
                                  <option value="processing">Processing</option>
                                  <option value="cancelled">Cancel</option>
                                </>
                              )}
                              {order.status === 'processing' && (
                                <>
                                  <option value="shipped">Shipped</option>
                                  <option value="cancelled">Cancel</option>
                                </>
                              )}
                              {order.status === 'shipped' && <option value="delivered">Delivered</option>}
                            </select>
                          )} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Orders Found</h3>
                  <p className="text-gray-500 mt-1">
                    {orders.length > 0
                      ? `No orders with status "${orderFilterStatus}". Try changing the filter.`
                      : "No orders in the system yet."
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Product</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Add Product Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Active Ingredient
                    </label>
                    <input
                      type="text"
                      value={newProduct.activeIngredient}
                      onChange={(e) => setNewProduct({ ...newProduct, activeIngredient: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={newProduct.manufacturer}
                      onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage Form
                    </label>
                    <input
                      type="text"
                      value={newProduct.dosageForm}
                      onChange={(e) => setNewProduct({ ...newProduct, dosageForm: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strength
                    </label>
                    <input
                      type="text"
                      value={newProduct.strength}
                      onChange={(e) => setNewProduct({ ...newProduct, strength: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pack Size
                  </label>
                  <input
                    type="text"
                    value={newProduct.packSize}
                    onChange={(e) => setNewProduct({ ...newProduct, packSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Species (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newProduct.species}
                    onChange={(e) => setNewProduct({ ...newProduct, species: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Stock*
                    </label>
                    <input
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Stock*
                    </label>
                    <input
                      type="number"
                      value={newProduct.maxStock}
                      onChange={(e) => setNewProduct({ ...newProduct, maxStock: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price*
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date*
                    </label>
                    <input
                      type="date"
                      value={newProduct.expiryDate}
                      onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch Number*
                    </label>
                    <input
                      type="text"
                      value={newProduct.batchNumber}
                      onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <Clock className="inline w-4 h-4 mr-1" />
                    New products will be marked as "Pending Approval" and must be approved by an admin before they can be sold.
                  </p>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber}
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Order ID:</span>
                  <span>{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status}</span>
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Date Created:</span>
                  <span>{formatDate(selectedOrder.createdAt || selectedOrder.orderDate)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Date Assigned:</span>
                  <span>{formatDate(selectedOrder.assignedAt)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Supplier:</span>
                  <span>{selectedOrder.supplierName || 'Unassigned'}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-semibold">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div> */}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customerName || selectedOrder.userName}</p>
                  {/* <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail || selectedOrder.userEmail || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone || selectedOrder.userPhone || 'N/A'}</p>
                  <p><span className="font-medium">Address:</span> {selectedOrder.customerAddress || selectedOrder.userAddress || 'N/A'}</p> */}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Order Items</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th> */}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {item.name || item.medicineName || `Item ${index + 1}`}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {item.quantity || 1}
                            </td>
                            {/* <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              {formatCurrency(item.total || (item.price * item.quantity))}
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No items data available</p>
                )}
              </div>

              {selectedOrder.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-2">Notes</h3>
                  <p className="p-4 border border-gray-200 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Update Status - Only show if current supplier owns this order or admin */}
              {['pending', 'processing', 'shipped'].includes(selectedOrder.status) &&
                (currentSupplier?.id === selectedOrder.supplierId || isAdmin) && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <span className="font-medium">Update Status:</span>
                    <div className="flex space-x-2">
                      {selectedOrder.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              handleUpdateOrderStatus(selectedOrder.id, 'processing');
                              setShowOrderDetailsModal(false);
                            }}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Mark as Processing
                          </button>
                          <button
                            onClick={() => {
                              handleUpdateOrderStatus(selectedOrder.id, 'cancelled');
                              setShowOrderDetailsModal(false);
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {selectedOrder.status === 'processing' && (
                        <>
                          <button
                            onClick={() => {
                              handleUpdateOrderStatus(selectedOrder.id, 'shipped');
                              setShowOrderDetailsModal(false);
                            }}
                            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                          >
                            Mark as Shipped
                          </button>
                          <button
                            onClick={() => {
                              handleUpdateOrderStatus(selectedOrder.id, 'cancelled');
                              setShowOrderDetailsModal(false);
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {selectedOrder.status === 'shipped' && (
                        <button
                          onClick={() => {
                            handleUpdateOrderStatus(selectedOrder.id, 'delivered');
                            setShowOrderDetailsModal(false);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                )}

              <div className="mt-6">
                <button
                  onClick={() => setShowOrderDetailsModal(false)}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;