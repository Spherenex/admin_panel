// import React, { useState } from 'react';
// import { X, Check, Save, Loader } from 'lucide-react';
// import { getDatabase, ref, set, query, orderByChild, equalTo, get } from 'firebase/database';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// const SupplierModal = ({ onClose, onSave }) => {
//   const db = getDatabase();
//   const auth = getAuth();

//   const [formData, setFormData] = useState({
//     companyName: '',
//     contactPerson: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     businessLicense: ''
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
//       setErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }

//     if (apiError) {
//       setApiError(null);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.companyName) newErrors.companyName = "Company name is required";
//     if (!formData.email) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

//     if (!formData.password) newErrors.password = "Password is required";
//     else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

//     if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
//     else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

//     if (!formData.phone) newErrors.phone = "Phone number is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (validateForm()) {
//       setIsLoading(true);

//       try {
//         const supplierData = {
//           ...formData,
//           role: 'supplier'
//         };

//         delete supplierData.confirmPassword;

//         const supplierRef = ref(db, 'supplier');
//         const emailQuery = query(supplierRef, orderByChild('email'), equalTo(supplierData.email));
//         const snapshot = await get(emailQuery);

//         if (snapshot.exists()) {
//           throw new Error('email already exists');
//         }

//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           supplierData.email,
//           supplierData.password
//         );

//         const uid = userCredential.user.uid;
//         const { password, ...dataToStore } = supplierData;

//         await set(ref(db, `supplier/user-${uid}`), {
//           ...dataToStore,
//           uid,
//           status: 'active',
//           createdAt: new Date().toISOString()
//         });

//         onSave({
//           id: uid,
//           ...dataToStore,
//           status: 'active'
//         });

//         setSubmitted(true);

//         setTimeout(() => {
//           onClose();
//         }, 1500);
//       } catch (error) {
//         console.error('Error saving supplier:', error);

//         if (error.message.includes('email already exists') || error.code === 'auth/email-already-in-use') {
//           setErrors(prev => ({
//             ...prev,
//             email: 'This email is already registered'
//           }));
//         } else {
//           setApiError(error.message || 'Failed to save. Please try again.');
//         }
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
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Added!</h3>
//             <p className="text-gray-600">Successfully registered with login credentials</p>
//           </div>
//         ) : (
//           <>
//             <h3 className="text-lg font-semibold mb-4">Add New Supplier</h3>

//             {apiError && (
//               <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
//                 {apiError}
//               </div>
//             )}

//             <div className="space-y-4">
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Company Name"
//                   value={formData.companyName}
//                   onChange={(e) => handleInputChange('companyName', e.target.value)}
//                   disabled={isLoading}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
//                 />
//                 {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
//               </div>

//               <div>
//                 <input
//                   type="text"
//                   placeholder="Contact Person"
//                   value={formData.contactPerson}
//                   onChange={(e) => handleInputChange('contactPerson', e.target.value)}
//                   disabled={isLoading}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={(e) => handleInputChange('email', e.target.value)}
//                   disabled={isLoading}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
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
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
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
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
//                 />
//                 {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
//               </div>

//               <div>
//                 <input
//                   type="text"
//                   placeholder="Business License Number"
//                   value={formData.businessLicense}
//                   onChange={(e) => handleInputChange('businessLicense', e.target.value)}
//                   disabled={isLoading}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
//                   className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader className="w-4 h-4 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4 mr-2" />
//                       Add Supplier
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

// export default SupplierModal;



import React, { useState, useRef } from 'react';
import { X, Check, Save, Loader } from 'lucide-react';
import { getDatabase, ref, set, query, orderByChild, equalTo, get } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SupplierModal = ({ onClose, onSave }) => {
  const db = getDatabase();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessLicense: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // Use refs to prevent duplicate submissions
  const isSubmittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const handleInputChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName) newErrors.companyName = "Company name is required";
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

  const checkForDuplicateEmail = async (email) => {
    try {
      // Check if this email is already registered as a supplier
      const supplierRef = ref(db, 'supplier');
      const emailQuery = query(supplierRef, orderByChild('email'), equalTo(email));
      const snapshot = await get(emailQuery);
      
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
      // First validate the form
      if (!validateForm()) {
        isSubmittingRef.current = false;
        return;
      }
      
      setIsLoading(true);
      
      // Check for duplicate email
      const emailExists = await checkForDuplicateEmail(formData.email);
      if (emailExists) {
        setErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
        setIsLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      // Create supplier data object
      const supplierData = {
        ...formData,
        role: 'supplier'
      };
      delete supplierData.confirmPassword;

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        supplierData.email,
        supplierData.password
      );

      // Get user ID from Firebase Auth
      const uid = userCredential.user.uid;
      
      // Create a unique ID for the supplier that includes the auth UID
      const supplierId = `user-${uid}`;
      
      // Remove password from data before storing
      const { password, ...dataToStore } = supplierData;

      // Store data in Firebase Realtime Database
      await set(ref(db, `supplier/${supplierId}`), {
        ...dataToStore,
        id: supplierId, // Include the ID in the data for easier reference
        uid,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      
      // Mark as submitted to prevent duplicate submissions
      hasSubmittedRef.current = true;

      // Call onSave callback with the complete data
      onSave({
        id: supplierId,
        ...dataToStore,
        uid,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      // Show success message
      setSubmitted(true);
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving supplier:', error);

      if (error.message.includes('email already exists') || error.code === 'auth/email-already-in-use') {
        setErrors(prev => ({
          ...prev,
          email: 'This email is already registered'
        }));
      } else {
        setApiError(error.message || 'Failed to save. Please try again.');
      }
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Added!</h3>
            <p className="text-gray-600">Successfully registered with login credentials</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-4">Add New Supplier</h3>

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
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Contact Person"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Business License Number"
                  value={formData.businessLicense}
                  onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
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
  );
};

export default SupplierModal;