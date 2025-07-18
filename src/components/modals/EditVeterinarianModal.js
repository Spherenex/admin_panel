import React, { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';
import { database } from '../../firebase/config';
import { ref, update } from 'firebase/database';

const EditVeterinarianModal = ({ veterinarian, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (veterinarian) {
      setFormData({
        name: veterinarian.name || '',
        email: veterinarian.email || '',
        phone: veterinarian.phone || '',
        specialization: veterinarian.specialization || '',
        experience: veterinarian.experience || ''
      });
    }
  }, [veterinarian]);

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
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Create the veterinarian object for update
        const veterinarianData = {
          ...formData,
          experience: parseInt(formData.experience) || 0,
          updatedAt: new Date().toISOString()
        };
        
        // Update in Firebase
        const vetRef = ref(database, `veterinary/${veterinarian.id}`);
        await update(vetRef, veterinarianData);
        
        onSave({
          id: veterinarian.id,
          ...veterinarianData
        });
        
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error('Error updating veterinarian:', error);
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
        
        <h3 className="text-lg font-semibold mb-4">Edit Veterinarian</h3>
        
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
            {apiError}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name (e.g., Dr. John Doe)"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <select
              value={formData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.specialization ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Specialization</option>
              <option value="Small Animals">Small Animals</option>
              <option value="Large Animals">Large Animals</option>
              <option value="Exotic Animals">Exotic Animals</option>
              <option value="Surgery">Surgery</option>
              <option value="Cardiology">Cardiology</option>
            </select>
            {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
          </div>
          
          <div>
            <input
              type="number"
              placeholder="Years of Experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Veterinarian
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVeterinarianModal;