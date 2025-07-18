// components/OrderDetailsModal.jsx
import React from 'react';
import { 
  XCircle, 
  Package, 
  Mail, 
  Phone, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock, 
  RefreshCw
} from 'lucide-react';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus }) => {
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

  // Function to generate and print invoice
  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .invoice-title { font-size: 24px; font-weight: bold; color: #333; }
            .invoice-details { margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #f3f4f6; text-align: left; padding: 10px; }
            td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
            .total-row { font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div>Order #: ${order.id}</div>
              <div>Date: ${new Date(order.orderDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div style="font-weight: bold;">Vet Supply Co.</div>
              <div>123 Vet Way</div>
              <div>Veterinary City, VC 12345</div>
              <div>support@vetsupply.com</div>
            </div>
          </div>
          
          <div class="invoice-details">
            <div style="font-weight: bold; margin-bottom: 5px;">Order Details</div>
            <div>Order Date: ${new Date(order.orderDate).toLocaleDateString()}</div>
            <div>Delivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}</div>
            <div>Shipping Method: ${order.shippingMethod}</div>
            ${order.trackingNumber ? `<div>Tracking Number: ${order.trackingNumber}</div>` : ''}
          </div>
          
          <div class="customer-info">
            <div style="font-weight: bold; margin-bottom: 5px;">Customer Information</div>
            <div>${order.customerName}</div>
            <div>${order.customerEmail}</div>
            <div>${order.customerPhone}</div>
            <div>${order.customerAddress}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">Total Amount:</td>
                <td>$${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="footer">
            Thank you for your business!
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    printWindow.onload = function() {
      printWindow.print();
      // Close the window after printing (optional)
      // printWindow.close();
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order Details - {order.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Date:</span>
                <span>{new Date(order.deliveryDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Method:</span>
                <span>{order.shippingMethod}</span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tracking Number:</span>
                  <span className="font-mono">{order.trackingNumber}</span>
                </div>
              )}
              {order.notes && (
                <div>
                  <span className="text-gray-600">Notes:</span>
                  <p className="mt-1 text-sm">{order.notes}</p>
                </div>
              )}
            </div>

            {order.status === 'pending' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Order Status
                </label>
                <select
                  onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue=""
                >
                  <option value="" disabled>Select new status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <span className="text-sm">{order.customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Unit Price
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 text-sm">{item.name}</td>
                      <td className="px-4 py-2 text-sm">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm font-medium">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right">
                      Total Amount:
                    </td>
                    <td className="px-4 py-2 text-sm font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <button 
            onClick={handlePrintInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print Invoice
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;