import React from 'react';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';

const InventoryManagement = ({ inventory, updateItemStatus, removeItem }) => {
  const handleUpdateStock = (id, newStock) => {
    // Here you would typically update Firebase, but for this example, we'll simulate it
    // You can extend this to call updateItemStatus with appropriate logic
    console.log(`Updating stock for item ${id} to ${newStock}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Inventory Management</h2>
      {inventory.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Threshold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="number"
                      defaultValue={item.currentStock}
                      onBlur={(e) => handleUpdateStock(item.id, e.target.value)}
                      className="w-20 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minThreshold}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.currentStock <= item.minThreshold ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.currentStock <= item.minThreshold ? 'Low Stock' : 'Good'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => removeItem('inventory', item.id)} className="text-red-600 hover:text-red-900 mr-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => {/* Edit logic */}} className="text-blue-600 hover:text-blue-900">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inventory Items</h3>
          <p className="text-gray-600">Inventory items will appear here when medicines are approved</p>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;