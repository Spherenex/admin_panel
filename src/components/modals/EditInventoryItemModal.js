import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { database } from '../../firebase/config';
import { ref, update } from 'firebase/database';

const EditInventoryItemModal = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    currentStock: '',
    minStock: '',
    maxStock: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        price: item.price || '',
        currentStock: item.currentStock || 0,
        minStock: item.minStock || 0,
        maxStock: item.maxStock || 100,
        description: item.description || ''
      });
    }
  }, [item]);

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (isNaN(parseFloat(formData.price))) newErrors.price = "Price must be a number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Prepare the data for update
        const itemData = {
          ...formData,
          price: parseFloat(formData.price),
          currentStock: parseInt(formData.currentStock) || 0,
          minStock: parseInt(formData.minStock) || 0,
          maxStock: parseInt(formData.maxStock) || 100,
          updatedAt: new Date().toISOString(),
          status: parseInt(formData.currentStock) === 0 ? 'out-of-stock' : 
                 parseInt(formData.currentStock) <= parseInt(formData.minStock) ? 'low-stock' : 'in-stock'
        };
        
        // Update in Firebase
        const itemRef = ref(database, `medicines/${item.id}`);
        await update(itemRef, itemData);
        
        onSave({
          id: item.id,
          ...itemData
        });
        
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error('Error updating inventory item:', error);
        setApiError(error.message || 'Failed to update. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-lg font-semibold mb-4">Edit Inventory Item</h3>
        
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
            {apiError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Medicine Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Category</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Vaccines">Vaccines</option>
              <option value="Vitamins">Vitamins</option>
              <option value="Prescription">Prescription</option>
              <option value="Over-the-counter">Over-the-counter</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          
          <div>
            <input
              type="number"
              placeholder="Price (₹)"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              min="0"
              step="0.01"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Current Stock</label>
              <input
                type="number"
                placeholder="Current Stock"
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min Stock</label>
              <input
                type="number"
                placeholder="Min Stock"
                value={formData.minStock}
                onChange={(e) => handleInputChange('minStock', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max Stock</label>
              <input
                type="number"
                placeholder="Max Stock"
                value={formData.maxStock}
                onChange={(e) => handleInputChange('maxStock', e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          
          <div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="3"
            />
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Item
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInventoryItemModal;