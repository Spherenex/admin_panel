// 3. OrderManagement.jsx
import React, { useState } from 'react';
import { ShoppingBag, Truck, CheckCircle, Clock, AlertCircle, Eye, Search } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customerName: "Dr. Sarah Johnson",
      customerType: "Veterinarian",
      items: [
        { name: "Amoxicillin 500mg", quantity: 2, price: 25.99 },
        { name: "Pain Relief Tablets", quantity: 1, price: 32.00 }
      ],
      totalAmount: 83.98,
      orderDate: "2025-07-10",
      status: "pending",
      deliveryAddress: "123 Vet Clinic St, City, State",
      estimatedDelivery: "2025-07-12"
    },
    {
      id: "ORD-002",
      customerName: "Dr. Mike Chen",
      customerType: "Veterinarian",
      items: [
        { name: "Flea Treatment Spray", quantity: 3, price: 18.50 }
      ],
      totalAmount: 55.50,
      orderDate: "2025-07-09",
      status: "shipped",
      deliveryAddress: "456 Animal Care Ave, City, State",
      estimatedDelivery: "2025-07-11",
      trackingNumber: "TRK123456789"
    },
    {
      id: "ORD-003",
      customerName: "Pet Care Center",
      customerType: "Clinic",
      items: [
        { name: "Antibiotics Bundle", quantity: 5, price: 120.00 }
      ],
      totalAmount: 600.00,
      orderDate: "2025-07-08",
      status: "delivered",
      deliveryAddress: "789 Pet Health Blvd, City, State",
      deliveredDate: "2025-07-10"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <AlertCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage medicine orders and deliveries</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders or customers..."
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
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{order.id}</h3>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Customer:</span> {order.customerName} ({order.customerType})
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Order Date:</span> {order.orderDate}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Total:</span> 
                    <span className="text-green-600 font-semibold ml-1">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Items:</h4>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Actions */}
              {order.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'processing')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Start Processing
                  </button>
                </div>
              )}

              {order.status === 'processing' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateOrderStatus(order.id, 'shipped')}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                  >
                    Mark as Shipped
                  </button>
                </div>
              )}

              {order.status === 'shipped' && order.trackingNumber && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span><strong>Tracking:</strong> {order.trackingNumber}</span>
                  <span><strong>Est. Delivery:</strong> {order.estimatedDelivery}</span>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Mark as Delivered
                  </button>
                </div>
              )}

              {order.status === 'delivered' && (
                <div className="text-sm text-green-600">
                  <strong>Delivered on:</strong> {order.deliveredDate}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No orders found matching your criteria</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Details - {selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Type:</strong> {selectedOrder.customerType}</p>
                  <p><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2">
                    <span>Total:</span>
                    <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
