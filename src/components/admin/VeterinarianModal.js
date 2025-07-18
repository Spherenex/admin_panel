



// import { useState } from 'react';
// import { X, Save, Check, Loader } from 'lucide-react';

// const VeterinarianModal = ({ onClose, onSave }) => {
//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     specialization: '',
//     experience: ''
//   });
  
//   // Error state
//   const [errors, setErrors] = useState({});
  
//   // Success state
//   const [submitted, setSubmitted] = useState(false);
  
//   // Loading state
//   const [isLoading, setIsLoading] = useState(false);
  
//   // API error state
//   const [apiError, setApiError] = useState(null);

//   // Handle input changes
//   const handleInputChange = (field, value) => {
//     setFormData(prevData => ({
//       ...prevData,
//       [field]: value
//     }));
    
//     // Clear error when field is edited
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
    
//     // Clear API error when any field changes
//     if (apiError) {
//       setApiError(null);
//     }
//   };

//   // Form validation
//   const validateForm = () => {
//     const newErrors = {};
    
//     // Required fields
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

//   // Save data to database
//   const saveToDatabase = async (veterinarianData) => {
//     try {
//       // Make API call to save data to the database
//       const response = await fetch('/api/veterinarians', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(veterinarianData),
//       });
      
//       if (!response.ok) {
//         // If the response is not ok, throw an error
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to save veterinarian data');
//       }
      
//       // Parse the response data
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       // Throw the error to be handled by the caller
//       throw error;
//     }
//   };

//   // Handle submit
//   const handleSubmit = async () => {
//     if (validateForm()) {
//       // Set loading state
//       setIsLoading(true);
      
//       try {
//         // Create the veterinarian object without confirmPassword
//         const veterinarianData = {
//           ...formData,
//           role: 'veterinarian',
//           experience: parseInt(formData.experience) || 0
//         };
        
//         // Remove confirmPassword as it's not needed in the final data
//         delete veterinarianData.confirmPassword;
        
//         // Save to database
//         const savedData = await saveToDatabase(veterinarianData);
        
//         // Call the onSave function with the response from the server
//         // This allows the parent component to update its state with the saved data
//         // which might include additional fields like ID, created_at, etc.
//         onSave(savedData);
        
//         // Show success state
//         setSubmitted(true);
        
//         // Close modal after 1.5 seconds
//         setTimeout(() => {
//           onClose();
//         }, 1500);
//       } catch (error) {
//         console.error('Error saving veterinarian:', error);
        
//         // Handle specific errors
//         if (error.message.includes('email already exists')) {
//           setErrors(prev => ({
//             ...prev,
//             email: 'This email is already registered'
//           }));
//         } else {
//           // Set general API error
//           setApiError(error.message || 'Failed to save. Please try again.');
//         }
//       } finally {
//         // Reset loading state
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
//         {/* Close button */}
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




import { useState } from 'react';
import { X, Save, Check, Loader } from 'lucide-react';
// Import Firebase SDK for Realtime Database
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const VeterinarianModal = ({ onClose, onSave }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specialization: '',
    experience: ''
  });
  
  // Error state
  const [errors, setErrors] = useState({});
  
  // Success state
  const [submitted, setSubmitted] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // API error state
  const [apiError, setApiError] = useState(null);

  // Handle input changes
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
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

  // Save data to Firebase Realtime Database
  const saveToDatabase = async (veterinarianData) => {
    try {
      const db = getDatabase();
      const auth = getAuth();
      
      // Check if the email already exists in the veterinary collection
      const veterinaryRef = ref(db, 'veterinary');
      const emailQuery = query(veterinaryRef, orderByChild('email'), equalTo(veterinarianData.email));
      const snapshot = await get(emailQuery);
      
      if (snapshot.exists()) {
        throw new Error('email already exists');
      }
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        veterinarianData.email, 
        veterinarianData.password
      );
      
      // Get the Firebase Auth UID
      const uid = userCredential.user.uid;
      
      // Remove password before storing in database
      const { password, ...dataToStore } = veterinarianData;
      
      // Create timestamp
      const timestamp = new Date().toISOString();
      
      // Store in veterinary collection
      await set(ref(db, `veterinary/user-${uid}`), {
        ...dataToStore,
        uid,
        status: 'active',
        createdAt: timestamp
      });
      
      // Return the saved data with the UID
      return {
        id: uid,
        ...dataToStore,
        status: 'active',
        createdAt: timestamp
      };
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      throw error;
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    if (validateForm()) {
      // Set loading state
      setIsLoading(true);
      
      try {
        // Create the veterinarian object without confirmPassword
        const veterinarianData = {
          ...formData,
          role: 'veterinary', // Match the role name in Firebase rules
          experience: parseInt(formData.experience) || 0
        };
        
        // Remove confirmPassword as it's not needed in the final data
        delete veterinarianData.confirmPassword;
        
        // Save to Firebase database
        const savedData = await saveToDatabase(veterinarianData);
        
        // Call the onSave function with the saved data
        onSave(savedData);
        
        // Show success state
        setSubmitted(true);
        
        // Close modal after 1.5 seconds
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error('Error saving veterinarian:', error);
        
        // Handle specific errors
        if (error.message.includes('email already exists')) {
          setErrors(prev => ({
            ...prev,
            email: 'This email is already registered'
          }));
        } else if (error.code === 'auth/email-already-in-use') {
          setErrors(prev => ({
            ...prev,
            email: 'This email is already registered'
          }));
        } else {
          // Set general API error
          setApiError(error.message || 'Failed to save. Please try again.');
        }
      } finally {
        // Reset loading state
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {/* Close button */}
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
                  disabled={isLoading}
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