



// import React, { useState, useEffect } from 'react';
// import { 
//   BarChart3, Users, UserCheck, Package, Calendar, AlertTriangle, 
//   FileText, Settings, LogOut, Bell, Plus, Search, Eye, Edit, 
//   X, Check, Star, TrendingUp, DollarSign, Activity, Clock,
//   Building2, Mail, Phone, MapPin, Save, RefreshCw, Loader, 
//   ShoppingBag, Truck, PieChart
// } from 'lucide-react';
// import { database } from '../../firebase/config'; // Import from your config file
// import { 
//   ref, 
//   onValue, 
//   set, 
//   push, 
//   update, 
//   remove, 
//   get,
//   query,
//   orderByChild,
//   equalTo
// } from 'firebase/database';

// // VeterinarianModal Component
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

// // SupplierModal Component
// const SupplierModal = ({ onClose, onSave }) => {
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
//       setErrors(prev => ({ ...prev, [field]: null }));
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
//         // Create the supplier object without confirmPassword
//         const supplierData = {
//           ...formData,
//           role: 'supplier',
//           createdAt: new Date().toISOString(),
//           status: 'active'
//         };
//         delete supplierData.confirmPassword;

//         // Save to Firebase
//         const newSupplierRef = push(ref(database, 'supplier'));
//         const supplierId = newSupplierRef.key;

//         await set(newSupplierRef, {
//           ...supplierData,
//           uid: supplierId
//         });

//         onSave({
//           id: supplierId,
//           ...supplierData
//         });

//         setSubmitted(true);
//         setTimeout(() => {
//           onClose();
//         }, 1500);
//       } catch (error) {
//         console.error('Error saving supplier:', error);
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

// // DonutChart Component for Analytics
// const DonutChart = ({ data }) => {
//   const total = data.reduce((acc, item) => acc + item.value, 0);
//   let currentAngle = 0;

//   return (
//     <div className="relative w-48 h-48 mx-auto">
//       <svg viewBox="0 0 100 100" className="w-full h-full">
//         {data.map((item, index) => {
//           const angle = (item.value / total) * 360;
//           const startAngle = currentAngle;
//           currentAngle += angle;
//           const endAngle = currentAngle;

//           // Convert angles to radians for calculation
//           const startAngleRad = (startAngle - 90) * (Math.PI / 180);
//           const endAngleRad = (endAngle - 90) * (Math.PI / 180);

//           // Calculate start and end points
//           const x1 = 50 + 40 * Math.cos(startAngleRad);
//           const y1 = 50 + 40 * Math.sin(startAngleRad);
//           const x2 = 50 + 40 * Math.cos(endAngleRad);
//           const y2 = 50 + 40 * Math.sin(endAngleRad);

//           // Determine if the arc should be drawn as a large arc
//           const largeArc = angle > 180 ? 1 : 0;

//           // Create the SVG path for the arc
//           const path = `
//             M 50 50
//             L ${x1} ${y1}
//             A 40 40 0 ${largeArc} 1 ${x2} ${y2}
//             Z
//           `;

//           return (
//             <path
//               key={index}
//               d={path}
//               fill={item.color}
//               stroke="#fff"
//               strokeWidth="1"
//             />
//           );
//         })}
//         {/* Inner circle to create donut */}
//         <circle cx="50" cy="50" r="25" fill="white" />
//       </svg>
//       <div className="absolute inset-0 flex items-center justify-center text-center">
//         <div>
//           <p className="text-2xl font-bold">{total}</p>
//           <p className="text-xs text-gray-500">Total</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main AdminDashboard Component
// const AdminDashboard = () => {
//   // State for navigation and data
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [showVetModal, setShowVetModal] = useState(false);
//   const [showSupplierModal, setShowSupplierModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [success, setSuccess] = useState(null);
//   const [error, setError] = useState(null);
//   const [processingOrder, setProcessingOrder] = useState(null);

//   // Data states for Firebase collections
//   const [users, setUsers] = useState([]);
//   const [veterinarians, setVeterinarians] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [inventory, setInventory] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [appointments, setAppointments] = useState([]);

//   // Fetch data from Firebase
//   useEffect(() => {
//     setIsLoading(true);

//     // Users
//     const usersRef = ref(database, 'users');
//     const usersListener = onValue(usersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const usersData = snapshot.val();
//         const usersArray = Object.keys(usersData).map(key => ({
//           id: key,
//           ...usersData[key]
//         }));
//         setUsers(usersArray);
//       } else {
//         setUsers([]);
//       }
//     });

//     // Veterinarians
//     const vetsRef = ref(database, 'veterinary');
//     const vetsListener = onValue(vetsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const vetsData = snapshot.val();
//         const vetsArray = Object.keys(vetsData).map(key => ({
//           id: key,
//           ...vetsData[key]
//         }));
//         setVeterinarians(vetsArray);
//       } else {
//         setVeterinarians([]);
//       }
//     });

//     // Suppliers
//     const suppliersRef = ref(database, 'supplier');
//     const suppliersListener = onValue(suppliersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const suppliersData = snapshot.val();
//         const suppliersArray = Object.keys(suppliersData).map(key => ({
//           id: key,
//           ...suppliersData[key]
//         }));
//         setSuppliers(suppliersArray);
//       } else {
//         setSuppliers([]);
//       }
//     });

//     // Medicines (both pending and approved)
//     const medicinesRef = ref(database, 'medicines');
//     const medicinesListener = onValue(medicinesRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const medicinesData = snapshot.val();
//         const pendingMedicines = [];
//         const approvedMedicines = [];

//         Object.keys(medicinesData).forEach(key => {
//           const medicine = {
//             id: key,
//             ...medicinesData[key]
//           };

//           if (medicine.approvalStatus === 'pending') {
//             pendingMedicines.push(medicine);
//           } else if (medicine.approvalStatus === 'approved') {
//             approvedMedicines.push(medicine);
//           }
//         });

//         setMedicines(pendingMedicines);
//         setInventory(approvedMedicines);
//       } else {
//         setMedicines([]);
//         setInventory([]);
//       }
//     });

//     // Orders
//     const ordersRef = ref(database, 'orders');
//     const ordersListener = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const ordersData = snapshot.val();
//         const ordersArray = Object.keys(ordersData).map(key => ({
//           id: key,
//           ...ordersData[key],
//           totalAmount: calculateOrderAmount(ordersData[key])
//         }));
//         setOrders(ordersArray);
//       } else {
//         setOrders([]);
//       }
//     });

//     // Appointments
//     const appointmentsRef = ref(database, 'appointments');
//     const appointmentsListener = onValue(appointmentsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const appointmentsData = snapshot.val();
//         const appointmentsArray = Object.keys(appointmentsData).map(key => ({
//           id: key,
//           ...appointmentsData[key]
//         }));
//         setAppointments(appointmentsArray);
//       } else {
//         setAppointments([]);
//       }
//     });

//     setIsLoading(false);

//     // Cleanup listeners on unmount
//     return () => {
//       usersListener();
//       vetsListener();
//       suppliersListener();
//       medicinesListener();
//       ordersListener();
//       appointmentsListener();
//     };
//   }, []);

//   // Helper function to calculate order amount (since it might not be in the data)
//   const calculateOrderAmount = (order) => {
//     // If totalAmount exists, use it
//     if (order.totalAmount) return order.totalAmount;

//     // Otherwise, use a default price
//     return order.totalItems ? order.totalItems * 150 : 150;
//   };

//   // Calculate statistics from real data
//   const stats = {
//     totalUsers: users.length,
//     totalVets: veterinarians.filter(v => v.status === 'active').length,
//     totalSuppliers: suppliers.filter(s => s.status === 'active').length,
//     totalAppointments: appointments.length,
//     totalOrders: orders.length,
//     pendingOrders: orders.filter(o => o.status === 'pending').length,
//     processingOrders: orders.filter(o => o.status === 'processing').length,
//     completedOrders: orders.filter(o => o.status === 'delivered').length,
//     totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
//     pendingApprovals: medicines.length,
//     lowStockItems: inventory.filter(i => (i.currentStock || 0) <= (i.minStock || 0)).length,
//     outOfStock: inventory.filter(i => (i.currentStock || 0) === 0).length
//   };

//   // Analytics data for the donut charts based on real data
//   const orderStatusData = [
//     { label: 'Pending', value: stats.pendingOrders, color: '#FCD34D' },
//     { label: 'Processing', value: stats.processingOrders, color: '#60A5FA' },
//     { label: 'Completed', value: stats.completedOrders, color: '#34D399' },
//   ];

//   const inventoryStatusData = [
//     { label: 'In Stock', value: inventory.length - stats.lowStockItems - stats.outOfStock, color: '#34D399' },
//     { label: 'Low Stock', value: stats.lowStockItems - stats.outOfStock, color: '#FCD34D' },
//     { label: 'Out of Stock', value: stats.outOfStock, color: '#F87171' },
//   ];

//   // Count medicines by category for the chart
//   const medicinesByCategory = inventory.reduce((acc, med) => {
//     acc[med.category] = (acc[med.category] || 0) + 1;
//     return acc;
//   }, {});

//   const medicinesByCategoryData = Object.keys(medicinesByCategory).map((category, index) => {
//     const colors = ['#818CF8', '#F472B6', '#A78BFA', '#60A5FA', '#34D399'];
//     return {
//       label: category,
//       value: medicinesByCategory[category],
//       color: colors[index % colors.length]
//     };
//   });

//   // Navigation menu items
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
//     { id: 'analytics', label: 'Analytics', icon: PieChart },
//     { id: 'veterinarians', label: 'Veterinarians', icon: UserCheck },
//     { id: 'suppliers', label: 'Suppliers', icon: Building2 },
//     { id: 'medicine-approval', label: 'Medicine Approval', icon: Package },
//     { id: 'inventory', label: 'Inventory', icon: AlertTriangle },
//     { id: 'orders', label: 'Orders', icon: Calendar },
//     { id: 'users', label: 'Users', icon: Users },
//   ];

//   // Handler functions for saving vets and suppliers
//   const handleSaveVeterinarian = (veterinarianData) => {
//     setVeterinarians(prev => [...prev, veterinarianData]);
//     setSuccess('Veterinarian added successfully!');
//   };

//   const handleSaveSupplier = (supplierData) => {
//     setSuppliers(prev => [...prev, supplierData]);
//     setSuccess('Supplier added successfully!');
//   };

//   // Function to update medicine approval status
//   const updateMedicineStatus = (id, status) => {
//     setIsLoading(true);

//     const medicineRef = ref(database, `medicines/${id}`);

//     get(medicineRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         const medicine = snapshot.val();

//         if (status === 'approved') {
//           // Update the medicine in Firebase
//           update(medicineRef, {
//             approvalStatus: 'approved',
//             currentStock: 100, // Default stock
//             minStock: 20,      // Default threshold
//             status: 'in-stock'
//           }).then(() => {
//             // Update local state
//             setMedicines(prev => prev.filter(med => med.id !== id));
//             setInventory(prev => [...prev, {
//               ...medicine,
//               id,
//               approvalStatus: 'approved',
//               currentStock: 100,
//               minStock: 20,
//               status: 'in-stock'
//             }]);
//             setSuccess('Medicine approved and added to inventory!');
//           }).catch(err => {
//             setError('Failed to update medicine status. Please try again.');
//             console.error(err);
//           });
//         } else if (status === 'rejected') {
//           // Remove from Firebase
//           remove(medicineRef).then(() => {
//             // Update local state
//             setMedicines(prev => prev.filter(med => med.id !== id));
//             setSuccess('Medicine rejected!');
//           }).catch(err => {
//             setError('Failed to reject medicine. Please try again.');
//             console.error(err);
//           });
//         }
//       } else {
//         setError('Medicine not found!');
//       }
//     }).catch(err => {
//       setError('Failed to fetch medicine data. Please try again.');
//       console.error(err);
//     }).finally(() => {
//       setIsLoading(false);
//     });
//   };

//   // Function to update order status
//   const updateOrderStatus = (id, status) => {
//     setProcessingOrder(id);

//     const orderRef = ref(database, `orders/${id}`);

//     update(orderRef, { status }).then(() => {
//       // Update local state
//       setOrders(prev => prev.map(order => 
//         order.id === id ? { ...order, status } : order
//       ));
//       setSuccess(`Order status updated to ${status}!`);
//     }).catch(err => {
//       setError('Failed to update order status. Please try again.');
//       console.error(err);
//     }).finally(() => {
//       setProcessingOrder(null);
//     });
//   };

//   // Logout function
//   const handleLogout = () => {
//     // In a real app, this would call your auth signOut function
//     alert('Logged out successfully! Redirecting to login page...');
//     // In a real app, this would redirect to login
//     window.location.href = '/login';
//   };

//   // Dashboard Overview Component
//   const DashboardOverview = () => (
//     <div className="space-y-6">
//       {success && (
//         <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{success}</span>
//           <button onClick={() => setSuccess(null)} className="text-green-700">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="text-red-700">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Users</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
//             </div>
//             <Users className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Active Veterinarians</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalVets}</p>
//             </div>
//             <UserCheck className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Orders</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
//             </div>
//             <Calendar className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Revenue</p>
//               <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
//             </div>
//             {/* <DollarSign className="w-8 h-8 text-yellow-600" /> */}
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <button
//             onClick={() => setShowVetModal(true)}
//             className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
//           >
//             <UserCheck className="w-6 h-6 mx-auto mb-2" />
//             <span className="text-sm font-medium">Add Veterinarian</span>
//           </button>

//           <button
//             onClick={() => setShowSupplierModal(true)}
//             className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
//           >
//             <Building2 className="w-6 h-6 mx-auto mb-2" />
//             <span className="text-sm font-medium">Add Supplier</span>
//           </button>

//           <button
//             onClick={() => setActiveTab('medicine-approval')}
//             className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
//           >
//             <Package className="w-6 h-6 mx-auto mb-2" />
//             <span className="text-sm font-medium">Approve Medicines</span>
//           </button>

//           <button
//             onClick={() => setActiveTab('inventory')}
//             className="p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
//           >
//             <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
//             <span className="text-sm font-medium">Check Inventory</span>
//           </button>
//         </div>
//       </div>

//       {/* Recent Orders */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Recent Orders</h3>
//           <button 
//             onClick={() => setActiveTab('orders')}
//             className="text-white-600 hover:text-blue-800 text-sm font-medium"
//           >
//             View All Orders
//           </button>
//         </div>

//         {orders.length > 0 ? (
//           <div className="space-y-4">
//             {orders.slice(0, 3).map(order => (
//               <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div>
//                   <div className="flex items-center">
//                     <ShoppingBag className="w-5 h-5 text-purple-600 mr-2" />
//                     <h4 className="font-medium">Order #{order.id.substring(0, 7)}</h4>
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {order.userName} • {order.totalItems} items • 
//                     {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                     order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                     order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
//                     order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {order.status}
//                   </span>

//                   {order.status === 'pending' && (
//                     <button 
//                       onClick={() => updateOrderStatus(order.id, 'processing')}
//                       disabled={processingOrder === order.id}
//                       className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                     >
//                       {processingOrder === order.id ? 'Processing...' : 'Process'}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-6">
//             <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//             <p className="text-gray-500">No orders have been placed yet</p>
//           </div>
//         )}
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//         <div className="space-y-3">
//           {medicines.slice(0, 2).map(medicine => (
//             <div key={medicine.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <Package className="w-5 h-5 text-green-600" />
//               <span className="text-sm">New medicine pending approval: {medicine.name}</span>
//             </div>
//           ))}
//           {veterinarians.slice(-2).map(vet => (
//             <div key={vet.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <UserCheck className="w-5 h-5 text-blue-600" />
//               <span className="text-sm">New veterinarian registered: {vet.name}</span>
//             </div>
//           ))}
//           {suppliers.slice(-2).map(supplier => (
//             <div key={supplier.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//               <Building2 className="w-5 h-5 text-purple-600" />
//               <span className="text-sm">New supplier registered: {supplier.companyName}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   // Analytics Page with Circular Graphs
//   const AnalyticsPage = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//               <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
//             </div>
//             {/* <DollarSign className="w-8 h-8 text-green-600" /> */}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Orders</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
//             </div>
//             <ShoppingBag className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Products</p>
//               <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
//             </div>
//             <Package className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
//             </div>
//             <AlertTriangle className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>
//       </div>

//       {/* Charts Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Order Status Chart */}
//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-center">Order Status</h3>
//           <DonutChart data={orderStatusData} />
//           <div className="mt-4 grid grid-cols-3 gap-2">
//             {orderStatusData.map((item, index) => (
//               <div key={index} className="flex items-center">
//                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
//                 <span className="text-xs">{item.label}: {item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Inventory Status Chart */}
//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-center">Inventory Status</h3>
//           <DonutChart data={inventoryStatusData} />
//           <div className="mt-4 grid grid-cols-3 gap-2">
//             {inventoryStatusData.map((item, index) => (
//               <div key={index} className="flex items-center">
//                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
//                 <span className="text-xs">{item.label}: {item.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Medicines by Category Chart */}
//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <h3 className="text-lg font-semibold mb-4 text-center">Medicines by Category</h3>
//           <DonutChart data={medicinesByCategoryData.length > 0 ? medicinesByCategoryData : [{ label: 'No Data', value: 1, color: '#E5E7EB' }]} />
//           <div className="mt-4 grid grid-cols-3 gap-2">
//             {medicinesByCategoryData.length > 0 ? medicinesByCategoryData.map((item, index) => (
//               <div key={index} className="flex items-center">
//                 <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
//                 <span className="text-xs">{item.label}: {item.value}</span>
//               </div>
//             )) : (
//               <div className="flex items-center col-span-3 justify-center">
//                 <span className="text-xs text-gray-500">No categories data available</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Recent Performance */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h4 className="font-medium mb-2">Top Selling Medicines</h4>
//             <div className="space-y-2">
//               {inventory.slice(0, 3).map((medicine, index) => {
//                 const salesCount = 42 - (index * 10); // Mock sales count
//                 const percentage = Math.round((salesCount / 50) * 100);

//                 return (
//                   <div key={medicine.id}>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm">{medicine.name}</span>
//                       <span className="text-sm font-medium">{salesCount} units</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
//                     </div>
//                   </div>
//                 );
//               })}

//               {inventory.length === 0 && (
//                 <div className="text-center py-3">
//                   <p className="text-sm text-gray-500">No medicine data available</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div>
//             <h4 className="font-medium mb-2">Revenue by Category</h4>
//             <div className="space-y-2">
//               {Object.entries(medicinesByCategory).slice(0, 3).map(([category, count], index) => {
//                 const revenue = 12500 - (index * 3500);
//                 const percentage = Math.round((revenue / 15000) * 100);

//                 return (
//                   <div key={category}>
//                     <div className="flex justify-between items-center">
//                       <span className="text-sm">{category}</span>
//                       <span className="text-sm font-medium">₹{revenue.toLocaleString()}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                       <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
//                     </div>
//                   </div>
//                 );
//               })}

//               {Object.keys(medicinesByCategory).length === 0 && (
//                 <div className="text-center py-3">
//                   <p className="text-sm text-gray-500">No revenue data available</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Medicine Approval Component
//   const MedicineApprovalPage = () => (
//     <div className="space-y-6">
//       {success && (
//         <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{success}</span>
//           <button onClick={() => setSuccess(null)} className="text-green-700">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="text-red-700">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <h2 className="text-2xl font-semibold">Medicine Approval</h2>

//       {isLoading ? (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600">Processing medicine approval...</p>
//         </div>
//       ) : medicines.length > 0 ? (
//         <div className="space-y-4">
//           {medicines.map(medicine => (
//             <div key={medicine.id} className="bg-white rounded-xl shadow-sm border p-6">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-semibold text-lg">{medicine.name}</h3>
//                   <p className="text-gray-600">Category: {medicine.category}</p>
//                   <p className="text-gray-600">Supplier: {medicine.supplier || 'Not specified'}</p>
//                   <p className="text-green-600 font-semibold">Price: ₹{medicine.price}</p>
//                   {medicine.description && (
//                     <p className="text-gray-600 mt-2">{medicine.description}</p>
//                   )}
//                 </div>

//                 <div className="flex space-x-2">
//                   {medicine.approvalStatus === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => updateMedicineStatus(medicine.id, 'approved')}
//                         disabled={isLoading}
//                         className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//                       >
//                         <Check className="w-4 h-4 mr-1" />
//                         Approve
//                       </button>
//                       <button
//                         onClick={() => updateMedicineStatus(medicine.id, 'rejected')}
//                         disabled={isLoading}
//                         className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
//                       >
//                         <X className="w-4 h-4 mr-1" />
//                         Reject
//                       </button>
//                     </>
//                   )}
//                   {medicine.approvalStatus !== 'pending' && (
//                     <span className={`px-3 py-2 text-sm rounded ${
//                       medicine.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {medicine.approvalStatus}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medicines to Approve</h3>
//           <p className="text-gray-600">Medicines submitted by suppliers will appear here for approval</p>
//         </div>
//       )}
//     </div>
//   );

//   // Inventory Management Component
//   const InventoryPage = () => (
//     <div className="space-y-6">
//       {success && (
//         <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{success}</span>
//           <button onClick={() => setSuccess(null)} className="text-green-700">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="text-red-700">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold">Inventory Management</h2>
//         <button onClick={() => setActiveTab('medicine-approval')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//           <Plus className="w-4 h-4 mr-2" />Medicine Approvals ({medicines.length})
//         </button>
//       </div>

//       {/* Inventory Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Products</p>
//               <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
//             </div>
//             <Package className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
//               <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
//             </div>
//             <AlertTriangle className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
//               <p className="text-2xl font-bold text-purple-600">{medicines.length}</p>
//             </div>
//             <Clock className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Out of Stock</p>
//               <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
//             </div>
//             <AlertTriangle className="w-8 h-8 text-red-600" />
//           </div>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading inventory...</p>
//         </div>
//       ) : inventory.length > 0 ? (
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <div className="px-6 py-4 border-b flex justify-between items-center">
//             <h3 className="font-semibold">Inventory Items</h3>
//             <div className="relative w-64">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search inventory..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {inventory.map(item => (
//                 <tr key={item.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {item.currentStock || 0} / {item.maxStock || 100}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       (item.currentStock || 0) === 0 ? 'bg-red-100 text-red-800' :
//                       (item.currentStock || 0) <= (item.minStock || 0) ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-green-100 text-green-800'
//                     }`}>
//                       {(item.currentStock || 0) === 0 ? 'Out of Stock' :
//                        (item.currentStock || 0) <= (item.minStock || 0) ? 'Low Stock' :
//                        'In Stock'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
//                     <button className="text-red-600 hover:text-red-900">Remove</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items in Inventory</h3>
//           <p className="text-gray-600 mb-6">Approved medicines will appear here</p>
//           <button 
//             onClick={() => setActiveTab('medicine-approval')}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go to Medicine Approvals
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   // Orders Management Component
//   const OrdersPage = () => (
//     <div className="space-y-6">
//       {success && (
//         <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{success}</span>
//           <button onClick={() => setSuccess(null)} className="text-green-700">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
//           <span>{error}</span>
//           <button onClick={() => setError(null)} className="text-red-700">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <h2 className="text-2xl font-semibold">Order Management</h2>

//       {/* Order Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Orders</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
//             </div>
//             <ShoppingBag className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pending</p>
//               <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
//             </div>
//             <Clock className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Processing</p>
//               <p className="text-2xl font-bold text-blue-600">{stats.processingOrders}</p>
//             </div>
//             <Truck className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Revenue</p>
//               <p className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading orders...</p>
//         </div>
//       ) : orders.length > 0 ? (
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <div className="px-6 py-4 border-b flex justify-between items-center">
//             <h3 className="font-semibold">Order List</h3>
//             <div className="relative w-64">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div className="divide-y divide-gray-200">
//             {orders.map(order => (
//               <div key={order.id} className="p-6">
//                 <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//                   <div className="mb-4 md:mb-0">
//                     <div className="flex items-center">
//                       <ShoppingBag className="w-5 h-5 text-purple-600 mr-2" />
//                       <h4 className="font-medium text-lg">
//                         Order #{order.id.substring(0, 7)}
//                       </h4>
//                       <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
//                         order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                         order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
//                         order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
//                         order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {order.status}
//                       </span>
//                     </div>
//                     <div className="flex items-center mt-1 text-gray-600 text-sm">
//                       <span className="mr-3">
//                         {order.userName}
//                       </span>
//                       <span className="mr-3">•</span>
//                       <span>
//                         {new Date(order.createdAt).toLocaleString()}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-2">
//                     {order.status === 'pending' && (
//                       <>
//                         <button 
//                           onClick={() => updateOrderStatus(order.id, 'processing')}
//                           disabled={processingOrder === order.id}
//                           className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
//                         >
//                           {processingOrder === order.id ? 'Processing...' : 'Process Order'}
//                         </button>
//                         <button 
//                           onClick={() => updateOrderStatus(order.id, 'cancelled')}
//                           disabled={processingOrder === order.id}
//                           className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     )}

//                     {order.status === 'processing' && (
//                       <button 
//                         onClick={() => updateOrderStatus(order.id, 'shipped')}
//                         disabled={processingOrder === order.id}
//                         className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
//                       >
//                         Mark as Shipped
//                       </button>
//                     )}

//                     {order.status === 'shipped' && (
//                       <button 
//                         onClick={() => updateOrderStatus(order.id, 'delivered')}
//                         disabled={processingOrder === order.id}
//                         className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
//                       >
//                         Mark as Delivered
//                       </button>
//                     )}

//                     <button className="p-1 text-blue-600 hover:text-blue-800 border border-blue-200 rounded">
//                       <Eye className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="mt-4 bg-gray-50 p-4 rounded-lg">
//                   {order.items && order.items.length > 0 ? (
//                     <div>
//                       <h5 className="text-sm font-medium text-gray-700 mb-2">Order Items:</h5>
//                       <div className="space-y-2">
//                         {order.items.map((item, index) => (
//                           <div key={index} className="flex justify-between text-sm">
//                             <div>
//                               <span className="font-medium">{item.medicineName}</span>
//                               <span className="text-gray-600 ml-2">({item.dosage})</span>
//                             </div>
//                             <span className="text-gray-700">Prescribed by: Dr. {item.doctor}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500 italic">No detailed item information available</p>
//                   )}

//                   <div className="flex justify-between mt-4 pt-2 border-t border-gray-200">
//                     <span className="text-sm text-gray-600">
//                       Total Items: {order.totalItems || order.items?.length || 'N/A'}
//                     </span>
//                     <span className="font-medium">
//                       Total Amount: ₹{order.totalAmount || 'N/A'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
//           <p className="text-gray-600">Orders will appear here when users make purchases</p>
//         </div>
//       )}
//     </div>
//   );

//   // VeterinariansPage Component
//   const VeterinariansPage = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold">Veterinarian Management</h2>
//         <button
//           onClick={() => setShowVetModal(true)}
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Veterinarian
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading veterinarians...</p>
//         </div>
//       ) : veterinarians.length > 0 ? (
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {veterinarians.map(vet => (
//                 <tr key={vet.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vet.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vet.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vet.specialization}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vet.experience} years</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       vet.status === 'active' ? 'bg-green-100 text-green-800' : 
//                       vet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {vet.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                     <button className="text-blue-600 hover:text-blue-900">
//                       Edit
//                     </button>
//                     <button className="text-red-600 hover:text-red-900">
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Veterinarians Yet</h3>
//           <p className="text-gray-600 mb-6">Start by adding veterinarians to your platform</p>
//           <button
//             onClick={() => setShowVetModal(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Add First Veterinarian
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   // SuppliersPage Component
//   const SuppliersPage = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold">Supplier Management</h2>
//         <button
//           onClick={() => setShowSupplierModal(true)}
//           className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Add Supplier
//         </button>
//       </div>

//       {isLoading ? (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading suppliers...</p>
//         </div>
//       ) : suppliers.length > 0 ? (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {suppliers.map(supplier => (
//             <div key={supplier.id} className="bg-white rounded-xl shadow-sm border p-6">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="font-semibold text-lg">{supplier.companyName}</h3>
//                   <p className="text-gray-600">Contact: {supplier.contactPerson}</p>
//                 </div>
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   supplier.status === 'active' ? 'bg-green-100 text-green-800' : 
//                   supplier.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
//                   'bg-red-100 text-red-800'
//                 }`}>
//                   {supplier.status}
//                 </span>
//               </div>

//               <div className="space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center">
//                   <Mail className="w-4 h-4 mr-2" />
//                   {supplier.email}
//                 </div>
//                 <div className="flex items-center">
//                   <Phone className="w-4 h-4 mr-2" />
//                   {supplier.phone}
//                 </div>
//                 {supplier.businessLicense && (
//                   <div className="flex items-center">
//                     <FileText className="w-4 h-4 mr-2" />
//                     License: {supplier.businessLicense}
//                   </div>
//                 )}
//               </div>

//               <div className="mt-4 flex space-x-2">
//                 <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
//                   Edit
//                 </button>
//                 <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Suppliers Yet</h3>
//           <p className="text-gray-600 mb-6">Start by adding suppliers to your platform</p>
//           <button
//             onClick={() => setShowSupplierModal(true)}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//           >
//             Add First Supplier
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   // UsersPage Component
//   const UsersPage = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold">User Management</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h3 className="font-semibold text-gray-900">Total Users</h3>
//           <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h3 className="font-semibold text-gray-900">Active Users</h3>
//           <p className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h3 className="font-semibold text-gray-900">New Users (This Week)</h3>
//           <p className="text-2xl font-bold text-purple-600">
//             {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
//           </p>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading users...</p>
//         </div>
//       ) : users.length > 0 ? (
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {users.map(user => (
//                 <tr key={user.id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
//                       {user.status || 'Active'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                     <button className="text-blue-600 hover:text-blue-900">
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//           <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Registered</h3>
//           <p className="text-gray-600">Users will appear here when they register on the platform</p>
//         </div>
//       )}
//     </div>
//   );

//   // Render active page based on navigation
//   const renderActivePage = () => {
//     switch (activeTab) {
//       case 'dashboard': return <DashboardOverview />;
//       case 'analytics': return <AnalyticsPage />;
//       case 'medicine-approval': return <MedicineApprovalPage />;
//       case 'inventory': return <InventoryPage />;
//       case 'orders': return <OrdersPage />;
//       case 'veterinarians': return <VeterinariansPage />;
//       case 'suppliers': return <SuppliersPage />;
//       case 'users': return <UsersPage />;
//       default: return <DashboardOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-6 border-b">
//           <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
//           <p className="text-sm text-gray-600">Veterinary Services</p>
//         </div>

//         <nav className="mt-6 gap-2 flex flex-col">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
//                   activeTab === item.id ? 'bg-lightblue-10 text-white-600 border-r-2 border-blue-600' : 'text-gray-600'
//                 }`}
//               >
//                 <Icon className="mr-3 h-5 w-5" />
//                 {item.label}
//                 {item.id === 'medicine-approval' && stats.pendingApprovals > 0 && (
//                   <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                     {stats.pendingApprovals}
//                   </span>
//                 )}
//                 {item.id === 'inventory' && stats.lowStockItems > 0 && (
//                   <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
//                     {stats.lowStockItems}
//                   </span>
//                 )}
//                 {item.id === 'orders' && stats.pendingOrders > 0 && (
//                   <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
//                     {stats.pendingOrders}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>

//         <div className="absolute bottom-0 w-64 p-6 border-t">
//           <button 
//             onClick={handleLogout}
//             className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//           >
//             <LogOut className="mr-3 h-5 w-5" />
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b px-6 py-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-2xl font-semibold text-gray-800 capitalize">
//               {activeTab === 'dashboard' ? 'Dashboard Overview' : 
//                activeTab === 'medicine-approval' ? 'Medicine Approval' :
//                activeTab.replace('-', ' ')}
//             </h2>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-600 hover:text-gray-800 relative">
//                 <Bell className="h-6 w-6" />
//                 {(stats.pendingApprovals + stats.lowStockItems + stats.pendingOrders) > 0 && (
//                   <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                     {stats.pendingApprovals + stats.lowStockItems + stats.pendingOrders}
//                   </span>
//                 )}
//               </button>
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-semibold">A</span>
//                 </div>
//                 <span className="text-gray-700">Admin</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {renderActivePage()}
//         </main>
//       </div>

//       {/* Modals */}
//       {showVetModal && (
//         <VeterinarianModal 
//           onClose={() => setShowVetModal(false)} 
//           onSave={handleSaveVeterinarian}
//         />
//       )}

//       {showSupplierModal && (
//         <SupplierModal 
//           onClose={() => setShowSupplierModal(false)} 
//           onSave={handleSaveSupplier}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;



import React, { useState, useEffect } from 'react';
import {
  BarChart3, Users, UserCheck, Package, Calendar, AlertTriangle,
  FileText, Settings, LogOut, Bell, Plus, Search, Eye, Edit,
  X, Check, Star, TrendingUp, DollarSign, Activity, Clock,
  Building2, Mail, Phone, MapPin, Save, RefreshCw, Loader,
  ShoppingBag, Truck, PieChart, Trash2
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { database } from '../../firebase/config'; // Import from your config file
import {
  ref,
  onValue,
  set,
  push,
  update,
  remove,
  get,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';

// Import modal components 
import {
  VeterinarianModal,
  SupplierModal,
  DonutChart,
  EditVeterinarianModal,
  EditSupplierModal,
  EditInventoryItemModal,
  DeleteConfirmationModal
} from '../modals/index';

// Main AdminDashboard Component
const AdminDashboard = () => {
  // State for navigation and data
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showVetModal, setShowVetModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [processingOrder, setProcessingOrder] = useState(null);
  const [feedback, setFeedback] = useState([]);
  // Data states for Firebase collections
  const [users, setUsers] = useState([]);
  const [veterinarians, setVeterinarians] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // State for edit/delete operations
  const [selectedVeterinarian, setSelectedVeterinarian] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [showVetEditModal, setShowVetEditModal] = useState(false);
  const [showSupplierEditModal, setShowSupplierEditModal] = useState(false);
  const [showInventoryEditModal, setShowInventoryEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState('');
  const [deleteItemName, setDeleteItemName] = useState('');
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
 const [localSelectedSupplierId, setLocalSelectedSupplierId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [showAssignSupplierModal, setShowAssignSupplierModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  // Fetch data from Firebase
  useEffect(() => {
    setIsLoading(true);

    // Users
    const usersRef = ref(database, 'users');
    const usersListener = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.keys(usersData).map(key => ({
          id: key,
          ...usersData[key]
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    });

    // Veterinarians
    const vetsRef = ref(database, 'veterinary');
    const vetsListener = onValue(vetsRef, (snapshot) => {
      if (snapshot.exists()) {
        const vetsData = snapshot.val();
        const vetsArray = Object.keys(vetsData).map(key => ({
          id: key,
          ...vetsData[key]
        }));
        setVeterinarians(vetsArray);
      } else {
        setVeterinarians([]);
      }
    });


const assignSupplierToOrder = async (orderId, supplierId) => {
  try {
    setIsLoading(true);
    
    // Get supplier info
    const supplierRef = ref(database, `supplier/${supplierId}`);
    const supplierSnapshot = await get(supplierRef);
    
    if (!supplierSnapshot.exists()) {
      throw new Error('Supplier not found');
    }
    
    const supplierData = supplierSnapshot.val();
    
    // Update the order with supplier information
    const orderRef = ref(database, `orders/${orderId}`);
    await update(orderRef, {
      supplierId: supplierId,
      supplierName: supplierData.companyName,
      assignedAt: new Date().toISOString(),
      assignmentStatus: 'assigned'
    });
    
    // Update local state
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            supplierId, 
            supplierName: supplierData.companyName, 
            assignedAt: new Date().toISOString(),
            assignmentStatus: 'assigned'
          } 
        : order
    ));
    
    setSuccess(`Order assigned to ${supplierData.companyName} successfully!`);
    setShowAssignSupplierModal(false);
    setAssigningOrderId(null);
    setSelectedSupplierId('');
  } catch (error) {
    console.error('Error assigning supplier:', error);
    setError(`Failed to assign supplier: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};

// Add this component for the supplier assignment modal


    // Suppliers
    const suppliersRef = ref(database, 'supplier');
    const suppliersListener = onValue(suppliersRef, (snapshot) => {
      if (snapshot.exists()) {
        const suppliersData = snapshot.val();
        const suppliersArray = Object.keys(suppliersData).map(key => ({
          id: key,
          ...suppliersData[key]
        }));
        setSuppliers(suppliersArray);
      } else {
        setSuppliers([]);
      }
    });

    const feedbackRef = ref(database, 'feedback');
    const feedbackListener = onValue(feedbackRef, (snapshot) => {
      if (snapshot.exists()) {
        const feedbackData = snapshot.val();
        const feedbackArray = Object.keys(feedbackData).map(key => ({
          id: key,
          ...feedbackData[key]
        }));
        setFeedback(feedbackArray);
      } else {
        setFeedback([]);
      }
    });


    // Create a new component for displaying veterinarian feedback
    const VeterinarianFeedback = ({ feedback, veterinarians }) => {
      const [selectedVet, setSelectedVet] = useState('all');
      const [filteredFeedback, setFilteredFeedback] = useState([]);

      useEffect(() => {
        // Filter feedback based on selected veterinarian
        if (selectedVet === 'all') {
          setFilteredFeedback(feedback);
        } else {
          setFilteredFeedback(feedback.filter(item => item.vetId === selectedVet));
        }
      }, [selectedVet, feedback]);

      // Function to calculate average rating
      const calculateAverageRating = (feedbackList) => {
        if (feedbackList.length === 0) return 0;
        const sum = feedbackList.reduce((total, item) => total + (item.rating || 0), 0);
        return (sum / feedbackList.length).toFixed(1);
      };

      // Format date for display
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
          return new Date(dateString).toLocaleDateString();
        } catch (e) {
          return dateString;
        }
      };

      // Generate star rating display
      const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(
            <Star
              key={i}
              className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          );
        }
        return stars;
      };

      return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Veterinarian Feedback</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Filter by veterinarian:</span>
              <select
                value={selectedVet}
                onChange={(e) => setSelectedVet(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Veterinarians</option>
                {veterinarians.map(vet => (
                  <option key={vet.id} value={vet.id}>{vet.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Feedback stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Total Feedback</h4>
              <p className="text-2xl font-bold text-blue-600">{filteredFeedback.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Average Rating</h4>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-green-600 mr-2">
                  {calculateAverageRating(filteredFeedback)}
                </p>
                <div className="flex">
                  {renderStars(Math.round(calculateAverageRating(filteredFeedback)))}
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-600">Recent Feedback</h4>
              <p className="text-2xl font-bold text-purple-600">
                {filteredFeedback.filter(f => {
                  const date = new Date(f.createdAt || f.appointmentDate);
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return date > oneWeekAgo;
                }).length}
              </p>
            </div>
          </div>

          {/* Feedback list */}
          {filteredFeedback.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredFeedback.map(item => {
                // Find the veterinarian name
                const vet = veterinarians.find(v => v.id === item.vetId);
                const vetName = item.vetName || (vet ? vet.name : 'Unknown Veterinarian');

                return (
                  <div key={item.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.userName || 'Anonymous'}</h4>
                        <div className="flex items-center mt-1">
                          <div className="flex mr-2">
                            {renderStars(item.rating || 0)}
                          </div>
                          <span className="text-sm text-gray-500">
                            Appointment: {formatDate(item.appointmentDate)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Veterinarian: <span className="font-medium">{vetName}</span>
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {item.feedback || 'No comment provided'}
                      </p>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>Time: {item.appointmentTime || 'N/A'}</span>
                      <span>Submitted: {formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Available</h3>
              <p className="text-gray-600">
                {selectedVet === 'all'
                  ? 'No feedback has been submitted yet'
                  : 'No feedback available for this veterinarian'}
              </p>
            </div>
          )}
        </div>
      );
    };


    // Medicines (both pending and approved)
    const medicinesRef = ref(database, 'medicines');
    const medicinesListener = onValue(medicinesRef, (snapshot) => {
      if (snapshot.exists()) {
        const medicinesData = snapshot.val();
        const pendingMedicines = [];
        const approvedMedicines = [];

        Object.keys(medicinesData).forEach(key => {
          const medicine = {
            id: key,
            ...medicinesData[key]
          };

          if (medicine.approvalStatus === 'pending') {
            pendingMedicines.push(medicine);
          } else if (medicine.approvalStatus === 'approved') {
            approvedMedicines.push(medicine);
          }
        });

        setMedicines(pendingMedicines);
        setInventory(approvedMedicines);
      } else {
        setMedicines([]);
        setInventory([]);
      }
    });

    // Orders
    const ordersRef = ref(database, 'orders');
    const ordersListener = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersArray = Object.keys(ordersData).map(key => ({
          id: key,
          ...ordersData[key],
          totalAmount: calculateOrderAmount(ordersData[key])
        }));
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
    });

    // Appointments
    const appointmentsRef = ref(database, 'appointments');
    const appointmentsListener = onValue(appointmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const appointmentsData = snapshot.val();
        const appointmentsArray = Object.keys(appointmentsData).map(key => ({
          id: key,
          ...appointmentsData[key]
        }));
        setAppointments(appointmentsArray);
      } else {
        setAppointments([]);
      }
    });

    setIsLoading(false);

    // Cleanup listeners on unmount
    return () => {
      usersListener();
      vetsListener();
      suppliersListener();
      medicinesListener();
      ordersListener();
      appointmentsListener();
      feedbackListener();
    };
  }, []);

  // Helper function to calculate order amount (since it might not be in the data)
  const calculateOrderAmount = (order) => {
    // If totalAmount exists, use it
    if (order.totalAmount) return order.totalAmount;

    // Otherwise, use a default price
    return order.totalItems ? order.totalItems * 150 : 150;
  };

  // Calculate statistics from real data
  const stats = {
    totalUsers: users.length,
    totalVets: veterinarians.filter(v => v.status === 'active').length,
    totalSuppliers: suppliers.filter(s => s.status === 'active').length,
    totalAppointments: appointments.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    processingOrders: orders.filter(o => o.status === 'processing').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
    pendingApprovals: medicines.length,
    lowStockItems: inventory.filter(i => (i.currentStock || 0) <= (i.minStock || 0)).length,
    outOfStock: inventory.filter(i => (i.currentStock || 0) === 0).length
  };

  // Analytics data for the donut charts based on real data
  const orderStatusData = [
    { label: 'Pending', value: stats.pendingOrders, color: '#FCD34D' },
    { label: 'Processing', value: stats.processingOrders, color: '#60A5FA' },
    { label: 'Completed', value: stats.completedOrders, color: '#34D399' },
  ];

  const inventoryStatusData = [
    { label: 'In Stock', value: inventory.length - stats.lowStockItems - stats.outOfStock, color: '#34D399' },
    { label: 'Low Stock', value: stats.lowStockItems - stats.outOfStock, color: '#FCD34D' },
    { label: 'Out of Stock', value: stats.outOfStock, color: '#F87171' },
  ];

  // Count medicines by category for the chart
  const medicinesByCategory = inventory.reduce((acc, med) => {
    acc[med.category] = (acc[med.category] || 0) + 1;
    return acc;
  }, {});

  const medicinesByCategoryData = Object.keys(medicinesByCategory).map((category, index) => {
    const colors = ['#818CF8', '#F472B6', '#A78BFA', '#60A5FA', '#34D399'];
    return {
      label: category,
      value: medicinesByCategory[category],
      color: colors[index % colors.length]
    };
  });

  // Navigation menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'veterinarians', label: 'Veterinarians', icon: UserCheck },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'medicine-approval', label: 'Medicine Approval', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: AlertTriangle },
    { id: 'orders', label: 'Orders', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
  ];

  // Handler functions for saving vets and suppliers
  // const handleSaveVeterinarian = (veterinarianData) => {
  //   setVeterinarians(prev => [...prev, veterinarianData]);
  //   setSuccess('Veterinarian added successfully!');
  // };


  const handleSaveVeterinarian = (veterinarianData) => {
    // Check if this veterinarian already exists in state
    const existingVet = veterinarians.find(vet => vet.email === veterinarianData.email);
    if (existingVet) {
      console.log("Veterinarian already exists, not adding duplicate:", veterinarianData);
      setSuccess('Veterinarian updated successfully!');
      return;
    }

    // Don't update the state directly - Firebase listener will handle this
    // Just save to Firebase database
    const newVetRef = push(ref(database, 'veterinary'));
    set(newVetRef, veterinarianData)
      .then(() => {
        setSuccess('Veterinarian added successfully!');
      })
      .catch(error => {
        console.error("Error adding veterinarian:", error);
        setError('Failed to add veterinarian. Please try again.');
      });
  };

  const handleSaveSupplier = (supplierData) => {
    console.log("Saving supplier data:", supplierData);

    // Check if a supplier with this email or ID already exists in state
    const existingSupplier = suppliers.find(
      s => s.id === supplierData.id || s.email === supplierData.email
    );

    if (existingSupplier) {
      console.log("Supplier already exists in state, not adding duplicate:", supplierData);
      setSuccess('Supplier updated successfully!');
      return;
    }

    // Don't update the state directly - Firebase listener will handle this
    // Just save to Firebase database
    const newSupplierRef = push(ref(database, 'supplier'));
    set(newSupplierRef, supplierData)
      .then(() => {
        setSuccess('Supplier added successfully!');
      })
      .catch(error => {
        console.error("Error adding supplier:", error);
        setError('Failed to add supplier. Please try again.');
      });
  };

  // Edit handlers
  const handleEditVeterinarian = (vet) => {
    setSelectedVeterinarian(vet);
    setShowVetEditModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierEditModal(true);
  };

  const handleEditInventoryItem = (item) => {
    setSelectedInventoryItem(item);
    setShowInventoryEditModal(true);
  };

  // Update handlers
  const handleUpdateVeterinarian = (updatedVet) => {
    setVeterinarians(prev =>
      prev.map(vet => vet.id === updatedVet.id ? updatedVet : vet)
    );
    setSuccess('Veterinarian updated successfully!');
  };

  const handleUpdateSupplier = (updatedSupplier) => {
    setSuppliers(prev =>
      prev.map(supplier => supplier.id === updatedSupplier.id ? updatedSupplier : supplier)
    );
    setSuccess('Supplier updated successfully!');
  };

  const handleUpdateInventoryItem = (updatedItem) => {
    setInventory(prev =>
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    setSuccess('Inventory item updated successfully!');
  };

  // Delete handlers
  const handleDeleteClick = (type, id, name) => {
    setDeleteType(type);
    setDeleteItemId(id);
    setDeleteItemName(name);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const path = deleteType === 'veterinarian' ? 'veterinary' :
        deleteType === 'supplier' ? 'supplier' :
          'medicines';

      const itemRef = ref(database, `${path}/${deleteItemId}`);
      await remove(itemRef);

      // Update local state based on type
      if (deleteType === 'veterinarian') {
        setVeterinarians(prev => prev.filter(vet => vet.id !== deleteItemId));
      } else if (deleteType === 'supplier') {
        setSuppliers(prev => prev.filter(supplier => supplier.id !== deleteItemId));
      } else if (deleteType === 'inventory') {
        setInventory(prev => prev.filter(item => item.id !== deleteItemId));
      }

      setSuccess(`${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully!`);
    } catch (error) {
      setError(`Failed to delete ${deleteType}. Please try again.`);
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Function to update medicine approval status
  const updateMedicineStatus = (id, status) => {
    setIsLoading(true);

    const medicineRef = ref(database, `medicines/${id}`);

    get(medicineRef).then((snapshot) => {
      if (snapshot.exists()) {
        const medicine = snapshot.val();

        if (status === 'approved') {
          // Update the medicine in Firebase
          update(medicineRef, {
            approvalStatus: 'approved',
            currentStock: 100, // Default stock
            minStock: 20,      // Default threshold
            status: 'in-stock'
          }).then(() => {
            // Update local state
            setMedicines(prev => prev.filter(med => med.id !== id));
            setInventory(prev => [...prev, {
              ...medicine,
              id,
              approvalStatus: 'approved',
              currentStock: 100,
              minStock: 20,
              status: 'in-stock'
            }]);
            setSuccess('Medicine approved and added to inventory!');
          }).catch(err => {
            setError('Failed to update medicine status. Please try again.');
            console.error(err);
          });
        } else if (status === 'rejected') {
          // Remove from Firebase
          remove(medicineRef).then(() => {
            // Update local state
            setMedicines(prev => prev.filter(med => med.id !== id));
            setSuccess('Medicine rejected!');
          }).catch(err => {
            setError('Failed to reject medicine. Please try again.');
            console.error(err);
          });
        }
      } else {
        setError('Medicine not found!');
      }
    }).catch(err => {
      setError('Failed to fetch medicine data. Please try again.');
      console.error(err);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  // Function to update order status
  const updateOrderStatus = (id, status) => {
    setProcessingOrder(id);

    const orderRef = ref(database, `orders/${id}`);

    update(orderRef, { status }).then(() => {
      // Update local state
      setOrders(prev => prev.map(order =>
        order.id === id ? { ...order, status } : order
      ));
      setSuccess(`Order status updated to ${status}!`);
    }).catch(err => {
      setError('Failed to update order status. Please try again.');
      console.error(err);
    }).finally(() => {
      setProcessingOrder(null);
    });
  };

  // Logout function
 const handleLogout = async () => {
   try {
     console.log("EMERGENCY LOGOUT: Starting forced logout process");
     
     // 1. Set a permanent flag in localStorage (not sessionStorage which gets cleared)
     localStorage.setItem('FORCE_LOGOUT', 'true');
     
     // 2. Mark the session as inactive directly in Firebase
     const sessionId = localStorage.getItem('sessionId');
     if (sessionId) {
       try {
         const db = database();
         const sessionRef = ref(db, `sessions/${sessionId}`);
         await set(sessionRef, { active: false, forceLoggedOut: true });
         console.log("EMERGENCY LOGOUT: Marked session inactive in Firebase");
       } catch (dbError) {
         console.error("EMERGENCY LOGOUT: Error updating Firebase, continuing logout", dbError);
       }
     }
     
     // 3. Aggressively clear ALL storage
     console.log("EMERGENCY LOGOUT: Clearing all storage");
     localStorage.clear();
     sessionStorage.clear();
     
     // 4. Set the logout flag again (since we just cleared it)
     localStorage.setItem('FORCE_LOGOUT', 'true');
     
     // 5. Call the auth context logout for good measure, but don't wait for it
     try {
       LogOut();
     } catch (logoutError) {
       console.error("EMERGENCY LOGOUT: Error in context logout, continuing", logoutError);
     }
     
     // 6. Display a visual indicator that logout is in progress
     document.body.innerHTML = `
       <div style="text-align: center; margin-top: 100px; font-family: Arial, sans-serif;">
         <h1 style="color: #2563EB;">Logging out...</h1>
         <p>Please wait, you are being securely logged out.</p>
         <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #2563EB; border-radius: 50%; margin: 20px auto; animation: spin 1s linear infinite;"></div>
         <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
       </div>
     `;
     
     // 7. Use a short timeout to ensure display updates before redirect
     setTimeout(() => {
       console.log("EMERGENCY LOGOUT: Forcing navigation to home page");
       // 8. CRITICAL: Use window.location.replace with a timestamp to bust cache
       window.location.replace('/?logout=' + Date.now());
     }, 800);
     
   } catch (error) {
     console.error('EMERGENCY LOGOUT: Critical error during logout:', error);
     alert('Logout failed. Please close your browser to complete logout.');
     // Last resort - still try to redirect
     window.location.replace('/?error=true');
   }
 };

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Veterinarians</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVets}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            {/* <DollarSign className="w-8 h-8 text-yellow-600" /> */}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowVetModal(true)}
            className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserCheck className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Veterinarian</span>
          </button>

          <button
            onClick={() => setShowSupplierModal(true)}
            className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Building2 className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Add Supplier</span>
          </button>

          <button
            onClick={() => setActiveTab('medicine-approval')}
            className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Package className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Approve Medicines</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className="p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Check Inventory</span>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-white-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Orders
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center">
                    <ShoppingBag className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="font-medium">Order #{order.id.substring(0, 7)}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.userName} • {order.totalItems} items •
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                    {order.status}
                  </span>

                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'processing')}
                      disabled={processingOrder === order.id}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {processingOrder === order.id ? 'Processing...' : 'Process'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No orders have been placed yet</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {medicines.slice(0, 2).map(medicine => (
            <div key={medicine.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
              <span className="text-sm">New medicine pending approval: {medicine.name}</span>
            </div>
          ))}
          {veterinarians.slice(-2).map(vet => (
            <div key={vet.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <span className="text-sm">New veterinarian registered: {vet.name}</span>
            </div>
          ))}
          {suppliers.slice(-2).map(supplier => (
            <div key={supplier.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span className="text-sm">New supplier registered: {supplier.companyName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const AnalyticsPage = () => {
    // Simple PDF function without using autoTable
    const downloadPDFReport = () => {
      try {
        // Import only the core jsPDF functionality
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPosition = 20;

        // Add title
        doc.setFontSize(18);
        doc.text("Veterinary Analytics Report", pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 20;

        // Key Metrics Section
        doc.setFontSize(14);
        doc.text("Key Metrics", margin, yPosition);
        yPosition += 10;

        // Horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        // Revenue
        doc.text("Total Revenue:", margin, yPosition);
        doc.text(`₹${stats.totalRevenue.toLocaleString()}`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 8;

        // Orders
        doc.text("Total Orders:", margin, yPosition);
        doc.text(`${stats.totalOrders}`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 8;

        // Products
        doc.text("Total Products:", margin, yPosition);
        doc.text(`${inventory.length}`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 8;

        // Low Stock
        doc.text("Low Stock Items:", margin, yPosition);
        doc.text(`${stats.lowStockItems}`, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += 20;

        // Order Status Section
        doc.setFontSize(14);
        doc.text("Order Status", margin, yPosition);
        yPosition += 10;

        // Horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        orderStatusData.forEach(item => {
          // Set color for status indicator
          doc.setFillColor(item.color);
          doc.circle(margin + 3, yPosition - 3, 3, 'F');

          doc.text(item.label + ":", margin + 10, yPosition);
          doc.text(`${item.value}`, pageWidth - margin, yPosition, { align: 'right' });
          yPosition += 8;
        });
        yPosition += 12;

        // Inventory Status Section
        doc.setFontSize(14);
        doc.text("Inventory Status", margin, yPosition);
        yPosition += 10;

        // Horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        inventoryStatusData.forEach(item => {
          // Set color for status indicator
          doc.setFillColor(item.color);
          doc.circle(margin + 3, yPosition - 3, 3, 'F');

          doc.text(item.label + ":", margin + 10, yPosition);
          doc.text(`${item.value}`, pageWidth - margin, yPosition, { align: 'right' });
          yPosition += 8;
        });
        yPosition += 12;

        // Check if we need a new page for medicines data
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }

        // Medicines by Category Section
        if (medicinesByCategoryData.length > 0) {
          doc.setFontSize(14);
          doc.text("Medicines by Category", margin, yPosition);
          yPosition += 10;

          // Horizontal line
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 10;

          doc.setFontSize(10);
          medicinesByCategoryData.forEach(item => {
            // Set color for category indicator
            doc.setFillColor(item.color);
            doc.circle(margin + 3, yPosition - 3, 3, 'F');

            doc.text(item.label + ":", margin + 10, yPosition);
            doc.text(`${item.value}`, pageWidth - margin, yPosition, { align: 'right' });
            yPosition += 8;
          });
          yPosition += 12;
        }

        // Top Selling Medicines Section
        doc.setFontSize(14);
        doc.text("Top Selling Medicines", margin, yPosition);
        yPosition += 10;

        // Horizontal line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        inventory.slice(0, 3).forEach((medicine, index) => {
          const salesCount = 42 - (index * 10); // Mock sales count

          doc.text(medicine.name + ":", margin, yPosition);
          doc.text(`${salesCount} units`, pageWidth - margin, yPosition, { align: 'right' });
          yPosition += 8;
        });

        // Add footer
        const footerText = "© Veterinary Management System";
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

        // Save the PDF
        doc.save("veterinary_analytics_report.pdf");
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("There was an error generating the PDF report. Please try again.");
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
          <button
            onClick={downloadPDFReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Download Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>

            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Status Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Order Status</h3>
            <DonutChart data={orderStatusData} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs">{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Status Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Inventory Status</h3>
            <DonutChart data={inventoryStatusData} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {inventoryStatusData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs">{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medicines by Category Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Medicines by Category</h3>
            <DonutChart data={medicinesByCategoryData.length > 0 ? medicinesByCategoryData : [{ label: 'No Data', value: 1, color: '#E5E7EB' }]} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {medicinesByCategoryData.length > 0 ? medicinesByCategoryData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs">{item.label}: {item.value}</span>
                </div>
              )) : (
                <div className="flex items-center col-span-3 justify-center">
                  <span className="text-xs text-gray-500">No categories data available</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Top Selling Medicines</h4>
              <div className="space-y-2">
                {inventory.slice(0, 3).map((medicine, index) => {
                  const salesCount = 42 - (index * 10); // Mock sales count
                  const percentage = Math.round((salesCount / 50) * 100);

                  return (
                    <div key={medicine.id}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{medicine.name}</span>
                        <span className="text-sm font-medium">{salesCount} units</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}

                {inventory.length === 0 && (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500">No medicine data available</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Revenue by Category</h4>
              <div className="space-y-2">
                {Object.entries(medicinesByCategory).slice(0, 3).map(([category, count], index) => {
                  const revenue = 12500 - (index * 3500);
                  const percentage = Math.round((revenue / 15000) * 100);

                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm font-medium">₹{revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}

                {Object.keys(medicinesByCategory).length === 0 && (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500">No revenue data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

const assignSupplierToOrder = async (orderId, supplierId) => {
    try {
      setIsLoading(true);
      const supplierRef = ref(database, `supplier/${supplierId}`);
      const supplierSnapshot = await get(supplierRef);
      
      if (!supplierSnapshot.exists()) {
        throw new Error('Supplier not found');
      }
      
      const supplierData = supplierSnapshot.val();
      const orderRef = ref(database, `orders/${orderId}`);
      await update(orderRef, {
        supplierId: supplierId,
        supplierName: supplierData.companyName,
        assignedAt: new Date().toISOString(),
        assignmentStatus: 'assigned'
      });
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              supplierId, 
              supplierName: supplierData.companyName, 
              assignedAt: new Date().toISOString(),
              assignmentStatus: 'assigned'
            } 
          : order
      ));
      
      setSuccess(`Order assigned to ${supplierData.companyName} successfully!`);
      setShowAssignSupplierModal(false);
      setAssigningOrderId(null);
      setSelectedSupplierId('');
    } catch (error) {
      console.error('Error assigning supplier:', error);
      setError(`Failed to assign supplier: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };



const AssignSupplierModal = ({ orderId, onClose, onAssign }) => {

  
  const handleSubmit = async () => {
    if (!localSelectedSupplierId) {
      return;
    }
    
    setIsSubmitting(true);
    await onAssign(orderId, localSelectedSupplierId);
    setIsSubmitting(false);
  };
  
  // Find active suppliers only
  const activeSuppliers = suppliers.filter(s => s.status === 'active');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Assign Supplier to Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Supplier
          </label>
          <select
            value={localSelectedSupplierId}
            onChange={(e) => setLocalSelectedSupplierId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Select a Supplier --</option>
            {activeSuppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.companyName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            disabled={!localSelectedSupplierId || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Supplier'
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};



  // Medicine Approval Component
  const MedicineApprovalPage = () => (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <h2 className="text-2xl font-semibold">Medicine Approval</h2>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Processing medicine approval...</p>
        </div>
      ) : medicines.length > 0 ? (
        <div className="space-y-4">
          {medicines.map(medicine => (
            <div key={medicine.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{medicine.name}</h3>
                  <p className="text-gray-600">Category: {medicine.category}</p>
                  <p className="text-gray-600">Supplier: {medicine.supplier || 'Not specified'}</p>
                  <p className="text-green-600 font-semibold">Price: ₹{medicine.price}</p>
                  {medicine.description && (
                    <p className="text-gray-600 mt-2">{medicine.description}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  {medicine.approvalStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => updateMedicineStatus(medicine.id, 'approved')}
                        disabled={isLoading}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => updateMedicineStatus(medicine.id, 'rejected')}
                        disabled={isLoading}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </button>
                    </>
                  )}
                  {medicine.approvalStatus !== 'pending' && (
                    <span className={`px-3 py-2 text-sm rounded ${medicine.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {medicine.approvalStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medicines to Approve</h3>
          <p className="text-gray-600">Medicines submitted by suppliers will appear here for approval</p>
        </div>
      )}
    </div>
  );

  // Inventory Management Component
  const InventoryPage = () => (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Inventory Management</h2>
        <button onClick={() => setActiveTab('medicine-approval')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />Medicine Approvals ({medicines.length})
        </button>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-purple-600">{medicines.length}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      ) : inventory.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Inventory Items</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.currentStock || 0} / {item.maxStock || 100}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${(item.currentStock || 0) === 0 ? 'bg-red-100 text-red-800' :
                      (item.currentStock || 0) <= (item.minStock || 0) ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                      {(item.currentStock || 0) === 0 ? 'Out of Stock' :
                        (item.currentStock || 0) <= (item.minStock || 0) ? 'Low Stock' :
                          'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditInventoryItem(item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick('inventory', item.id, item.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items in Inventory</h3>
          <p className="text-gray-600 mb-6">Approved medicines will appear here</p>
          <button
            onClick={() => setActiveTab('medicine-approval')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Medicine Approvals
          </button>
        </div>
      )}
    </div>
  );

  // Orders Management Component
  // const OrdersPage = () => (
  //   <div className="space-y-6">
  //     {success && (
  //       <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
  //         <span>{success}</span>
  //         <button onClick={() => setSuccess(null)} className="text-green-700">
  //           <X className="w-4 h-4" />
  //         </button>
  //       </div>
  //     )}

  //     {error && (
  //       <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
  //         <span>{error}</span>
  //         <button onClick={() => setError(null)} className="text-red-700">
  //           <X className="w-4 h-4" />
  //         </button>
  //       </div>
  //     )}

  //     <h2 className="text-2xl font-semibold">Order Management</h2>

  //     {/* Order Stats */}
  //     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  //       <div className="bg-white p-6 rounded-xl shadow-sm border">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm font-medium text-gray-600">Total Orders</p>
  //             <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
  //           </div>
  //           <ShoppingBag className="w-8 h-8 text-blue-600" />
  //         </div>
  //       </div>
  //       <div className="bg-white p-6 rounded-xl shadow-sm border">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm font-medium text-gray-600">Pending</p>
  //             <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
  //           </div>
  //           <Clock className="w-8 h-8 text-yellow-600" />
  //         </div>
  //       </div>
  //       <div className="bg-white p-6 rounded-xl shadow-sm border">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm font-medium text-gray-600">Processing</p>
  //             <p className="text-2xl font-bold text-blue-600">{stats.processingOrders}</p>
  //           </div>
  //           <Truck className="w-8 h-8 text-blue-600" />
  //         </div>
  //       </div>
  //       <div className="bg-white p-6 rounded-xl shadow-sm border">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm font-medium text-gray-600">Revenue</p>
  //             <p className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
  //           </div>
  //           {/* <DollarSign className="w-8 h-8 text-purple-600" /> */}
  //         </div>
  //       </div>
  //     </div>

  //     {isLoading ? (
  //       <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
  //         <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading orders...</p>
  //       </div>
  //     ) : orders.length > 0 ? (
  //       <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
  //         <div className="px-6 py-4 border-b flex justify-between items-center">
  //           <h3 className="font-semibold">Order List</h3>
  //           <div className="relative w-64">
  //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  //             <input
  //               type="text"
  //               placeholder="Search orders..."
  //               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //             />
  //           </div>
  //         </div>

  //         <div className="divide-y divide-gray-200">
  //           {orders.map(order => (
  //             <div key={order.id} className="p-6">
  //               <div className="flex flex-col md:flex-row md:justify-between md:items-center">
  //                 <div className="mb-4 md:mb-0">
  //                   <div className="flex items-center">
  //                     <ShoppingBag className="w-5 h-5 text-purple-600 mr-2" />
  //                     <h4 className="font-medium text-lg">
  //                       Order #{order.id.substring(0, 7)}
  //                     </h4>
  //                     <span className={`ml-3 px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
  //                       order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
  //                         order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
  //                           order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
  //                             'bg-gray-100 text-gray-800'
  //                       }`}>
  //                       {order.status}
  //                     </span>
  //                   </div>
  //                   <div className="flex items-center mt-1 text-gray-600 text-sm">
  //                     <span className="mr-3">
  //                       {order.userName}
  //                     </span>
  //                     <span className="mr-3">•</span>
  //                     <span>
  //                       {new Date(order.createdAt).toLocaleString()}
  //                     </span>
  //                   </div>
  //                 </div>

  //                 <div className="flex items-center space-x-2">
  //                   {order.status === 'pending' && (
  //                     <>
  //                       <button
  //                         onClick={() => updateOrderStatus(order.id, 'processing')}
  //                         disabled={processingOrder === order.id}
  //                         className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
  //                       >
  //                         {processingOrder === order.id ? 'Processing...' : 'Process Order'}
  //                       </button>
  //                       <button
  //                         onClick={() => updateOrderStatus(order.id, 'cancelled')}
  //                         disabled={processingOrder === order.id}
  //                         className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
  //                       >
  //                         Cancel
  //                       </button>
  //                     </>
  //                   )}

  //                   {order.status === 'processing' && (
  //                     <button
  //                       onClick={() => updateOrderStatus(order.id, 'shipped')}
  //                       disabled={processingOrder === order.id}
  //                       className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
  //                     >
  //                       Mark as Shipped
  //                     </button>
  //                   )}

  //                   {order.status === 'shipped' && (
  //                     <button
  //                       onClick={() => updateOrderStatus(order.id, 'delivered')}
  //                       disabled={processingOrder === order.id}
  //                       className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
  //                     >
  //                       Mark as Delivered
  //                     </button>
  //                   )}

  //                   {/* <button className="p-1 text-blue-600 hover:text-blue-800 border border-blue-200 rounded">
  //                     <Eye className="w-4 h-4" />
  //                   </button> */}
  //                 </div>
  //               </div>

  //               {/* Order Items */}
  //               <div className="mt-4 bg-gray-50 p-4 rounded-lg">
  //                 {order.items && order.items.length > 0 ? (
  //                   <div>
  //                     <h5 className="text-sm font-medium text-gray-700 mb-2">Order Items:</h5>
  //                     <div className="space-y-2">
  //                       {order.items.map((item, index) => (
  //                         <div key={index} className="flex justify-between text-sm">
  //                           <div>
  //                             <span className="font-medium">{item.medicineName}</span>
  //                             <span className="text-gray-600 ml-2">({item.dosage})</span>
  //                           </div>
  //                           <span className="text-gray-700">Prescribed by: Dr. {item.doctor}</span>
  //                         </div>
  //                       ))}
  //                     </div>
  //                   </div>
  //                 ) : (
  //                   <p className="text-sm text-gray-500 italic">No detailed item information available</p>
  //                 )}

  //                 <div className="flex justify-between mt-4 pt-2 border-t border-gray-200">
  //                   <span className="text-sm text-gray-600">
  //                     Total Items: {order.totalItems || order.items?.length || 'N/A'}
  //                   </span>
  //                   <span className="font-medium">
  //                     Total Amount: ₹{order.totalAmount || 'N/A'}
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
  //         <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
  //         <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
  //         <p className="text-gray-600">Orders will appear here when users make purchases</p>
  //       </div>
  //     )}
  //   </div>
  // );

  const OrdersPage = () => (
  <div className="space-y-6">
    {success && (
      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
        <span>{success}</span>
        <button onClick={() => setSuccess(null)} className="text-green-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    )}

    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
        <span>{error}</span>
        <button onClick={() => setError(null)} className="text-red-700">
          <X className="w-4 h-4" />
        </button>
      </div>
    )}

    <h2 className="text-2xl font-semibold">Order Management</h2>

    {/* Order Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <ShoppingBag className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Processing</p>
            <p className="text-2xl font-bold text-blue-600">{stats.processingOrders}</p>
          </div>
          <Truck className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>

    {isLoading ? (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading orders...</p>
      </div>
    ) : orders.length > 0 ? (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Order List</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {orders.map(order => (
            <div key={order.id} className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <ShoppingBag className="w-5 h-5 text-purple-600 mr-2" />
                    <h4 className="font-medium text-lg">
                      Order #{order.id.substring(0, 7)}
                    </h4>
                    <span className={`ml-3 px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600 text-sm">
                    <span className="mr-3">
                      {order.userName}
                    </span>
                    <span className="mr-3">•</span>
                    <span>
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Supplier Assignment Badge */}
                  {order.supplierName ? (
                    <div className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg mr-2 flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {order.supplierName}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setAssigningOrderId(order.id);
                        setShowAssignSupplierModal(true);
                      }}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                    >
                      Assign Supplier
                    </button>
                  )}

                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'processing')}
                        disabled={processingOrder === order.id}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {processingOrder === order.id ? 'Processing...' : 'Process Order'}
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        disabled={processingOrder === order.id}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {order.status === 'processing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      disabled={processingOrder === order.id}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      Mark as Shipped
                    </button>
                  )}

                  {order.status === 'shipped' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      disabled={processingOrder === order.id}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                {order.items && order.items.length > 0 ? (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Order Items:</h5>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">{item.medicineName}</span>
                            <span className="text-gray-600 ml-2">({item.dosage})</span>
                          </div>
                          <span className="text-gray-700">Prescribed by: Dr. {item.doctor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No detailed item information available</p>
                )}

                <div className="flex justify-between mt-4 pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    Total Items: {order.totalItems || order.items?.length || 'N/A'}
                  </span>
                  <span className="font-medium">
                    Total Amount: ₹{order.totalAmount || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600">Orders will appear here when users make purchases</p>
      </div>
    )}

    {/* Supplier Assignment Modal */}
    {showAssignSupplierModal && (
      <AssignSupplierModal
        orderId={assigningOrderId}
        onClose={() => {
          setShowAssignSupplierModal(false);
          setAssigningOrderId(null);
        }}
       onAssign={assignSupplierToOrder}
      />
    )}
  </div>
);


  const VeterinariansPage = () => {
    // State for active tab within the veterinarian page
    const [activeVetTab, setActiveVetTab] = useState('list');

    // Add this log to check data when component renders
    useEffect(() => {
      console.log("VeterinariansPage rendered. Feedback data:", feedback);
      console.log("Veterinarians data:", veterinarians);
    }, [feedback, veterinarians]);

    return (
      <div className="space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="text-green-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Veterinarian Management</h2>
          <button
            onClick={() => setShowVetModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Veterinarian
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveVetTab('list')}
            className={`px-4 py-2 font-medium text-sm gap-4${activeVetTab === 'list'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Veterinarian List
          </button>
          <button
            onClick={() => setActiveVetTab('feedback')}
            className={`px-4 py-2 font-medium text-sm gap-4 ${activeVetTab === 'feedback'
              ? 'text-white-600 border-b-2 border-blue-600'
              : 'text-white-500 hover:text-gray-700'
              }`}
          >
            Feedback
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : activeVetTab === 'list' ? (
          /* Veterinarian List Tab */
          veterinarians.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {veterinarians.map(vet => (
                    <tr key={vet.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vet.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vet.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vet.specialization}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vet.experience} years</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${vet.status === 'active' ? 'bg-green-100 text-green-800' :
                          vet.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {vet.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditVeterinarian(vet)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4 inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick('veterinarian', vet.id, vet.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 inline mr-1" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Veterinarians Yet</h3>
              <p className="text-gray-600 mb-6">Start by adding veterinarians to your platform</p>
              <button
                onClick={() => setShowVetModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add First Veterinarian
              </button>
            </div>
          )
        ) : (
          /* Feedback Tab - Use the Fixed Feedback Component */
          <FixedVeterinarianFeedback
            feedback={feedback}
            veterinarians={veterinarians}
          />
        )}
      </div>
    );
  };

  // Fixed VeterinarianFeedback component to prevent infinite loops
  const FixedVeterinarianFeedback = ({ feedback = [], veterinarians = [] }) => {
    const [selectedVet, setSelectedVet] = useState('all');
    const [filteredFeedback, setFilteredFeedback] = useState([]);

    // This effect filters feedback based on selected vet
    // Fixed to prevent infinite loop by only running when dependencies change
    useEffect(() => {
      console.log("Filtering feedback. Selected vet:", selectedVet);
      console.log("Current feedback data:", feedback);

      // Ensure feedback is an array
      const feedbackArray = Array.isArray(feedback) ? feedback : [];

      if (selectedVet === 'all') {
        setFilteredFeedback(feedbackArray);
      } else {
        setFilteredFeedback(feedbackArray.filter(item => item.vetId === selectedVet));
      }
    }, [selectedVet, feedback]); // Only re-run when these dependencies change

    // Function to calculate average rating
    const calculateAverageRating = (feedbackList) => {
      if (!feedbackList || feedbackList.length === 0) return 0;
      const sum = feedbackList.reduce((total, item) => {
        const rating = Number(item.rating) || 0;
        return total + rating;
      }, 0);
      return (sum / feedbackList.length).toFixed(1);
    };

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        return new Date(dateString).toLocaleDateString();
      } catch (e) {
        return dateString;
      }
    };

    // Generate star rating display
    const renderStars = (rating) => {
      try {
        const numRating = Number(rating) || 0;
        const stars = [];
        for (let i = 1; i <= 5; i++) {
          stars.push(
            <Star
              key={i}
              className={`w-4 h-4 ${i <= numRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          );
        }
        return stars;
      } catch (err) {
        console.error("Error rendering stars:", err);
        return <span>⭐{rating}</span>;
      }
    };

    // Count recent feedback (within past week)
    const countRecentFeedback = () => {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return filteredFeedback.filter(f => {
          try {
            const date = new Date(f.createdAt || f.appointmentDate);
            return date > oneWeekAgo;
          } catch (err) {
            return false;
          }
        }).length;
      } catch (err) {
        console.error("Error counting recent feedback:", err);
        return 0;
      }
    };


    return (
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Debug panel - uncomment to see data info */}
        {/* <DebugPanel /> */}

        <div className="px-6 py-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h3 className="font-semibold">Veterinarian Feedback</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Filter by veterinarian:</span>
            <select
              value={selectedVet}
              onChange={(e) => setSelectedVet(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Veterinarians</option>
              {(veterinarians || []).map(vet => (
                <option key={vet.id} value={vet.id}>{vet.name || 'Unnamed Veterinarian'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Feedback stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600">Total Feedback</h4>
            <p className="text-2xl font-bold text-blue-600">{filteredFeedback.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600">Average Rating</h4>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-green-600 mr-2">
                {calculateAverageRating(filteredFeedback)}
              </p>
              <div className="flex">
                {renderStars(Math.round(calculateAverageRating(filteredFeedback)))}
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600">Recent Feedback</h4>
            <p className="text-2xl font-bold text-purple-600">
              {countRecentFeedback()}
            </p>
          </div>
        </div>

        {/* Feedback list */}
        {filteredFeedback.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredFeedback.map(item => {
              // Find the veterinarian name
              let vetName = item.vetName || 'Unknown Veterinarian';
              if (!vetName && item.vetId) {
                const vet = (veterinarians || []).find(v => v.id === item.vetId);
                if (vet && vet.name) vetName = vet.name;
              }

              return (
                <div key={item.id || `feedback-${Math.random()}`} className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                      <h4 className="font-medium">{item.userName || 'Anonymous'}</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {renderStars(item.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-500">
                          Appointment: {formatDate(item.appointmentDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Veterinarian: <span className="font-medium">{vetName}</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {item.feedback || 'No comment provided'}
                    </p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex flex-col md:flex-row md:justify-between gap-2">
                    <span>Time: {item.appointmentTime || 'N/A'}</span>
                    <span>Submitted: {formatDate(item.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Feedback Available</h3>
            <p className="text-gray-600">
              {selectedVet === 'all'
                ? 'No feedback has been submitted yet'
                : 'No feedback available for this veterinarian'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // SuppliersPage Component
  const SuppliersPage = () => (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Supplier Management</h2>
        <button
          onClick={() => setShowSupplierModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suppliers...</p>
        </div>
      ) : suppliers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{supplier.companyName}</h3>
                  <p className="text-gray-600">Contact: {supplier.contactPerson}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${supplier.status === 'active' ? 'bg-green-100 text-green-800' :
                  supplier.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {supplier.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {supplier.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {supplier.phone}
                </div>
                {supplier.businessLicense && (
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    License: {supplier.businessLicense}
                  </div>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEditSupplier(supplier)}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick('supplier', supplier.id, supplier.companyName)}
                  className="flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Suppliers Yet</h3>
          <p className="text-gray-600 mb-6">Start by adding suppliers to your platform</p>
          <button
            onClick={() => setShowSupplierModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add First Supplier
          </button>
        </div>
      )}
    </div>
  );

  // UsersPage Component
  const UsersPage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">User Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-900">Total Users</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-900">Active Users</h3>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold text-gray-900">New Users (This Week)</h3>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      {user.status || 'Active'}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Registered</h3>
          <p className="text-gray-600">Users will appear here when they register on the platform</p>
        </div>
      )}
    </div>
  );

  // Render active page based on navigation
  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview />;
      case 'analytics': return <AnalyticsPage />;
      case 'medicine-approval': return <MedicineApprovalPage />;
      case 'inventory': return <InventoryPage />;
      case 'orders': return <OrdersPage />;
      case 'veterinarians': return <VeterinariansPage />;
      case 'suppliers': return <SuppliersPage />;
      case 'users': return <UsersPage />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600">Veterinary Services</p>
        </div>

        <nav className="mt-6 gap-2 flex flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${activeTab === item.id ? 'bg-lightblue-10 text-white-600 border-r-2 border-blue-600' : 'text-gray-600'
                  }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
                {item.id === 'medicine-approval' && stats.pendingApprovals > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingApprovals}
                  </span>
                )}
                {item.id === 'inventory' && stats.lowStockItems > 0 && (
                  <span className="ml-auto bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.lowStockItems}
                  </span>
                )}
                {item.id === 'orders' && stats.pendingOrders > 0 && (
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
            );
          })}
        </nav>


        <div className="flex flex-col justify-between h-full w-64 bg-white">
          <div>
            {/* All your top menu items like Veterinarians, Suppliers, etc. */}
          </div>

          <div className="p-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard Overview' :
                activeTab === 'medicine-approval' ? 'Medicine Approval' :
                  activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-800 relative">
                <Bell className="h-6 w-6" />
                {(stats.pendingApprovals + stats.lowStockItems + stats.pendingOrders) > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingApprovals + stats.lowStockItems + stats.pendingOrders}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                <span className="text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Modals */}
      {showVetModal && (
        <VeterinarianModal
          onClose={() => setShowVetModal(false)}
          onSave={handleSaveVeterinarian}
        />
      )}

      {showSupplierModal && (
        <SupplierModal
          onClose={() => setShowSupplierModal(false)}
          onSave={handleSaveSupplier}
        />
      )}

      {/* Edit Modals */}
      {showVetEditModal && (
        <EditVeterinarianModal
          veterinarian={selectedVeterinarian}
          onClose={() => setShowVetEditModal(false)}
          onSave={handleUpdateVeterinarian}
        />
      )}

      {showSupplierEditModal && (
        <EditSupplierModal
          supplier={selectedSupplier}
          onClose={() => setShowSupplierEditModal(false)}
          onSave={handleUpdateSupplier}
        />
      )}

      {showInventoryEditModal && (
        <EditInventoryItemModal
          item={selectedInventoryItem}
          onClose={() => setShowInventoryEditModal(false)}
          onSave={handleUpdateInventoryItem}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          itemType={deleteType}
          itemName={deleteItemName}
          isLoading={isDeleting}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default AdminDashboard;