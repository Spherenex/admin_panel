// import React, { useState } from 'react';
// import { X, Check, Save, Loader } from 'lucide-react';
// import { database } from '../../firebase/config';
// import { ref, push, set } from 'firebase/database';

// const VeterinarianModal = ({ onClose, onSave }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     specialization: '',
//     experience: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState(null);

//   const handleInputChange = (field, value) => {
//     setFormData(prevData => ({
//       ...prevData,
//       [field]: value
//     }));
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: null }));
//     }
//     if (apiError) {
//       setApiError(null);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.name) newErrors.name = "Name is required";
//     if (!formData.email) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
//     if (!formData.password) newErrors.password = "Password is required";
//     else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
//     if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
//     else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
//     if (!formData.phone) newErrors.phone = "Phone number is required";
//     if (!formData.specialization) newErrors.specialization = "Specialization is required";
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (validateForm()) {
//       setIsLoading(true);
//       try {
//         // Create the veterinarian object without confirmPassword
//         const veterinarianData = {
//           ...formData,
//           role: 'veterinary',
//           experience: parseInt(formData.experience) || 0,
//           createdAt: new Date().toISOString(),
//           status: 'active'
//         };
//         delete veterinarianData.confirmPassword;
        
//         // Save to Firebase
//         const newVetRef = push(ref(database, 'veterinary'));
//         const vetId = newVetRef.key;
        
//         await set(newVetRef, {
//           ...veterinarianData,
//           id: vetId
//         });
        
//         onSave({
//           id: vetId,
//           ...veterinarianData
//         });
        
//         setSubmitted(true);
//         setTimeout(() => {
//           onClose();
//         }, 1500);
//       } catch (error) {
//         console.error('Error saving veterinarian:', error);
//         setApiError(error.message || 'Failed to save. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
//         <button 
//           onClick={onClose}
//           disabled={isLoading}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <X className="w-5 h-5" />
//         </button>
        
//         {submitted ? (
//           <div className="text-center py-10">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Check className="w-8 h-8 text-green-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Veterinarian Added!</h3>
//             <p className="text-gray-600">Successfully registered with login credentials</p>
//           </div>
//         ) : (
//           <>
//             <h3 className="text-lg font-semibold mb-4">Add New Veterinarian</h3>
            
//             {apiError && (
//               <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
//                 {apiError}
//               </div>
//             )}
            
//             <div className="space-y-4">
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Full Name (e.g., Dr. John Doe)"
//                   value={formData.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   disabled={isLoading}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
//                 />
//                 {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
//               </div>
              
//               <div>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   disabled={isLoading}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
//                 />
//                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//               </div>
              
//               <div>
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={(e) => handleInputChange('password', e.target.value)}
//                   disabled={isLoading}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
//                 />
//                 {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//               </div>
              
//               <div>
//                 <input
//                   type="password"
//                   placeholder="Confirm Password"
//                   value={formData.confirmPassword}
//                   onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                   disabled={isLoading}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
//                 />
//                 {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
//               </div>
              
//               <div>
//                 <input
//                   type="tel"
//                   placeholder="Phone Number"
//                   value={formData.phone}
//                   onChange={(e) => handleInputChange('phone', e.target.value)}
//                   disabled={isLoading}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
//                 />
//                 {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//               </div>
              
//               <div>
//                 <select
//                   value={formData.specialization}
//                   onChange={(e) => handleInputChange('specialization', e.target.value)}
//                   disabled={isLoading}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.specialization ? 'border-red-500' : 'border-gray-300'}`}
//                 >
//                   <option value="">Select Specialization</option>
//                   <option value="Small Animals">Small Animals</option>
//                   <option value="Large Animals">Large Animals</option>
//                   <option value="Exotic Animals">Exotic Animals</option>
//                   <option value="Surgery">Surgery</option>
//                   <option value="Cardiology">Cardiology</option>
//                 </select>
//                 {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
//               </div>
              
//               <div>
//                 <input
//                   type="number"
//                   placeholder="Years of Experience"
//                   value={formData.experience}
//                   onChange={(e) => handleInputChange('experience', e.target.value)}
//                   disabled={isLoading}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   min="0"
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   onClick={onClose}
//                   disabled={isLoading}
//                   className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader className="w-4 h-4 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4 mr-2" />
//                       Add Veterinarian
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VeterinarianModal;


import React, { useState, useRef } from 'react';
import { X, Check, Save, Loader } from 'lucide-react';
import { database } from '../../firebase/config';
import { ref, push, set, get, query, orderByChild, equalTo } from 'firebase/database';

const VeterinarianModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    experience: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // Use refs to track submission state and prevent duplicates
  const isSubmittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);

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
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkForDuplicateEmail = async (email) => {
    try {
      // Check if email already exists in the database
      const vetsRef = ref(database, 'veterinary');
      const emailQuery = query(vetsRef, orderByChild('email'), equalTo(email));
      const snapshot = await get(emailQuery);
      
      // Return true if email already exists
      return snapshot.exists();
    } catch (error) {
      console.error("Error checking for duplicate email:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmittingRef.current || hasSubmittedRef.current) {
      console.log("Preventing duplicate submission");
      return;
    }
    
    // Set submission flag
    isSubmittingRef.current = true;
    
    try {
      // Validate form
      if (!validateForm()) {
        isSubmittingRef.current = false;
        return;
      }
      
      setIsLoading(true);
      
      // Check for duplicate email
      const emailExists = await checkForDuplicateEmail(formData.email);
      if (emailExists) {
        setApiError("A veterinarian with this email already exists.");
        setIsLoading(false);
        isSubmittingRef.current = false;
        return;
      }
      
      // Create veterinarian data object
      const veterinarianData = {
        ...formData,
        role: 'veterinary',
        experience: parseInt(formData.experience) || 0,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      delete veterinarianData.confirmPassword;
      
      // Generate a new unique ID
      const newVetRef = push(ref(database, 'veterinary'));
      const vetId = newVetRef.key;
      
      // Add ID to the data
      const dataWithId = {
        ...veterinarianData,
        id: vetId
      };
      
      // Save to Firebase
      await set(newVetRef, dataWithId);
      
      // Mark as submitted to prevent duplicate submissions
      hasSubmittedRef.current = true;
      
      // Call onSave callback with the data
      onSave(dataWithId);
      
      // Show success message
      setSubmitted(true);
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving veterinarian:', error);
      setApiError(error.message || 'Failed to save. Please try again.');
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
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
        
        {submitted ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Veterinarian Added!</h3>
            <p className="text-gray-600">Successfully registered with login credentials</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Add New Veterinarian</h3>
            
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
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
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
                  disabled={isLoading || hasSubmittedRef.current}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add Veterinarian
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VeterinarianModal;