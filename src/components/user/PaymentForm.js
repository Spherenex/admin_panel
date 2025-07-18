// // components/user/PaymentForm.js
// import React, { useState } from 'react';

// const PaymentForm = ({ amount, appointmentDetails, onClose, onSuccess }) => {
//   const [paymentMethod, setPaymentMethod] = useState('card');
//   const [cardDetails, setCardDetails] = useState({
//     number: '',
//     name: '',
//     expiry: '',
//     cvv: ''
//   });
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleInputChange = (field, value) => {
//     setCardDetails({
//       ...cardDetails,
//       [field]: value
//     });
    
//     // Clear error when field is edited
//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: null
//       });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Basic validations
//     if (!cardDetails.number) {
//       newErrors.number = 'Card number is required';
//     } else if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
//       newErrors.number = 'Invalid card number';
//     }
    
//     if (!cardDetails.name) {
//       newErrors.name = 'Cardholder name is required';
//     }
    
//     if (!cardDetails.expiry) {
//       newErrors.expiry = 'Expiry date is required';
//     } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
//       newErrors.expiry = 'Invalid format (MM/YY)';
//     }
    
//     if (!cardDetails.cvv) {
//       newErrors.cvv = 'CVV is required';
//     } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
//       newErrors.cvv = 'Invalid CVV';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }
    
//     setIsProcessing(true);
    
//     // Simulate payment processing
//     setTimeout(() => {
//       // Create a mock payment result
//       const paymentResult = {
//         id: 'pay_' + Math.random().toString(36).substr(2, 9),
//         amount: amount,
//         currency: 'INR',
//         status: 'successful',
//         method: paymentMethod,
//         timestamp: new Date().toISOString()
//       };
      
//       setIsProcessing(false);
//       onSuccess(paymentResult);
//     }, 2000);
//   };

//   const formatCardNumber = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     const matches = v.match(/\d{4,16}/g);
//     const match = (matches && matches[0]) || '';
//     const parts = [];
    
//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }
    
//     if (parts.length) {
//       return parts.join(' ');
//     } else {
//       return value;
//     }
//   };

//   const formatExpiryDate = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
//     if (v.length >= 3) {
//       return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
//     }
    
//     return value;
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
//         {/* Header */}
//         <div className="bg-blue-600 p-4 text-white">
//           <h3 className="text-lg font-semibold">Payment Details</h3>
//           <p className="text-sm text-blue-100">Secure payment for your appointment</p>
//         </div>
        
//         {/* Appointment Summary */}
//         <div className="p-4 bg-gray-50 border-b">
//           <h4 className="font-medium text-gray-800 mb-2">Appointment Summary</h4>
//           <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
//             <div>
//               <span className="text-gray-600">Veterinarian:</span>
//             </div>
//             <div className="font-medium text-gray-800">
//               {appointmentDetails.veterinarian.name}
//             </div>
//             <div>
//               <span className="text-gray-600">Date:</span>
//             </div>
//             <div className="font-medium text-gray-800">
//               {appointmentDetails.date.toDateString()}
//             </div>
//             <div>
//               <span className="text-gray-600">Time:</span>
//             </div>
//             <div className="font-medium text-gray-800">
//               {appointmentDetails.time}
//             </div>
//             <div>
//               <span className="text-gray-600">Amount:</span>
//             </div>
//             <div className="font-medium text-gray-800">
//               ₹{amount.toFixed(2)}
//             </div>
//           </div>
//         </div>
        
//         {/* Payment Form */}
//         <form onSubmit={handleSubmit} className="p-4">
//           {/* Payment Method Tabs */}
//           <div className="flex border-b mb-4">
//             <button
//               type="button"
//               onClick={() => setPaymentMethod('card')}
//               className={`px-4 py-2 ${paymentMethod === 'card' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
//             >
//               Credit/Debit Card
//             </button>
//             <button
//               type="button"
//               onClick={() => setPaymentMethod('upi')}
//               className={`px-4 py-2 ${paymentMethod === 'upi' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
//             >
//               UPI
//             </button>
//           </div>
          
//           {/* Card Payment Form */}
//           {paymentMethod === 'card' && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
//                 <input
//                   type="text"
//                   placeholder="1234 5678 9012 3456"
//                   value={cardDetails.number}
//                   onChange={(e) => handleInputChange('number', formatCardNumber(e.target.value))}
//                   className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
//                   maxLength={19}
//                   disabled={isProcessing}
//                 />
//                 {errors.number && <p className="mt-1 text-sm text-red-600">{errors.number}</p>}
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
//                 <input
//                   type="text"
//                   placeholder="John Smith"
//                   value={cardDetails.name}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
//                   disabled={isProcessing}
//                 />
//                 {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//                   <input
//                     type="text"
//                     placeholder="MM/YY"
//                     value={cardDetails.expiry}
//                     onChange={(e) => handleInputChange('expiry', formatExpiryDate(e.target.value))}
//                     className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expiry ? 'border-red-500' : 'border-gray-300'}`}
//                     maxLength={5}
//                     disabled={isProcessing}
//                   />
//                   {errors.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>}
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
//                   <input
//                     type="text"
//                     placeholder="123"
//                     value={cardDetails.cvv}
//                     onChange={(e) => handleInputChange('cvv', e.target.value)}
//                     className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
//                     maxLength={4}
//                     disabled={isProcessing}
//                   />
//                   {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
//                 </div>
//               </div>
//             </div>
//           )}
          
//           {/* UPI Payment Form */}
//           {paymentMethod === 'upi' && (
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
//                 <input
//                   type="text"
//                   placeholder="name@upi"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   disabled={isProcessing}
//                 />
//               </div>
              
//               <div className="flex items-center space-x-2 justify-center mb-2">
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png" alt="UPI" className="h-6" />
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/1280px-Paytm_Logo_%28standalone%29.svg.png" alt="Paytm" className="h-6" />
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1280px-Google_Pay_Logo.svg.png" alt="Google Pay" className="h-6" />
//                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/1280px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-6" />
//               </div>
//             </div>
//           )}
          
//           {/* Action Buttons */}
//           <div className="flex justify-end mt-6 space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               disabled={isProcessing}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               disabled={isProcessing}
//             >
//               {isProcessing ? (
//                 <div className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </div>
//               ) : (
//                 `Pay ₹${amount.toFixed(2)}`
//               )}
//             </button>
//           </div>
          
//           {/* Security Notice */}
//           <div className="mt-4 text-center text-xs text-gray-500">
//             <p>Your payment information is secure and encrypted.</p>
//             <div className="flex justify-center mt-2 space-x-2">
//               <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//               </svg>
//               <span>Secure Payment</span>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PaymentForm;


import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';

const PetDetailsForm = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petType, setPetType] = useState('dog');
  const [breed, setBreed] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ show: false, type: '', text: '' });
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetch existing pets
  useEffect(() => {
    if (currentUser) {
      const db = getDatabase();
      const petsRef = ref(db, `pets/${currentUser.uid}`);
      
      onValue(petsRef, (snapshot) => {
        const petsData = [];
        snapshot.forEach((childSnapshot) => {
          petsData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        setPets(petsData);
      });
    }
  }, [currentUser]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      
      // Convert to base64 string for localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!petName.trim() || !petAge.trim()) {
      setMessage({
        show: true,
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return;
    }
    
    try {
      setLoading(true);
      const db = getDatabase();
      const petsRef = ref(db, `pets/${currentUser.uid}`);
      const newPetRef = push(petsRef);
      const petId = newPetRef.key;
      
      // Use the base64 string directly from photoPreview
      let photoData = '';
      if (photoPreview) {
        photoData = photoPreview;
        
        // Store image in localStorage with unique key based on user and pet ID
        const imageKey = `pet_image_${currentUser.uid}_${petId}`;
        localStorage.setItem(imageKey, photoData);
      }
      
      // Save pet data to Firebase (with imageKey reference but not the actual image)
      const petData = {
        id: petId,
        name: petName,
        age: petAge,
        type: petType,
        breed: breed || 'Not specified',
        hasImage: !!photoData, // Flag to indicate if an image exists
        imageKey: photoData ? `pet_image_${currentUser.uid}_${petId}` : '', // Store reference to localStorage key
        createdAt: new Date().toISOString()
      };
      
      await set(newPetRef, petData);
      
      // Reset form
      setPetName('');
      setPetAge('');
      setPetType('dog');
      setBreed('');
      setPhotoFile(null);
      setPhotoPreview(null);
      
      setMessage({
        show: true,
        type: 'success',
        text: 'Pet added successfully!'
      });
      
      setTimeout(() => {
        setMessage({ show: false, type: '', text: '' });
        setShowForm(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error adding pet:', error);
      setMessage({
        show: true,
        type: 'error',
        text: 'Failed to add pet. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form and message when toggling
    if (!showForm) {
      setPetName('');
      setPetAge('');
      setPetType('dog');
      setBreed('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setMessage({ show: false, type: '', text: '' });
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">My Pets</h3>
        <button
          onClick={toggleForm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {showForm ? 'Cancel' : 'Add New Pet'}
        </button>
      </div>

      {/* Pet list */}
      {pets.length > 0 && !showForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {pet.photoURL ? (
                  <img 
                    src={pet.photoURL} 
                    alt={pet.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg">{pet.name}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Age: {pet.age}</p>
                  <p>Type: {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</p>
                  <p>Breed: {pet.breed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No pets message */}
      {pets.length === 0 && !showForm && (
        <div className="text-center py-6 bg-gray-50 rounded-lg mb-6">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-1">No Pets Added Yet</h4>
          <p className="text-gray-500 mb-4">Add your first pet to keep track of their health records</p>
        </div>
      )}

      {/* Add pet form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {message.show && (
            <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Photo</label>
              <div className="flex items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden mr-4">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Pet preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="bg-white border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">Choose File</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="sr-only" 
                    onChange={handlePhotoChange} 
                  />
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pet name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Age *
                </label>
                <input
                  type="text"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2 years"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Type
                </label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="fish">Fish</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter breed (optional)"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={toggleForm}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {loading ? 'Saving...' : 'Save Pet Details'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PetDetailsForm;