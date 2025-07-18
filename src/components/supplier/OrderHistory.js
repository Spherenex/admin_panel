// // OrderHistory.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Calendar, 
//   Package, 
//   Truck, 
//   CheckCircle, 
//   Clock, 
//   XCircle,
//   Eye,
//   Download,
//   RefreshCw,
//   ChevronDown,
//   MapPin,
//   Phone,
//   Mail
// } from 'lucide-react';

// const OrderHistory = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateFilter, setDateFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('date-desc');
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderDetails, setShowOrderDetails] = useState(false);

//   const [orders, setOrders] = useState([
//     {
//       id: 'ORD001',
//       customerName: 'City Veterinary Clinic',
//       customerEmail: 'orders@cityvethospital.com',
//       customerPhone: '+1-555-0123',
//       customerAddress: '123 Main St, Downtown, State 12345',
//       orderDate: '2024-12-15',
//       deliveryDate: '2024-12-18',
//       status: 'pending',
//       priority: 'normal',
//       totalAmount: 1875.50,
//       items: [
//         { id: 1, name: 'Amoxicillin 500mg', quantity: 100, price: 12.50, total: 1250.00 },
//         { id: 2, name: 'Metacam 1.5mg/ml', quantity: 25, price: 25.02, total: 625.50 }
//       ],
//       shippingMethod: 'Express Delivery',
//       trackingNumber: null,
//       notes: 'Urgent order for emergency cases'
//     },
//     {
//       id: 'ORD002',
//       customerName: 'Animal Care Center',
//       customerEmail: 'supply@animalcare.com',
//       customerPhone: '+1-555-0124',
//       customerAddress: '456 Oak Ave, Suburb, State 12346',
//       orderDate: '2024-12-14',
//       deliveryDate: '2024-12-16',
//       status: 'shipped',
//       priority: 'high',
//       totalAmount: 2340.75,
//       items: [
//         { id: 1, name: 'Frontline Plus Large Dog', quantity: 50, price: 45.99, total: 2299.50 },
//         { id: 2, name: 'Shipping Fee', quantity: 1, price: 41.25, total: 41.25 }
//       ],
//       shippingMethod: 'Standard Shipping',
//       trackingNumber: 'TRK123456789',
//       notes: 'Monthly stock replenishment'
//     },
//     {
//       id: 'ORD003',
//       customerName: 'Pet Emergency Hospital',
//       customerEmail: 'procurement@petemergency.com',
//       customerPhone: '+1-555-0125',
//       customerAddress: '789 Emergency Blvd, Hospital District, State 12347',
//       orderDate: '2024-12-13',
//       deliveryDate: '2024-12-15',
//       status: 'delivered',
//       priority: 'urgent',
//       totalAmount: 3250.00,
//       items: [
//         { id: 1, name: 'Vetmedin 1.25mg', quantity: 100, price: 55.20, total: 5520.00 },
//         { id: 2, name: 'Revolution for Cats', quantity: 75, price: 32.40, total: 2430.00 },
//         { id: 3, name: 'Discount Applied', quantity: 1, price: -4700.00, total: -4700.00 }
//       ],
//       shippingMethod: 'Same Day Delivery',
//       trackingNumber: 'TRK987654321',
//       notes: 'Emergency stock - critical cases'
//     },
//     {
//       id: 'ORD004',
//       customerName: 'Rural Vet Services',
//       customerEmail: 'admin@ruralvet.com',
//       customerPhone: '+1-555-0126',
//       customerAddress: '321 Country Road, Rural Area, State 12348',
//       orderDate: '2024-12-12',
//       deliveryDate: '2024-12-14',
//       status: 'cancelled',
//       priority: 'normal',
//       totalAmount: 890.25,
//       items: [
//         { id: 1, name: 'Rimadyl 25mg', quantity: 60, price: 14.84, total: 890.40 }
//       ],
//       shippingMethod: 'Standard Shipping',
//       trackingNumber: null,
//       notes: 'Cancelled due to duplicate order'
//     },
//     {
//       id: 'ORD005',
//       customerName: 'Companion Animal Hospital',
//       customerEmail: 'orders@companionanimal.com',
//       customerPhone: '+1-555-0127',
//       customerAddress: '654 Pet Care Lane, Medical District, State 12349',
//       orderDate: '2024-12-10',
//       deliveryDate: '2024-12-12',
//       status: 'delivered',
//       priority: 'normal',
//       totalAmount: 1560.80,
//       items: [
//         { id: 1, name: 'Baytril 68mg', quantity: 40, price: 39.02, total: 1560.80 }
//       ],
//       shippingMethod: 'Express Delivery',
//       trackingNumber: 'TRK456789123',
//       notes: 'Weekly routine order'
//     }
//   ]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'processing': return 'bg-blue-100 text-blue-800';
//       case 'shipped': return 'bg-purple-100 text-purple-800';
//       case 'delivered': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
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
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'urgent': return 'bg-red-100 text-red-800';
//       case 'high': return 'bg-orange-100 text-orange-800';
//       case 'normal': return 'bg-blue-100 text-blue-800';
//       case 'low': return 'bg-gray-100 text-gray-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const filteredOrders = orders
//     .filter(order => {
//       const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
//       let matchesDate = true;
//       if (dateFilter !== 'all') {
//         const orderDate = new Date(order.orderDate);
//         const now = new Date();
//         switch (dateFilter) {
//           case 'today':
//             matchesDate = orderDate.toDateString() === now.toDateString();
//             break;
//           case 'week':
//             const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//             matchesDate = orderDate >= weekAgo;
//             break;
//           case 'month':
//             const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//             matchesDate = orderDate >= monthAgo;
//             break;
//         }
//       }
      
//       return matchesSearch && matchesStatus && matchesDate;
//     })
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'date-desc': return new Date(b.orderDate) - new Date(a.orderDate);
//         case 'date-asc': return new Date(a.orderDate) - new Date(b.orderDate);
//         case 'amount-desc': return b.totalAmount - a.totalAmount;
//         case 'amount-asc': return a.totalAmount - b.totalAmount;
//         case 'status': return a.status.localeCompare(b.status);
//         default: return 0;
//       }
//     });

//   const handleViewOrder = (order) => {
//     setSelectedOrder(order);
//     setShowOrderDetails(true);
//   };

//   const handleUpdateStatus = (orderId, newStatus) => {
//     setOrders(orders.map(order => 
//       order.id === orderId ? { ...order, status: newStatus } : order
//     ));
//   };

//   const orderStats = {
//     total: orders.length,
//     pending: orders.filter(o => o.status === 'pending').length,
//     shipped: orders.filter(o => o.status === 'shipped').length,
//     delivered: orders.filter(o => o.status === 'delivered').length,
//     cancelled: orders.filter(o => o.status === 'cancelled').length,
//     totalRevenue: orders
//       .filter(o => o.status === 'delivered')
//       .reduce((sum, order) => sum + order.totalAmount, 0)
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
//               <p className="text-gray-600">Track and manage your customer orders</p>
//             </div>
//             <div className="flex space-x-3">
//               <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
//                 <Download className="w-4 h-4" />
//                 <span>Export Report</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
//               <p className="text-sm text-gray-600">Total Orders</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
//               <p className="text-sm text-gray-600">Pending</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
//               <p className="text-sm text-gray-600">Shipped</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
//               <p className="text-sm text-gray-600">Delivered</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
//               <p className="text-sm text-gray-600">Cancelled</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-lg shadow p-4">
//             <div className="text-center">
//               <p className="text-2xl font-bold text-blue-600">${orderStats.totalRevenue.toLocaleString()}</p>
//               <p className="text-sm text-gray-600">Revenue</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>

//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//             >
//               <option value="all">All Time</option>
//               <option value="today">Today</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//             </select>

//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="date-desc">Newest First</option>
//               <option value="date-asc">Oldest First</option>
//               <option value="amount-desc">Highest Amount</option>
//               <option value="amount-asc">Lowest Amount</option>
//               <option value="status">By Status</option>
//             </select>
//           </div>
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Order Details
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Amount
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredOrders.map((order) => (
//                   <tr key={order.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{order.id}</p>
//                         <p className="text-sm text-gray-500">
//                           Ordered: {new Date(order.orderDate).toLocaleDateString()}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
//                         </p>
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
//                           {order.priority}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
//                         <p className="text-sm text-gray-500">{order.customerEmail}</p>
//                         <p className="text-sm text-gray-500">{order.items.length} items</p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                         {getStatusIcon(order.status)}
//                         <span className="ml-1 capitalize">{order.status}</span>
//                       </span>
//                       {order.trackingNumber && (
//                         <p className="text-xs text-gray-500 mt-1">
//                           Tracking: {order.trackingNumber}
//                         </p>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-sm font-medium text-gray-900">
//                         ${order.totalAmount.toFixed(2)}
//                       </p>
//                       <p className="text-xs text-gray-500">{order.shippingMethod}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleViewOrder(order)}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         {order.status === 'pending' && (
//                           <select
//                             onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
//                             className="text-xs border border-gray-300 rounded px-2 py-1"
//                             defaultValue=""
//                           >
//                             <option value="" disabled>Update Status</option>
//                             <option value="processing">Processing</option>
//                             <option value="shipped">Shipped</option>
//                             <option value="cancelled">Cancel</option>
//                           </select>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Order Details Modal */}
//         {showOrderDetails && selectedOrder && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold">Order Details - {selectedOrder.id}</h2>
//                 <button
//                   onClick={() => setShowOrderDetails(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Order Information */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Order Information</h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Order Date:</span>
//                       <span>{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Delivery Date:</span>
//                       <span>{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Status:</span>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
//                         {getStatusIcon(selectedOrder.status)}
//                         <span className="ml-1 capitalize">{selectedOrder.status}</span>
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Priority:</span>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedOrder.priority)}`}>
//                         {selectedOrder.priority}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Shipping Method:</span>
//                       <span>{selectedOrder.shippingMethod}</span>
//                     </div>
//                     {selectedOrder.trackingNumber && (
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Tracking Number:</span>
//                         <span className="font-mono">{selectedOrder.trackingNumber}</span>
//                       </div>
//                     )}
//                     {selectedOrder.notes && (
//                       <div>
//                         <span className="text-gray-600">Notes:</span>
//                         <p className="mt-1 text-sm">{selectedOrder.notes}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Customer Information */}
//                 <div>
//                   <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center space-x-2">
//                       <Package className="w-4 h-4 text-gray-400" />
//                       <span>{selectedOrder.customerName}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Mail className="w-4 h-4 text-gray-400" />
//                       <span>{selectedOrder.customerEmail}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Phone className="w-4 h-4 text-gray-400" />
//                       <span>{selectedOrder.customerPhone}</span>
//                     </div>
//                     <div className="flex items-start space-x-2">
//                       <MapPin className="w-4 h-4 text-gray-400 mt-1" />
//                       <span className="text-sm">{selectedOrder.customerAddress}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="lg:col-span-2">
//                   <h3 className="text-lg font-semibold mb-4">Order Items</h3>
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                             Item
//                           </th>
//                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                             Quantity
//                           </th>
//                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                             Unit Price
//                           </th>
//                           <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
//                             Total
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-200">
//                         {selectedOrder.items.map((item) => (
//                           <tr key={item.id}>
//                             <td className="px-4 py-2 text-sm">{item.name}</td>
//                             <td className="px-4 py-2 text-sm">{item.quantity}</td>
//                             <td className="px-4 py-2 text-sm">${item.price.toFixed(2)}</td>
//                             <td className="px-4 py-2 text-sm font-medium">${item.total.toFixed(2)}</td>
//                           </tr>
//                         ))}
//                         <tr className="bg-gray-50">
//                           <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right">
//                             Total Amount:
//                           </td>
//                           <td className="px-4 py-2 text-sm font-bold">
//                             ${selectedOrder.totalAmount.toFixed(2)}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 mt-8">
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                   Print Invoice
//                 </button>
//                 <button
//                   onClick={() => setShowOrderDetails(false)}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrderHistory;


// components/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { orderServices } from '../../firebase/services';
import { exportToCSV } from '../../utils/exportUtils';
import OrderDetailsModal from './OrderDetailsModal';

const OrderHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders on component mount with real-time updates
  useEffect(() => {
    setLoading(true);
    
    // Set up real-time listener for orders
    const unsubscribeOrders = orderServices.getOrdersRealtime((data) => {
      setOrders(data);
      setLoading(false);
    });
    
    // Set up real-time listener for order stats
    const unsubscribeStats = orderServices.getOrderStats((stats) => {
      setOrderStats(stats);
    });
    
    // Clean up listeners on component unmount
    return () => {
      unsubscribeOrders();
      unsubscribeStats();
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all' && order.orderDate) {
        const orderDate = new Date(order.orderDate);
        const now = new Date();
        switch (dateFilter) {
          case 'today':
            matchesDate = orderDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = orderDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = orderDate >= monthAgo;
            break;
          default:
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc': return new Date(b.orderDate) - new Date(a.orderDate);
        case 'date-asc': return new Date(a.orderDate) - new Date(b.orderDate);
        case 'amount-desc': return b.totalAmount - a.totalAmount;
        case 'amount-asc': return a.totalAmount - b.totalAmount;
        case 'status': return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderServices.updateOrderStatus(orderId, newStatus);
      // No need to manually update state as the real-time listener will handle it
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    }
  };

  const handleExportReport = () => {
    const data = orders.map(order => ({
      'Order ID': order.id,
      'Customer': order.customerName,
      'Date': new Date(order.orderDate).toLocaleDateString(),
      'Status': order.status,
      'Items': order.items.length,
      'Total Amount': `$${order.totalAmount.toFixed(2)}`,
      'Shipping Method': order.shippingMethod,
      'Tracking Number': order.trackingNumber || 'N/A'
    }));
    
    exportToCSV(data, 'orders_report');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
              <p className="text-gray-600">Track and manage your customer orders</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleExportReport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
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
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{orderStats.shipped}</p>
              <p className="text-sm text-gray-600">Shipped</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${orderStats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Revenue</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="status">By Status</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Orders will appear here as they are created</p>
          </div>
        )}

        {/* Orders Table */}
        {orders.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">
                            Ordered: {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                            {order.priority}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          <p className="text-sm text-gray-500">{order.items.length} items</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                        {order.trackingNumber && (
                          <p className="text-xs text-gray-500 mt-1">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{order.shippingMethod}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === 'pending' && (
                            <select
                              onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              defaultValue=""
                            >
                              <option value="" disabled>Update Status</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="cancelled">Cancel</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <OrderDetailsModal 
            order={selectedOrder}
            onClose={() => setShowOrderDetails(false)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>
    </div>
  );
};

export default OrderHistory;