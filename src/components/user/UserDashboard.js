




// // components/user/UserDashboard.js
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { getDatabase, ref, onValue, set } from 'firebase/database';

// const UserDashboard = () => {
//   const { currentUser, userData, logout } = useAuth();
//   const navigate = useNavigate();
//   const [veterinarians, setVeterinarians] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [vetLoading, setVetLoading] = useState(true);
//   const [appointments, setAppointments] = useState([]);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedVet, setSelectedVet] = useState(null);
//   const [paymentStep, setPaymentStep] = useState(0); // 0: not started, 1: in progress, 2: success

//   // Fetch veterinarians from Firebase
//   useEffect(() => {
//     const fetchVeterinarians = async () => {
//       try {
//         setVetLoading(true);
//         const db = getDatabase();
//         const veterinaryRef = ref(db, 'veterinary');

//         onValue(veterinaryRef, (snapshot) => {
//           const vets = [];
//           snapshot.forEach((childSnapshot) => {
//             // Only include active veterinarians
//             const vetData = childSnapshot.val();
//             if (vetData.status === 'active') {
//               vets.push({
//                 id: childSnapshot.key,
//                 ...vetData
//               });
//             }
//           });

//           setVeterinarians(vets);
//           setVetLoading(false);
//         });
//       } catch (error) {
//         console.error("Error fetching veterinarians:", error);
//         setVetLoading(false);
//       }
//     };

//     fetchVeterinarians();
//   }, []);

//   // Fetch user's appointments
//   useEffect(() => {
//     if (currentUser) {
//       setLoading(true);
//       const db = getDatabase();
//       const appointmentsRef = ref(db, 'appointments');

//       onValue(appointmentsRef, (snapshot) => {
//         const userAppointments = [];
//         snapshot.forEach((childSnapshot) => {
//           const appointment = childSnapshot.val();
//           if (appointment.userId === currentUser.uid) {
//             userAppointments.push({
//               id: childSnapshot.key,
//               ...appointment
//             });
//           }
//         });

//         // Sort by date (newest first)
//         userAppointments.sort((a, b) => {
//           const dateA = new Date(`${a.date} ${a.time}`);
//           const dateB = new Date(`${b.date} ${b.time}`);
//           return dateB - dateA;
//         });

//         setAppointments(userAppointments);
//         setLoading(false);
//       });
//     }
//   }, [currentUser]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   const handleBookAppointment = (vetId) => {
//     // Instead of navigating away, show the booking interface directly
//     const selectedVet = veterinarians.find(vet => vet.id === vetId);
//     setSelectedVet(selectedVet);
//     setShowCalendar(true);
//   };

//   const handleSelectVet = (vet) => {
//     setSelectedVet(vet);
//     setShowCalendar(true);
//   };

//   // Function to save appointment to Firebase
//   const saveAppointmentToFirebase = async (date, time) => {
//     if (!currentUser || !selectedVet) {
//       console.error('Missing user or vet information');
//       return;
//     }

//     try {
//       const db = getDatabase();

//       // Generate a unique ID for the appointment
//       const newAppointmentRef = ref(db, 'appointments/' + Date.now());

//       // Create appointment data
//       const appointmentData = {
//         userId: currentUser.uid,
//         userName: userData?.name || currentUser.email,
//         userEmail: currentUser.email,
//         userPhone: userData?.phone || '',
//         vetId: selectedVet.id || 'default-vet-id',
//         vetName: selectedVet.name,
//         vetEmail: selectedVet.email || 'vet@example.com',
//         date: date || '2025-06-24',
//         time: time || '1:00 PM',
//         status: 'pending',
//         amount: 800,
//         createdAt: new Date().toISOString(),
//         reason: '',
//         notes: ''
//       };

//       // Save to Firebase
//       await set(newAppointmentRef, appointmentData);

//       console.log('Appointment saved successfully');
//       return true;
//     } catch (error) {
//       console.error('Error saving appointment:', error);
//       return false;
//     }
//   };

//   const handleDateSelect = (date) => {
//     // Start the payment process
//     setPaymentStep(1);

//     // Simulate payment processing
//     setTimeout(() => {
//       // Process the payment and save appointment
//       saveAppointmentToFirebase(date, '1:00 PM')
//         .then(() => {
//           setPaymentStep(2);

//           // Add delay before redirecting back to dashboard
//           setTimeout(() => {
//             setShowCalendar(false);
//             setSelectedVet(null);
//             setPaymentStep(0);
//             setActiveTab('dashboard');

//             // Refresh appointment list
//             const db = getDatabase();
//             const appointmentsRef = ref(db, 'appointments');
//             onValue(appointmentsRef, (snapshot) => {
//               // This will trigger the useEffect that loads appointments
//             });
//           }, 3000);
//         })
//         .catch(error => {
//           console.error('Error in payment process:', error);
//           setPaymentStep(0);
//         });
//     }, 2000);
//   };

//   // Function to format date from ISO string
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };
//   // Dashboard tab content
//   const renderDashboard = () => (
//     <>
//       {/* Dashboard Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//           <div className="flex items-center mb-4">
//             <div className="bg-blue-100 p-3 rounded-full">
//               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 ml-3">Book Appointment</h3>
//           </div>
//           <p className="text-gray-600 mb-4">Schedule appointments with veterinarians for your pets</p>

//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//           <div className="flex items-center mb-4">
//             <div className="bg-red-100 p-3 rounded-full">
//               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 ml-3">Emergency Consult</h3>
//           </div>
//           <p className="text-gray-600 mb-4">Get immediate help for pet emergencies</p>
//           <button
//             onClick={() => navigate('/user/emergency')}
//             className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//           >
//             Emergency Help
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//           <div className="flex items-center mb-4">
//             <div className="bg-green-100 p-3 rounded-full">
//               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 ml-3">Medicine Store</h3>
//           </div>
//           <p className="text-gray-600 mb-4">Order medicines and supplements for your pets</p>
//           <button
//             onClick={() => navigate('/user/medicines')}
//             className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
//           >
//             Browse Medicines
//           </button>
//         </div>
//       </div>

//       {/* Veterinarians Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-gray-900">Our Veterinarians</h3>
//           <button
//             onClick={() => navigate('/user/veterinarians')}
//             className="text-white-600 hover:text-blue-700 font-medium text-sm"
//           >
//             View All
//           </button>
//         </div>

//         {vetLoading ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : veterinarians.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {veterinarians.slice(0, 3).map((vet) => (
//               <div key={vet.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                 <div className="bg-blue-600 p-4 text-center">
//                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                     <span className="text-xl font-bold text-blue-600">
//                       {vet.name ? vet.name.charAt(0).toUpperCase() : "V"}
//                     </span>
//                   </div>
//                   <h4 className="text-white font-semibold text-lg">{vet.name}</h4>
//                   <p className="text-blue-100 text-sm">{vet.specialization}</p>
//                 </div>
//                 <div className="p-4">
//                   <div className="flex items-center text-sm mb-2">
//                     <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                     <span className="text-gray-600">{vet.email}</span>
//                   </div>
//                   <div className="flex items-center text-sm mb-2">
//                     <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                     </svg>
//                     <span className="text-gray-600">{vet.phone || "Not available"}</span>
//                   </div>
//                   {vet.experience && (
//                     <div className="flex items-center text-sm">
//                       <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                       <span className="text-gray-600">{vet.experience} {vet.experience === 1 ? "year" : "years"} experience</span>
//                     </div>
//                   )}
//                   <button
//                     onClick={() => handleBookAppointment(vet.id)}
//                     className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
//                   >
//                     Book Appointment
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8">
//             <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//             </svg>
//             <h4 className="text-lg font-medium text-gray-900">No Veterinarians Available</h4>
//             <p className="text-gray-600 mt-2">Please check back later for available veterinarians.</p>
//           </div>
//         )}
//       </div>

//       {/* Recent Appointments */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-gray-900">Recent Appointments</h3>
//           <button
//             onClick={() => navigate('/user/appointments')}
//             className="text-white-600 hover:text-blue-700 font-medium text-sm"
//           >
//             View All
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : appointments.length > 0 ? (
//           <div className="space-y-4">
//             {appointments.slice(0, 3).map((appointment) => (
//               <div key={appointment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                 <div className={`p-2 rounded-full mr-3 ${
//                   appointment.status === 'pending' ? 'bg-yellow-100' :
//                   appointment.status === 'confirmed' ? 'bg-green-100' :
//                   appointment.status === 'cancelled' ? 'bg-red-100' : 'bg-blue-100'
//                 }`}>
//                   <svg className={`w-5 h-5 ${
//                     appointment.status === 'pending' ? 'text-yellow-600' :
//                     appointment.status === 'confirmed' ? 'text-green-600' :
//                     appointment.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
//                   }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between">
//                     <p className="text-sm font-medium text-gray-900">
//                       Appointment with Dr. {appointment.vetName}
//                     </p>
//                     <span className={`text-xs px-2 py-1 rounded-full ${
//                       appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                       appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
//                     }`}>
//                       {appointment.status}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500">
//                     {new Date(appointment.date).toDateString()} at {appointment.time}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-4">
//             <p className="text-gray-600">No appointments scheduled yet.</p>
//             <button
//               onClick={() => {
//                 setShowCalendar(true);
//                 setSelectedVet(null);
//               }}
//               className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
//             >
//               Book your first appointment
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Profile Section */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
//           <div className="space-x-3">
//             <button
//               onClick={() => navigate('/user/appointments')}
//               className="text-white-600 hover:text-blue-700 font-medium"
//             >
//               View Appointments
//             </button>
//             {/* <button
//               onClick={() => navigate('/user/profile')}
//               className="text-white-600 hover:text-blue-700 font-medium"
//             >
//               Edit Profile
//             </button> */}
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <p className="mt-1 text-sm text-gray-900">{userData?.name || 'Not provided'}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <p className="mt-1 text-sm text-gray-900">{userData?.email || currentUser?.email}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone</label>
//             <p className="mt-1 text-sm text-gray-900">{userData?.phone || 'Not provided'}</p>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Address</label>
//             <p className="mt-1 text-sm text-gray-900">{userData?.address || 'Not provided'}</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );

//   // Appointments tab (calendar view)
//   const renderCalendar = () => {
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();

//     // Generate month view
//     const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//     const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

//     const monthDays = [];
//     for (let i = 0; i < firstDayOfMonth; i++) {
//       monthDays.push(null); // Empty cells for days before the 1st
//     }

//     for (let i = 1; i <= daysInMonth; i++) {
//       monthDays.push(i);
//     }

//     const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     // Find days with appointments
//     const appointmentDays = appointments.map(app => new Date(app.date).getDate());

//     return (
//       <>
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-900">June 2025</h2>
//             <div className="flex space-x-2">
//               <button className="bg-gray-100 p-2 rounded hover:bg-gray-200">
//                 <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <button className="bg-gray-100 p-2 rounded hover:bg-gray-200">
//                 <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-7 gap-2 mb-4">
//             {daysOfWeek.map(day => (
//               <div key={day} className="text-center font-medium text-gray-700 py-2">
//                 {day}
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-7 gap-2">
//             {monthDays.map((day, index) => {
//               const hasAppointment = day && appointmentDays.includes(day);
//               const isToday = day === currentDate.getDate();
//               const isHighlighted = day === 24 || day === 25; // Highlight dates with appointments in the image

//               return (
//                 <div 
//                   key={index} 
//                   onClick={() => day && handleDateSelect(`2025-06-${day}`)}
//                   className={`
//                     ${!day ? 'opacity-0' : 'cursor-pointer'} 
//                     p-2 rounded-lg text-center border
//                     ${isToday ? 'bg-blue-50 border-blue-200' : ''}
//                     ${isHighlighted ? 'bg-blue-100 border-blue-300' : ''}
//                     ${hasAppointment ? 'border-blue-500' : 'border-gray-200'}
//                     hover:bg-blue-50
//                   `}
//                 >
//                   <div className="relative">
//                     <span className={`
//                       ${isToday ? 'font-bold text-blue-600' : 'text-gray-800'}
//                     `}>
//                       {day}
//                     </span>
//                     {hasAppointment && (
//                       <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
//                     )}
//                     {day === 24 && (
//                       <div className="mt-1 text-xs bg-blue-500 text-white py-0.5 px-1 rounded">1:00 PM</div>
//                     )}
//                     {day === 25 && (
//                       <div className="mt-1 text-xs bg-blue-500 text-white py-0.5 px-1 rounded">11:30 AM</div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-6 text-center">
//             <button 
//               onClick={() => {
//                 setShowCalendar(true);
//                 setSelectedVet(veterinarians[0] || {name: 'Sarah Williams', specialization: 'General Veterinarian'});
//               }}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
//             >
//               Book New Appointment
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>

//           {loading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : appointments.length > 0 ? (
//             <div className="space-y-4">
//               {appointments.map((appointment) => {
//                 const appointmentDate = new Date(appointment.date);
//                 const isPast = appointmentDate < new Date();

//                 if (isPast) return null; // Skip past appointments

//                 return (
//                   <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className={`p-3 rounded-full mr-3 ${
//                           appointment.status === 'pending' ? 'bg-yellow-100' :
//                           appointment.status === 'confirmed' ? 'bg-green-100' : 'bg-blue-100'
//                         }`}>
//                           <svg className={`w-6 h-6 ${
//                             appointment.status === 'pending' ? 'text-yellow-600' :
//                             appointment.status === 'confirmed' ? 'text-green-600' : 'text-blue-600'
//                           }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">Dr. {appointment.vetName}</p>
//                           <p className="text-sm text-gray-500">
//                             {formatDate(appointment.date)} • {appointment.time}
//                           </p>
//                         </div>
//                       </div>
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
//                         'bg-blue-100 text-blue-800'
//                       }`}>
//                         {appointment.status}
//                       </span>
//                     </div>

//                     <div className="mt-4 flex justify-end space-x-3">
//                       <button 
//                         className="text-gray-600 hover:text-gray-900 text-sm font-medium"
//                         onClick={() => navigate(`/user/reschedule/${appointment.id}`)}
//                       >
//                         Reschedule
//                       </button>
//                       <button 
//                         className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
//                         onClick={() => navigate(`/user/appointment/${appointment.id}`)}
//                       >
//                         View Details
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-6">
//               <p className="text-gray-600">No upcoming appointments scheduled.</p>
//               <button
//                 onClick={() => {
//                   setShowCalendar(true);
//                   setSelectedVet(veterinarians[0] || {name: 'Sarah Williams', specialization: 'General Veterinarian'});
//                 }}
//                 className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 Book your first appointment
//               </button>
//             </div>
//           )}
//         </div>
//       </>
//     );
//   };

//   // If calendar view is active, show the appointment booking UI
//   const renderBookingView = () => {
//     return (
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Calendar view with veterinarian selection */}
//         <div className="bg-blue-600 p-6 text-white">
//           <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
//           {selectedVet && (
//             <div className="flex items-center">
//               <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
//                 {selectedVet.name.charAt(0).toUpperCase()}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-xl">{selectedVet.name}</h3>
//                 <p className="text-blue-100">{selectedVet.specialization}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Calendar view */}
//         <div className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>

//           {/* Month selector */}
//           <div className="mb-6 flex justify-between items-center">
//             <button className="text-blue-600 hover:text-blue-800">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <h4 className="text-lg font-medium">June 2025</h4>
//             <button className="text-blue-600 hover:text-blue-800">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>

//           {/* Calendar grid */}
//           <div className="grid grid-cols-7 border-r border-b">
//             {/* Days of week */}
//             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//               <div key={day} className="h-10 bg-gray-100 flex items-center justify-center font-medium border-t border-l">
//                 {day}
//               </div>
//             ))}

//             {/* Calendar cells */}
//             {Array.from({ length: 35 }).map((_, index) => {
//               const day = index - 5; // Start from previous month's days
//               const isCurrentMonth = day > 0 && day <= 30; // June has 30 days
//               const isHighlighted = day === 24 || day === 25; // Highlighted days from the image

//               return (
//                 <div 
//                   key={index}
//                   onClick={() => isCurrentMonth && day > 20 && handleDateSelect(`2025-06-${day}`)}
//                   className={`h-12 border-t border-l p-1 
//                     ${!isCurrentMonth ? 'bg-gray-100 text-gray-400' : 
//                       isHighlighted ? 'bg-blue-100 border-2 border-blue-500 cursor-pointer' : 
//                       'hover:bg-blue-50 cursor-pointer'}`}
//                 >
//                   {isCurrentMonth && (
//                     <div className="text-right font-medium">{day}</div>
//                   )}
//                   {day === 24 && (
//                     <div className="text-xs bg-blue-500 text-white rounded px-1 mt-1">1:00 PM</div>
//                   )}
//                   {day === 25 && (
//                     <div className="text-xs bg-blue-500 text-white rounded px-1 mt-1">11:30 AM</div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Time slots */}
//           {paymentStep === 0 && (
//             <div className="mt-6">
//               <h4 className="font-medium text-gray-900 mb-3">Available Time Slots for June 24</h4>
//               <div className="grid grid-cols-4 gap-2">
//                 {['9:00 AM', '9:30 AM', '10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '3:00 PM', '4:30 PM'].map((time) => (
//                   <div 
//                     key={time}
//                     className={`p-2 border rounded text-center cursor-pointer ${
//                       time === '1:00 PM' ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
//                     }`}
//                   >
//                     {time}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Payment section */}
//           {paymentStep === 0 && (
//             <div className="mt-8 pt-6 border-t">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h4 className="font-medium text-gray-900">Consultation Fee</h4>
//                   <p className="text-gray-600">Standard appointment (30 minutes)</p>
//                 </div>
//                 <span className="text-xl font-bold">₹800</span>
//               </div>

//               <button 
//                 onClick={() => handleDateSelect('2025-06-24')}
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
//               >
//                 Pay Now
//               </button>
//             </div>
//           )}

//           {/* Payment processing */}
//           {paymentStep === 1 && (
//             <div className="mt-8 text-center py-12">
//               <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
//               <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Payment</h3>
//               <p className="text-gray-600">Please wait while we process your payment...</p>
//             </div>
//           )}

//           {/* Payment success */}
//           {paymentStep === 2 && (
//             <div className="mt-8 text-center py-12">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                 <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-medium text-green-600 mb-2">Payment Successful!</h3>
//               <p className="text-gray-600 mb-6">Your appointment has been scheduled successfully.</p>

//               <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto mb-6">
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Date:</span>
//                   <span className="font-medium">June 24, 2025</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Time:</span>
//                   <span className="font-medium">1:00 PM</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span className="text-gray-600">Doctor:</span>
//                   <span className="font-medium">Dr. {selectedVet?.name || 'Sarah Williams'}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Status:</span>
//                   <span className="font-medium text-yellow-600">Pending</span>
//                 </div>
//               </div>

//               <p className="text-sm text-gray-500">
//                 Redirecting to dashboard in a few seconds...
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-gray-900">Pet-Vet Platform</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-700">Welcome, {userData?.name || currentUser?.email}</span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h2>
//           <p className="text-gray-600">Manage your pet care needs and appointments</p>
//         </div>

//         {/* Show Back Button when in Calendar/Booking Mode */}
//         {showCalendar && (
//           <div className="mb-4">
//             <button
//               onClick={() => {setShowCalendar(false); setPaymentStep(0);}}
//               className="flex items-center text-blue-600 hover:text-blue-800"
//             >
//               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back to Dashboard
//             </button>
//           </div>
//         )}

//         {/* Tab Navigation - Only show when not in booking mode */}
//         {/* {!showCalendar && (
//           <div className="flex border-b border-gray-200 mb-8">
//             <button
//               className={`py-4 px-6 font-medium ${
//                 activeTab === 'dashboard' 
//                   ? 'text-blue-600 border-b-2 border-blue-600' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('dashboard')}
//             >
//               Dashboard
//             </button>
//             <button
//               className={`py-4 px-6 font-medium ${
//                 activeTab === 'appointments' 
//                   ? 'text-blue-600 border-b-2 border-blue-600' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('appointments')}
//             >
//               Appointments
//             </button>
//             <button
//               className={`py-4 px-6 font-medium ${
//                 activeTab === 'pets' 
//                   ? 'text-blue-600 border-b-2 border-blue-600' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('pets')}
//             >
//               My Pets
//             </button>
//             <button
//               className={`py-4 px-6 font-medium ${
//                 activeTab === 'profile' 
//                   ? 'text-blue-600 border-b-2 border-blue-600' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('profile')}
//             >
//               Profile
//             </button>
//           </div>
//         )} */}

//         {/* Tab Content */}
//         {showCalendar ? renderBookingView() : (
//           activeTab === 'dashboard' ? renderDashboard() :
//           activeTab === 'appointments' ? renderCalendar() :
//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//               {activeTab === 'pets' ? 'My Pets' : 'Profile Settings'}
//             </h3>
//             <p className="text-gray-600">This section is currently under development.</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default UserDashboard;



// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { getDatabase, ref, onValue, set, push, update } from 'firebase/database';

// const UserDashboard = () => {
//   const { currentUser, userData, logout } = useAuth();
//   const navigate = useNavigate();
//   const [veterinarians, setVeterinarians] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [vetLoading, setVetLoading] = useState(true);
//   const [appointments, setAppointments] = useState([]);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedVet, setSelectedVet] = useState(null);
//   const [paymentStep, setPaymentStep] = useState(0); // 0: not started, 1: in progress, 2: success
//   const [activeAppointment, setActiveAppointment] = useState(null);
//   const [showVideoConsult, setShowVideoConsult] = useState(false);
//   const [emergencyVets, setEmergencyVets] = useState([]);
//   const [showEmergencyModal, setShowEmergencyModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTime, setSelectedTime] = useState('');
//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);

//   // Fetch veterinarians from Firebase
//   useEffect(() => {
//     const fetchVeterinarians = async () => {
//       try {
//         setVetLoading(true);
//         const db = getDatabase();
//         const veterinaryRef = ref(db, 'veterinary');

//         onValue(veterinaryRef, (snapshot) => {
//           const vets = [];
//           const availableForEmergency = [];

//           snapshot.forEach((childSnapshot) => {
//             // Only include active veterinarians
//             const vetData = childSnapshot.val();
//             if (vetData.status === 'active') {
//               const vetWithId = {
//                 id: childSnapshot.key,
//                 ...vetData
//               };

//               vets.push(vetWithId);

//               // Check if available for emergency
//               if (vetData.emergencyAvailable) {
//                 availableForEmergency.push(vetWithId);
//               }
//             }
//           });

//           setVeterinarians(vets);
//           setEmergencyVets(availableForEmergency);
//           setVetLoading(false);
//         });
//       } catch (error) {
//         console.error("Error fetching veterinarians:", error);
//         setVetLoading(false);
//       }
//     };

//     fetchVeterinarians();
//   }, []);

//   // Fetch user's appointments
//   useEffect(() => {
//     if (currentUser) {
//       setLoading(true);
//       const db = getDatabase();
//       const appointmentsRef = ref(db, 'appointments');

//       onValue(appointmentsRef, (snapshot) => {
//         const userAppointments = [];
//         snapshot.forEach((childSnapshot) => {
//           const appointment = childSnapshot.val();
//           if (appointment.userId === currentUser.uid) {
//             userAppointments.push({
//               id: childSnapshot.key,
//               ...appointment
//             });
//           }
//         });

//         // Sort by date (newest first)
//         userAppointments.sort((a, b) => {
//           const dateA = new Date(`${a.date} ${a.time}`);
//           const dateB = new Date(`${b.date} ${b.time}`);
//           return dateB - dateA;
//         });

//         setAppointments(userAppointments);
//         setLoading(false);
//       });
//     }
//   }, [currentUser]);

//   // Fetch prescriptions
//   useEffect(() => {
//     if (currentUser) {
//       const db = getDatabase();
//       const prescriptionsRef = ref(db, 'prescriptions');

//       onValue(prescriptionsRef, (snapshot) => {
//         const userPrescriptions = [];
//         snapshot.forEach((childSnapshot) => {
//           const prescription = childSnapshot.val();
//           if (prescription.userId === currentUser.uid) {
//             userPrescriptions.push({
//               id: childSnapshot.key,
//               ...prescription
//             });
//           }
//         });

//         // Sort by date (newest first)
//         userPrescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));

//         setPrescriptions(userPrescriptions);
//       });
//     }
//   }, [currentUser]);

//   // Fetch available time slots when vet and date are selected
//   useEffect(() => {
//     if (selectedVet && selectedDate) {
//       fetchAvailableTimeSlots();
//     }
//   }, [selectedVet, selectedDate]);

//   const fetchAvailableTimeSlots = () => {
//     if (!selectedVet || !selectedDate) return;

//     try {
//       const db = getDatabase();

//       // Get vet's time slots configuration
//       const vetRef = ref(db, `veterinary/${selectedVet.id}`);
//       onValue(vetRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const vetData = snapshot.val();
//           const timeSlots = vetData.timeSlots || {};

//           // Get day of week from selected date
//           const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//           const dayOfWeek = days[selectedDate.getDay()];

//           // Get available hours for that day
//           const daySlots = timeSlots[dayOfWeek] || {};

//           // Convert to time strings (9:00 AM, etc.)
//           const availableSlots = [];
//           for (const [hour, available] of Object.entries(daySlots)) {
//             if (available) {
//               const hourNum = parseInt(hour);
//               const timeString = hourNum < 12 
//                 ? `${hourNum}:00 AM` 
//                 : hourNum === 12 
//                   ? '12:00 PM' 
//                   : `${hourNum-12}:00 PM`;

//               availableSlots.push(timeString);

//               // Also add half-hour slots
//               const halfHourString = hourNum < 12 
//                 ? `${hourNum}:30 AM` 
//                 : hourNum === 12 
//                   ? '12:30 PM' 
//                   : `${hourNum-12}:30 PM`;

//               availableSlots.push(halfHourString);
//             }
//           }

//           // Now check against existing appointments
//           const appointmentsRef = ref(db, 'appointments');
//           const dateString = selectedDate.toISOString().split('T')[0];

//           onValue(appointmentsRef, (snapshot) => {
//             const bookedSlots = [];

//             snapshot.forEach((childSnapshot) => {
//               const appointment = childSnapshot.val();
//               if (appointment.vetId === selectedVet.id && appointment.date === dateString) {
//                 bookedSlots.push(appointment.time);
//               }
//             });

//             // Filter out booked slots
//             const availableTimes = availableSlots.filter(slot => !bookedSlots.includes(slot));
//             setAvailableTimeSlots(availableTimes);
//           });
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching available time slots:", error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   const handleBookAppointment = (vetId) => {
//     const selectedVet = veterinarians.find(vet => vet.id === vetId);
//     setSelectedVet(selectedVet);
//     setShowCalendar(true);
//     setSelectedDate(new Date());
//     setSelectedTime('');
//     setPaymentStep(0);
//   };

//   const handleSelectDate = (date) => {
//     setSelectedDate(date);
//     setSelectedTime('');
//   };

//   const handleSelectTime = (time) => {
//     setSelectedTime(time);
//   };

//   const handlePayment = () => {
//     if (!selectedVet || !selectedDate || !selectedTime) {
//       alert('Please select a date and time');
//       return;
//     }

//     setPaymentStep(1);

//     // Simulate payment processing
//     setTimeout(() => {
//       saveAppointment()
//         .then(() => {
//           setPaymentStep(2);

//           // Add delay before redirecting back to dashboard
//           setTimeout(() => {
//             setShowCalendar(false);
//             setSelectedVet(null);
//             setSelectedTime('');
//             setPaymentStep(0);
//             setActiveTab('dashboard');
//           }, 3000);
//         })
//         .catch(error => {
//           console.error('Error in payment process:', error);
//           setPaymentStep(0);
//         });
//     }, 2000);
//   };

//   const saveAppointment = async () => {
//     if (!currentUser || !selectedVet || !selectedDate || !selectedTime) {
//       console.error('Missing required information for appointment');
//       return;
//     }

//     try {
//       const db = getDatabase();

//       // Format date to YYYY-MM-DD
//       const dateString = selectedDate.toISOString().split('T')[0];

//       // Generate a unique ID for the appointment
//       const appointmentsRef = ref(db, 'appointments');
//       const newAppointmentRef = push(appointmentsRef);

//       // Create appointment data
//       const appointmentData = {
//         userId: currentUser.uid,
//         userName: userData?.name || currentUser.email,
//         userEmail: currentUser.email,
//         userPhone: userData?.phone || '',
//         vetId: selectedVet.id,
//         vetName: selectedVet.name,
//         vetEmail: selectedVet.email || '',
//         date: dateString,
//         time: selectedTime,
//         status: 'pending',
//         amount: 800,
//         createdAt: new Date().toISOString(),
//         reason: '',
//         notes: ''
//       };

//       // Save to Firebase
//       await set(newAppointmentRef, appointmentData);
//       return true;
//     } catch (error) {
//       console.error('Error saving appointment:', error);
//       return false;
//     }
//   };

//   const handleEmergencyConsult = () => {
//     if (emergencyVets.length === 0) {
//       alert('No veterinarians are currently available for emergency consultations.');
//       return;
//     }

//     setShowEmergencyModal(true);
//   };

//   const startEmergencyConsult = async (vetId) => {
//     try {
//       const vet = emergencyVets.find(v => v.id === vetId);

//       // Create an emergency appointment
//       const db = getDatabase();
//       const appointmentsRef = ref(db, 'appointments');
//       const newAppointmentRef = push(appointmentsRef);

//       const now = new Date();
//       const dateString = now.toISOString().split('T')[0];
//       const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       const appointmentData = {
//         userId: currentUser.uid,
//         userName: userData?.name || currentUser.email,
//         userEmail: currentUser.email,
//         userPhone: userData?.phone || '',
//         vetId: vet.id,
//         vetName: vet.name,
//         vetEmail: vet.email || '',
//         date: dateString,
//         time: timeString,
//         status: 'confirmed',
//         isEmergency: true,
//         amount: 1200, // Higher fee for emergency
//         createdAt: now.toISOString(),
//         reason: 'Emergency consultation',
//         notes: ''
//       };

//       await set(newAppointmentRef, appointmentData);

//       // Close modal and show video consultation
//       setShowEmergencyModal(false);
//       setActiveAppointment({
//         id: newAppointmentRef.key,
//         ...appointmentData
//       });
//       setShowVideoConsult(true);
//     } catch (error) {
//       console.error('Error starting emergency consultation:', error);
//       alert('Failed to start emergency consultation. Please try again.');
//     }
//   };

//   const joinVideoConsultation = (appointment) => {
//     setActiveAppointment(appointment);
//     setShowVideoConsult(true);
//   };

//   const endVideoConsultation = () => {
//     setShowVideoConsult(false);
//     setActiveAppointment(null);
//   };

//   // Function to format date from ISO string
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Dashboard tab view
//   const renderDashboard = () => {
//     return (
//       <>
//         {/* Dashboard Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//             <div className="flex items-center mb-4">
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 ml-3">Book Appointment</h3>
//             </div>
//             <p className="text-gray-600 mb-4">Schedule appointments with veterinarians for your pets</p>

//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//             <div className="flex items-center mb-4">
//               <div className="bg-red-100 p-3 rounded-full">
//                 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 ml-3">Emergency Consult</h3>
//             </div>
//             <p className="text-gray-600 mb-4">Get immediate help for pet emergencies</p>
//             <button
//               onClick={handleEmergencyConsult}
//               className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//             >
//               Emergency Help
//             </button>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//             <div className="flex items-center mb-4">
//               <div className="bg-green-100 p-3 rounded-full">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 ml-3">Prescriptions</h3>
//             </div>
//             <p className="text-gray-600 mb-4">View and manage your pet's prescriptions</p>
//             <button
//               onClick={() => setActiveTab('prescriptions')}
//               className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
//             >
//               View Prescriptions
//             </button>
//           </div>
//         </div>

//         {/* Veterinarians Section */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">Our Veterinarians</h3>
//             <button
//               onClick={() => setActiveTab('veterinarians')}
//               className="text-blue-600 hover:text-blue-700 font-medium text-sm"
//             >
//               View All
//             </button>
//           </div>

//           {vetLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : veterinarians.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {veterinarians.slice(0, 3).map((vet) => (
//                 <div key={vet.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                   <div className="bg-blue-600 p-4 text-center">
//                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                       <span className="text-xl font-bold text-blue-600">
//                         {vet.name ? vet.name.charAt(0).toUpperCase() : "V"}
//                       </span>
//                     </div>
//                     <h4 className="text-white font-semibold text-lg">{vet.name}</h4>
//                     <p className="text-blue-100 text-sm">{vet.specialization}</p>
//                   </div>
//                   <div className="p-4">
//                     <div className="flex items-center text-sm mb-2">
//                       <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                       <span className="text-gray-600">{vet.email}</span>
//                     </div>
//                     <div className="flex items-center text-sm mb-2">
//                       <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                       </svg>
//                       <span className="text-gray-600">{vet.phone || "Not available"}</span>
//                     </div>
//                     {vet.experience && (
//                       <div className="flex items-center text-sm">
//                         <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         <span className="text-gray-600">{vet.experience} {vet.experience === 1 ? "year" : "years"} experience</span>
//                       </div>
//                     )}
//                     <button
//                       onClick={() => handleBookAppointment(vet.id)}
//                       className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
//                     >
//                       Book Appointment
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//               <h4 className="text-lg font-medium text-gray-900">No Veterinarians Available</h4>
//               <p className="text-gray-600 mt-2">Please check back later for available veterinarians.</p>
//             </div>
//           )}
//         </div>

//         {/* Recent Appointments */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">Recent Appointments</h3>
//             <button
//               onClick={() => setActiveTab('appointments')}
//               className="text-blue-600 hover:text-blue-700 font-medium text-sm"
//             >
//               View All
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : appointments.length > 0 ? (
//             <div className="space-y-4">
//               {appointments.slice(0, 3).map((appointment) => (
//                 <div key={appointment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                   <div className={`p-2 rounded-full mr-3 ${
//                     appointment.status === 'pending' ? 'bg-yellow-100' :
//                     appointment.status === 'confirmed' ? 'bg-green-100' :
//                     appointment.status === 'completed' ? 'bg-blue-100' :
//                     'bg-red-100'
//                   }`}>
//                     <svg className={`w-5 h-5 ${
//                       appointment.status === 'pending' ? 'text-yellow-600' :
//                       appointment.status === 'confirmed' ? 'text-green-600' :
//                       appointment.status === 'completed' ? 'text-blue-600' :
//                       'text-red-600'
//                     }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <p className="text-sm font-medium text-gray-900">
//                         Appointment with Dr. {appointment.vetName}
//                       </p>
//                       <span className={`text-xs px-2 py-1 rounded-full ${
//                         appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                         appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {appointment.status}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                       {new Date(appointment.date).toDateString()} at {appointment.time}
//                     </p>
//                     {appointment.status === 'confirmed' && (
//                       <button
//                         onClick={() => joinVideoConsultation(appointment)}
//                         className="mt-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
//                       >
//                         Join Video Consultation
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-4">
//               <p className="text-gray-600">No appointments scheduled yet.</p>
//               <button
//                 onClick={() => {
//                   setShowCalendar(true);
//                   setSelectedVet(veterinarians[0] || {name: 'Dr. Sarah Williams', specialization: 'General Veterinarian'});
//                 }}
//                 className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
//               >
//                 Book your first appointment
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Profile Section */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
//             <div className="space-x-3">
//               <button
//                 onClick={() => setActiveTab('appointments')}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 View Appointments
//               </button>
//               <button
//                 onClick={() => setActiveTab('profile')}
//                 className="text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <p className="mt-1 text-sm text-gray-900">{userData?.name || 'Not provided'}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <p className="mt-1 text-sm text-gray-900">{userData?.email || currentUser?.email}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone</label>
//               <p className="mt-1 text-sm text-gray-900">{userData?.phone || 'Not provided'}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Address</label>
//               <p className="mt-1 text-sm text-gray-900">{userData?.address || 'Not provided'}</p>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   // Appointments tab
//   const renderAppointments = () => {
//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>

//         {/* Filter Tabs */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">


//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : appointments.length > 0 ? (
//             <div className="divide-y divide-gray-200">
//               {appointments.map((appointment) => {
//                 const isPast = new Date(`${appointment.date} ${appointment.time}`) < new Date();

//                 return (
//                   <div key={appointment.id} className="p-6">
//                     <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//                       <div className="mb-4 md:mb-0">
//                         <div className="flex items-center">
//                           <div className={`p-2 rounded-full mr-3 ${
//                             appointment.status === 'pending' ? 'bg-yellow-100' :
//                             appointment.status === 'confirmed' ? 'bg-green-100' :
//                             appointment.status === 'completed' ? 'bg-blue-100' :
//                             'bg-red-100'
//                           }`}>
//                             <svg className={`w-5 h-5 ${
//                               appointment.status === 'pending' ? 'text-yellow-600' :
//                               appointment.status === 'confirmed' ? 'text-green-600' :
//                               appointment.status === 'completed' ? 'text-blue-600' :
//                               'text-red-600'
//                             }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                           <div>
//                             <h4 className="text-lg font-medium text-gray-900">
//                               Appointment with Dr. {appointment.vetName}
//                             </h4>
//                             <div className="flex items-center mt-1">
//                               <span className="text-sm text-gray-600 mr-3">
//                                 {new Date(appointment.date).toDateString()}
//                               </span>
//                               <span className="text-sm text-gray-600 mr-3">
//                                 {appointment.time}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded-full ${
//                                 appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                                 appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                                 appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                                 'bg-red-100 text-red-800'
//                               }`}>
//                                 {appointment.status}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-3">
//                         {appointment.status === 'confirmed' && !isPast && (
//                           <button
//                             onClick={() => joinVideoConsultation(appointment)}
//                             className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
//                           >
//                             Join Consultation
//                           </button>
//                         )}
//                         {appointment.status === 'pending' && !isPast && (
//                           <button
//                             onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
//                             className="text-red-600 hover:text-red-800 text-sm font-medium"
//                           >
//                             Cancel
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     {/* Additional Details */}
//                     <div className="mt-4 pt-4 border-t border-gray-100">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                           <h5 className="text-xs font-medium text-gray-500 uppercase">Fee</h5>
//                           <p className="mt-1 text-sm font-medium text-gray-900">₹{appointment.amount}</p>
//                         </div>

//                         <div>
//                           <h5 className="text-xs font-medium text-gray-500 uppercase">Booked On</h5>
//                           <p className="mt-1 text-sm text-gray-900">
//                             {new Date(appointment.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>

//                         <div>
//                           <h5 className="text-xs font-medium text-gray-500 uppercase">Reference ID</h5>
//                           <p className="mt-1 text-sm text-gray-900">{appointment.id.slice(0, 8).toUpperCase()}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
//               <p className="text-gray-500 mb-4">You don't have any appointments scheduled yet.</p>
//               <button
//                 onClick={() => {
//                   setShowCalendar(true);
//                   setSelectedVet(veterinarians[0] || {name: 'Dr. Sarah Williams', specialization: 'General Veterinarian'});
//                 }}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
//               >
//                 Book New Appointment
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Prescriptions tab
//   const renderPrescriptions = () => {
//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">My Prescriptions</h2>

//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           {prescriptions.length > 0 ? (
//             <div className="space-y-6">
//               {prescriptions.map((prescription) => (
//                 <div key={prescription.id} className="border rounded-lg overflow-hidden">
//                   <div className="bg-blue-600 p-4 text-white">
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-semibold">Prescription from Dr. {prescription.vetName}</h3>
//                       <span className="text-sm bg-blue-500 px-2 py-1 rounded">
//                         {new Date(prescription.date).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="p-4">
//                     <div className="mb-4">
//                       <h4 className="text-sm font-medium text-gray-700 uppercase mb-2">Notes</h4>
//                       <p className="text-gray-800 bg-gray-50 p-3 rounded">{prescription.notes}</p>
//                     </div>

//                     {prescription.medicines && prescription.medicines.length > 0 && (
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-700 uppercase mb-2">Medicines</h4>
//                         <div className="space-y-2">
//                           {prescription.medicines.map((medicine, index) => (
//                             <div key={index} className="bg-gray-50 p-3 rounded">
//                               <p className="font-medium">{medicine.name}</p>
//                               <div className="flex text-sm text-gray-600 mt-1">
//                                 <span className="mr-4">Dosage: {medicine.dosage}</span>
//                                 <span>Duration: {medicine.duration}</span>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
//                       <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
//                         Download PDF
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions found</h3>
//               <p className="text-gray-500">You don't have any prescriptions yet.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Booking view with calendar
//   const renderBookingView = () => {
//     return (
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Veterinarian info */}
//         <div className="bg-blue-600 p-6 text-white">
//           <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
//           {selectedVet && (
//             <div className="flex items-center">
//               <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
//                 {selectedVet.name.charAt(0).toUpperCase()}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-xl">{selectedVet.name}</h3>
//                 <p className="text-blue-100">{selectedVet.specialization}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Step 1: Select Date */}
//         {paymentStep === 0 && (
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>

//             {/* Month selector */}
//             <div className="mb-6 flex justify-between items-center">
//               <button className="text-blue-600 hover:text-blue-800">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <h4 className="text-lg font-medium">
//                 {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
//               </h4>
//               <button className="text-blue-600 hover:text-blue-800">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Calendar grid */}
//             <div className="grid grid-cols-7 border-r border-b">
//               {/* Days of week */}
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//                 <div key={day} className="h-10 bg-gray-100 flex items-center justify-center font-medium border-t border-l">
//                   {day}
//                 </div>
//               ))}

//               {/* Calendar cells */}
//               {Array.from({ length: 42 }).map((_, index) => {
//                 const currentMonth = selectedDate.getMonth();
//                 const currentYear = selectedDate.getFullYear();
//                 const firstDay = new Date(currentYear, currentMonth, 1).getDay();
//                 const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

//                 const day = index - firstDay + 1;
//                 const isCurrentMonth = day > 0 && day <= lastDate;
//                 const date = new Date(currentYear, currentMonth, day);
//                 const isToday = isCurrentMonth && date.toDateString() === new Date().toDateString();
//                 const isSelected = isCurrentMonth && date.toDateString() === selectedDate.toDateString();
//                 const isPast = date < new Date().setHours(0, 0, 0, 0);

//                 return (
//                   <div 
//                     key={index}
//                     onClick={() => isCurrentMonth && !isPast && handleSelectDate(date)}
//                     className={`h-12 border-t border-l p-1 ${
//                       !isCurrentMonth ? 'bg-gray-100 text-gray-400' : 
//                       isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                       isSelected ? 'bg-blue-100 border-2 border-blue-500 cursor-pointer' : 
//                       isToday ? 'bg-yellow-50 cursor-pointer' :
//                       'hover:bg-blue-50 cursor-pointer'
//                     }`}
//                   >
//                     {isCurrentMonth && (
//                       <div className={`text-right ${isToday ? 'font-bold' : 'font-medium'}`}>{day}</div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Time slots */}
//             <div className="mt-6">
//               <h4 className="font-medium text-gray-900 mb-3">
//                 Available Time Slots for {selectedDate.toLocaleDateString()}
//               </h4>
//               {availableTimeSlots.length > 0 ? (
//                 <div className="grid grid-cols-4 gap-2">
//                   {availableTimeSlots.map((time) => (
//                     <div 
//                       key={time}
//                       onClick={() => handleSelectTime(time)}
//                       className={`p-2 border rounded text-center cursor-pointer ${
//                         selectedTime === time ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
//                       }`}
//                     >
//                       {time}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-4 bg-gray-50 rounded">
//                   <p className="text-gray-500">No available slots for this date. Please select another date.</p>
//                 </div>
//               )}
//             </div>

//             {/* Payment section */}
//             <div className="mt-8 pt-6 border-t">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h4 className="font-medium text-gray-900">Consultation Fee</h4>
//                   <p className="text-gray-600">Standard appointment (30 minutes)</p>
//                 </div>
//                 <span className="text-xl font-bold">₹800</span>
//               </div>

//               <button 
//                 onClick={handlePayment}
//                 disabled={!selectedTime}
//                 className={`w-full py-3 rounded-lg font-medium ${
//                   selectedTime ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 } transition duration-300`}
//               >
//                 Pay Now
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Payment processing */}
//         {paymentStep === 1 && (
//           <div className="p-6 text-center py-12">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Payment</h3>
//             <p className="text-gray-600">Please wait while we process your payment...</p>
//           </div>
//         )}

//         {/* Payment success */}
//         {paymentStep === 2 && (
//           <div className="p-6 text-center py-12">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-green-600 mb-2">Payment Successful!</h3>
//             <p className="text-gray-600 mb-6">Your appointment has been scheduled successfully.</p>

//             <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto mb-6">
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Date:</span>
//                 <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Time:</span>
//                 <span className="font-medium">{selectedTime}</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Doctor:</span>
//                 <span className="font-medium">Dr. {selectedVet?.name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Status:</span>
//                 <span className="font-medium text-yellow-600">Pending</span>
//               </div>
//             </div>

//             <p className="text-sm text-gray-500">
//               Redirecting to dashboard in a few seconds...
//             </p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Video consultation component
//   const VideoConsultation = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col overflow-hidden">
//         <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//             <h3 className="font-semibold">Consultation with Dr. {activeAppointment?.vetName}</h3>
//           </div>
//           <button 
//             onClick={endVideoConsultation}
//             className="p-1 hover:bg-blue-700 rounded"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-4">
//           <div className="text-center text-white">
//             <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//             <p className="font-medium text-xl mb-2">Video call in progress</p>
//             <p className="text-gray-400">Connected with Dr. {activeAppointment?.vetName}</p>
//           </div>
//         </div>

//         <div className="p-4 bg-gray-800 flex justify-center space-x-4">
//           <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-9.9m2.828 9.9a9 9 0 001.414-12.728" />
//             </svg>
//           </button>
//           <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//             </svg>
//           </button>
//           <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
//             </svg>
//           </button>
//           <button 
//             onClick={endVideoConsultation}
//             className="p-3 bg-red-600 rounded-full hover:bg-red-700"
//           >
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Emergency modal
//   const EmergencyModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl w-full max-w-lg p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold text-gray-900">Emergency Consultation</h3>
//           <button 
//             onClick={() => setShowEmergencyModal(false)}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="bg-red-50 p-4 rounded-lg mb-6">
//           <div className="flex items-start">
//             <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//             </svg>
//             <div>
//               <h4 className="font-medium text-red-800">Emergency Service</h4>
//               <p className="text-sm text-red-700 mt-1">
//                 This service is for pet emergencies only. You will be connected to an available veterinarian immediately.
//                 The consultation fee for emergency services is ₹1200.
//               </p>
//             </div>
//           </div>
//         </div>

//         {emergencyVets.length > 0 ? (
//           <div className="space-y-4 mb-6">
//             <h4 className="font-medium text-gray-900">Available Veterinarians</h4>
//             {emergencyVets.map((vet) => (
//               <div key={vet.id} className="border rounded-lg p-4 hover:bg-gray-50">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                       <span className="font-bold text-blue-600">{vet.name.charAt(0)}</span>
//                     </div>
//                     <div>
//                       <h5 className="font-medium">{vet.name}</h5>
//                       <p className="text-sm text-gray-600">{vet.specialization}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => startEmergencyConsult(vet.id)}
//                     className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
//                   >
//                     Connect Now
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-6 mb-6">
//             <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <h4 className="text-lg font-medium text-gray-900 mb-1">No Veterinarians Available</h4>
//             <p className="text-gray-500">Sorry, there are no veterinarians available for emergency consultations at the moment.</p>
//           </div>
//         )}

//         <div className="flex justify-end">
//           <button
//             onClick={() => setShowEmergencyModal(false)}
//             className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
//     try {
//       const db = getDatabase();
//       const appointmentRef = ref(db, `appointments/${appointmentId}`);

//       await update(appointmentRef, {
//         status: newStatus
//       });

//       // UI will update automatically through the onValue listener
//     } catch (error) {
//       console.error("Error updating appointment status:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-gray-900">Pet-Vet Platform</h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-700">Welcome, {userData?.name || currentUser?.email}</span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h2>
//           <p className="text-gray-600">Manage your pet care needs and appointments</p>
//         </div>

//         {/* Show Back Button when in Calendar/Booking Mode */}
//         {showCalendar && (
//           <div className="mb-4">
//             <button
//               onClick={() => {setShowCalendar(false); setPaymentStep(0);}}
//               className="flex items-center text-blue-600 hover:text-blue-800"
//             >
//               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back to Dashboard
//             </button>
//           </div>
//         )}

//         {/* Tab Navigation - Only show when not in booking mode */}
//         {!showCalendar && (
//           <div className="flex border-b border-gray-200 mb-8">
//             <button
//               className={`py-4 px-6 font-medium ${
//                 activeTab === 'dashboard' 
//                   ? 'text-blue-600 border-b-2 border-blue-600' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('dashboard')}
//             >
//               Dashboard
//             </button>
//             <button
//               className={`py-4 px-6 font-medium ${
//                 activeTab === 'appointments' 
//                   ? 'text-blue-600 border-b-2 border-blue-600' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('appointments')}
//             >
//               Appointments
//             </button>
//             <button
//               className={`py-4 px-6 font-medium ${
//                 activeTab === 'prescriptions' 
//                   ? 'text-blue-600 border-b-2 border-blue-600' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('prescriptions')}
//             >
//               Prescriptions
//             </button>
//             <button
//               className={`py-4 px-6 font-medium ${
//                 activeTab === 'profile' 
//                   ? 'text-blue-600 border-b-2 border-blue-600' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//               onClick={() => setActiveTab('profile')}
//             >
//               Profile
//             </button>
//           </div>
//         )}

//         {/* Content */}
//         {showCalendar ? renderBookingView() : (
//           activeTab === 'dashboard' ? renderDashboard() :
//           activeTab === 'appointments' ? renderAppointments() :
//           activeTab === 'prescriptions' ? renderPrescriptions() :
//           <div className="bg-white rounded-lg shadow-md p-6 text-center">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h3>
//             <p className="text-gray-600">This section is currently under development.</p>
//           </div>
//         )}
//       </main>

//       {/* Video Consultation Modal */}
//       {showVideoConsult && activeAppointment && <VideoConsultation />}

//       {/* Emergency Modal */}
//       {showEmergencyModal && <EmergencyModal />}
//     </div>
//   );
// };

// export default UserDashboard;






// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { getDatabase, ref, onValue, set, push, update, query, orderByChild, equalTo } from 'firebase/database';
// import PetDetailsForm from './PetDetailsForm';  // Adjust path as needed
// import FeedbackForm from './FeedbackForm';      // Adjust path as needed
// import VetEcommercePlatform from './VetEcommercePlatform'; // Import the e-commerce component

// const UserDashboard = () => {
//   const { currentUser, userData, logout } = useAuth();
//   const navigate = useNavigate();
//   const [veterinarians, setVeterinarians] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [vetLoading, setVetLoading] = useState(true);
//   const [appointments, setAppointments] = useState([]);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedVet, setSelectedVet] = useState(null);
//   const [paymentStep, setPaymentStep] = useState(0); // 0: not started, 1: in progress, 2: success
//   const [activeAppointment, setActiveAppointment] = useState(null);
//   const [showVideoConsult, setShowVideoConsult] = useState(false);
//   const [emergencyVets, setEmergencyVets] = useState([]);
//   const [showEmergencyModal, setShowEmergencyModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTime, setSelectedTime] = useState('');
//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [emergencyPaymentStep, setEmergencyPaymentStep] = useState(0); // 0: not started, 1: in progress, 2: success
//   const [selectedEmergencyVet, setSelectedEmergencyVet] = useState(null);
//   const [cartItems, setCartItems] = useState([]);
//   const [cartMessage, setCartMessage] = useState({ show: false, type: '', text: '' });
//   const [orderedItems, setOrderedItems] = useState([]);
//   const [showFeedbackForm, setShowFeedbackForm] = useState(false);
//   const [selectedAppointmentForFeedback, setSelectedAppointmentForFeedback] = useState(null);
//   const [showEcommerce, setShowEcommerce] = useState(false);
//   const [showAllVets, setShowAllVets] = useState(false);

//   // 2. Define these functions at the component level, not inside renderPrescriptions
//   const addToCart = (prescription, medicine) => {
//     const cartItem = {
//       id: `${prescription.id}-${medicine.name}`,
//       prescriptionId: prescription.id,
//       medicineName: medicine.name,
//       dosage: medicine.dosage,
//       duration: medicine.duration,
//       doctor: prescription.vetName,
//       date: prescription.date
//     };

//     setCartItems([...cartItems, cartItem]);

//     // Show success message
//     setCartMessage({
//       show: true,
//       type: 'success',
//       text: `${medicine.name} added to cart`
//     });

//     // Hide message after 3 seconds
//     setTimeout(() => {
//       setCartMessage({ show: false, type: '', text: '' });
//     }, 3000);
//   };

//   const removeFromCart = (itemId) => {
//     const item = cartItems.find(item => item.id === itemId);
//     setCartItems(cartItems.filter(item => item.id !== itemId));

//     // Show removal message
//     setCartMessage({
//       show: true,
//       type: 'error',
//       text: `${item.medicineName} removed from cart`
//     });

//     // Hide message after 3 seconds
//     setTimeout(() => {
//       setCartMessage({ show: false, type: '', text: '' });
//     }, 3000);
//   };

//   const isInCart = (prescriptionId, medicineName) => {
//     return cartItems.some(item =>
//       item.prescriptionId === prescriptionId && item.medicineName === medicineName
//     );
//   };

// const renderAllVeterinarians = () => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-xl font-semibold text-gray-900">All Veterinarians</h3>

//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {veterinarians.map((vet) => (
//           <div key={vet.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//             {/* Vet card content - same as in your existing code */}
//             <div className="bg-blue-600 p-4 text-center">
//               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                 <span className="text-xl font-bold text-blue-600">
//                   {vet.name ? vet.name.charAt(0).toUpperCase() : "V"}
//                 </span>
//               </div>
//               <h4 className="text-white font-semibold text-lg">{vet.name}</h4>
//               <p className="text-blue-100 text-sm">{vet.specialization}</p>
//             </div>
//             <div className="p-4">
//               {/* Vet details - email, phone, experience */}
//               <div className="flex items-center text-sm mb-2">
//                 <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//                 <span className="text-gray-600">{vet.email}</span>
//               </div>
//               <div className="flex items-center text-sm mb-2">
//                 <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                 </svg>
//                 <span className="text-gray-600">{vet.phone || "Not available"}</span>
//               </div>
//               {vet.experience && (
//                 <div className="flex items-center text-sm">
//                   <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   <span className="text-gray-600">{vet.experience} {vet.experience === 1 ? "year" : "years"} experience</span>
//                 </div>
//               )}
//               <button
//                 onClick={() => handleBookAppointment(vet.id)}
//                 className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
//               >
//                 Book Appointment
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


//   const handleCheckout = async () => {
//     try {
//       const db = getDatabase();
//       const ordersRef = ref(db, 'orders');
//       const newOrderRef = push(ordersRef);

//       // Create order data
//       const orderData = {
//         userId: currentUser.uid,
//         userName: userData?.name || currentUser.email,
//         items: cartItems,
//         totalItems: cartItems.length,
//         status: 'pending',
//         createdAt: new Date().toISOString()
//       };

//       // Save to Firebase
//       await set(newOrderRef, orderData);

//       // Add all cart items to orderedItems
//       setOrderedItems(prev => [...prev, ...cartItems]);

//       // Show success message
//       setCartMessage({
//         show: true,
//         type: 'success',
//         text: 'Order placed successfully! Your medicines will be delivered soon.'
//       });

//       // Clear the cart
//       setCartItems([]);

//       // Hide message after 5 seconds
//       setTimeout(() => {
//         setCartMessage({ show: false, type: '', text: '' });
//       }, 5000);
//     } catch (error) {
//       console.error("Error placing order:", error);
//       setCartMessage({
//         show: true,
//         type: 'error',
//         text: 'Failed to place order. Please try again.'
//       });
//     }
//   };

//   // Add a helper function to check if an item is ordered
//   const isOrdered = (itemId) => {
//     return orderedItems.some(item => item.id === itemId);
//   };
//   // Fetch veterinarians from Firebase
//   useEffect(() => {
//     const fetchVeterinarians = async () => {
//       try {
//         setVetLoading(true);
//         const db = getDatabase();
//         const veterinaryRef = ref(db, 'veterinary');

//         onValue(veterinaryRef, (snapshot) => {
//           const vets = [];
//           const availableForEmergency = [];

//           snapshot.forEach((childSnapshot) => {
//             // Only include active veterinarians
//             const vetData = childSnapshot.val();
//             if (vetData.status === 'active') {
//               const vetWithId = {
//                 id: childSnapshot.key,
//                 ...vetData
//               };

//               vets.push(vetWithId);

//               // Check if available for emergency
//               if (vetData.emergencyAvailable) {
//                 availableForEmergency.push(vetWithId);
//               }
//             }
//           });

//           setVeterinarians(vets);
//           setEmergencyVets(availableForEmergency);
//           setVetLoading(false);
//         });
//       } catch (error) {
//         console.error("Error fetching veterinarians:", error);
//         setVetLoading(false);
//       }
//     };

//     fetchVeterinarians();
//   }, []);

//   // Fetch user's appointments
//   useEffect(() => {
//     if (currentUser) {
//       setLoading(true);
//       const db = getDatabase();
//       const appointmentsRef = ref(db, 'appointments');

//       onValue(appointmentsRef, (snapshot) => {
//         const userAppointments = [];
//         snapshot.forEach((childSnapshot) => {
//           const appointment = childSnapshot.val();
//           if (appointment.userId === currentUser.uid) {
//             userAppointments.push({
//               id: childSnapshot.key,
//               ...appointment
//             });
//           }
//         });

//         // Sort by date (newest first)
//         userAppointments.sort((a, b) => {
//           const dateA = new Date(`${a.date} ${a.time}`);
//           const dateB = new Date(`${b.date} ${b.time}`);
//           return dateB - dateA;
//         });

//         setAppointments(userAppointments);
//         setLoading(false);
//       });
//     }
//   }, [currentUser]);

//   // Fetch prescriptions
//   useEffect(() => {
//     if (currentUser) {
//       const db = getDatabase();
//       const prescriptionsRef = ref(db, 'prescriptions');

//       onValue(prescriptionsRef, (snapshot) => {
//         const userPrescriptions = [];
//         snapshot.forEach((childSnapshot) => {
//           const prescription = childSnapshot.val();
//           if (prescription.userId === currentUser.uid) {
//             userPrescriptions.push({
//               id: childSnapshot.key,
//               ...prescription
//             });
//           }
//         });

//         // Sort by date (newest first)
//         userPrescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));

//         setPrescriptions(userPrescriptions);
//       });
//     }
//   }, [currentUser]);

//   // Fetch available time slots when vet and date are selected
//   useEffect(() => {
//     if (selectedVet && selectedDate) {
//       fetchAvailableTimeSlots();
//     }
//   }, [selectedVet, selectedDate]);

//   const fetchAvailableTimeSlots = () => {
//     if (!selectedVet || !selectedDate) return;

//     try {
//       const db = getDatabase();

//       // Get vet's time slots configuration
//       const vetRef = ref(db, `veterinary/${selectedVet.id}`);
//       onValue(vetRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const vetData = snapshot.val();
//           const timeSlots = vetData.timeSlots || {};

//           // Get day of week from selected date
//           const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//           const dayOfWeek = days[selectedDate.getDay()];

//           // Get available hours for that day
//           const daySlots = timeSlots[dayOfWeek] || {};

//           // Convert to time strings (9:00 AM, etc.)
//           const availableSlots = [];
//           for (const [hour, available] of Object.entries(daySlots)) {
//             if (available) {
//               const hourNum = parseInt(hour);
//               const timeString = hourNum < 12
//                 ? `${hourNum}:00 AM`
//                 : hourNum === 12
//                   ? '12:00 PM'
//                   : `${hourNum - 12}:00 PM`;

//               availableSlots.push(timeString);

//               // Also add half-hour slots
//               const halfHourString = hourNum < 12
//                 ? `${hourNum}:30 AM`
//                 : hourNum === 12
//                   ? '12:30 PM'
//                   : `${hourNum - 12}:30 PM`;

//               availableSlots.push(halfHourString);
//             }
//           }

//           // Now check against existing appointments
//           const appointmentsRef = ref(db, 'appointments');
//           const dateString = selectedDate.toISOString().split('T')[0];

//           onValue(appointmentsRef, (snapshot) => {
//             const bookedSlots = [];

//             snapshot.forEach((childSnapshot) => {
//               const appointment = childSnapshot.val();
//               if (appointment.vetId === selectedVet.id && appointment.date === dateString) {
//                 bookedSlots.push(appointment.time);
//               }
//             });

//             // Filter out booked slots
//             const availableTimes = availableSlots.filter(slot => !bookedSlots.includes(slot));
//             setAvailableTimeSlots(availableTimes);
//           });
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching available time slots:", error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   const handleBookAppointment = (vetId) => {
//     const selectedVet = veterinarians.find(vet => vet.id === vetId);
//     setSelectedVet(selectedVet);
//     setShowCalendar(true);
//     setSelectedDate(new Date());
//     setSelectedTime('');
//     setPaymentStep(0);
//   };

//   const handleSelectDate = (date) => {
//     setSelectedDate(date);
//     setSelectedTime('');
//   };

//   const handleSelectTime = (time) => {
//     setSelectedTime(time);
//   };

//   const handlePayment = () => {
//     if (!selectedVet || !selectedDate || !selectedTime) {
//       alert('Please select a date and time');
//       return;
//     }

//     setPaymentStep(1);

//     // Simulate payment processing
//     setTimeout(() => {
//       saveAppointment()
//         .then(() => {
//           setPaymentStep(2);

//           // Add delay before redirecting back to dashboard
//           setTimeout(() => {
//             setShowCalendar(false);
//             setSelectedVet(null);
//             setSelectedTime('');
//             setPaymentStep(0);
//             setActiveTab('dashboard');
//           }, 3000);
//         })
//         .catch(error => {
//           console.error('Error in payment process:', error);
//           setPaymentStep(0);
//         });
//     }, 2000);
//   };

//   const saveAppointment = async () => {
//     if (!currentUser || !selectedVet || !selectedDate || !selectedTime) {
//       console.error('Missing required information for appointment');
//       return;
//     }

//     try {
//       const db = getDatabase();

//       // Format date to YYYY-MM-DD
//       const dateString = selectedDate.toISOString().split('T')[0];

//       // Generate a unique ID for the appointment
//       const appointmentsRef = ref(db, 'appointments');
//       const newAppointmentRef = push(appointmentsRef);

//       // Create appointment data
//       const appointmentData = {
//         userId: currentUser.uid,
//         userName: userData?.name || currentUser.email,
//         userEmail: currentUser.email,
//         userPhone: userData?.phone || '',
//         vetId: selectedVet.id,
//         vetName: selectedVet.name,
//         vetEmail: selectedVet.email || '',
//         date: dateString,
//         time: selectedTime,
//         status: 'pending',
//         amount: 800,
//         createdAt: new Date().toISOString(),
//         reason: '',
//         notes: ''
//       };

//       // Save to Firebase
//       await set(newAppointmentRef, appointmentData);
//       return true;
//     } catch (error) {
//       console.error('Error saving appointment:', error);
//       return false;
//     }
//   };

//   const handleEmergencyConsult = () => {
//     if (emergencyVets.length === 0) {
//       alert('No veterinarians are currently available for emergency consultations.');
//       return;
//     }

//     setShowEmergencyModal(true);
//     setEmergencyPaymentStep(0);
//     setSelectedEmergencyVet(null);
//   };

//   const handleEmergencyPayment = (vetId) => {
//     const vet = emergencyVets.find(v => v.id === vetId);
//     setSelectedEmergencyVet(vet);
//     setEmergencyPaymentStep(1);

//     // Simulate payment processing
//     setTimeout(() => {
//       saveEmergencyConsultation(vet)
//         .then(() => {
//           setEmergencyPaymentStep(2);

//           // Add delay before starting video consultation
//           setTimeout(() => {
//             setShowEmergencyModal(false);
//             setEmergencyPaymentStep(0);

//             // Get the newly created appointment
//             const lastAppointment = appointments[0];
//             if (lastAppointment) {
//               setActiveAppointment(lastAppointment);
//               setShowVideoConsult(true);
//             }
//           }, 3000);
//         })
//         .catch(error => {
//           console.error('Error in emergency payment process:', error);
//           setEmergencyPaymentStep(0);
//         });
//     }, 2000);
//   };

//   const saveEmergencyConsultation = async (vet) => {
//     try {
//       // Create an emergency appointment
//       const db = getDatabase();
//       const appointmentsRef = ref(db, 'appointments');
//       const newAppointmentRef = push(appointmentsRef);

//       const now = new Date();
//       const dateString = now.toISOString().split('T')[0];
//       const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//       const appointmentData = {
//         userId: currentUser.uid,
//         userName: userData?.name || currentUser.email,
//         userEmail: currentUser.email,
//         userPhone: userData?.phone || '',
//         vetId: vet.id,
//         vetName: vet.name,
//         vetEmail: vet.email || '',
//         date: dateString,
//         time: timeString,
//         status: 'confirmed',
//         isEmergency: true,
//         amount: 1200, // Higher fee for emergency
//         createdAt: now.toISOString(),
//         reason: 'Emergency consultation',
//         notes: ''
//       };

//       await set(newAppointmentRef, appointmentData);

//       return {
//         id: newAppointmentRef.key,
//         ...appointmentData
//       };
//     } catch (error) {
//       console.error('Error creating emergency consultation:', error);
//       throw error;
//     }
//   };

//   const joinVideoConsultation = (appointment) => {
//     setActiveAppointment(appointment);
//     setShowVideoConsult(true);
//   };

//   const endVideoConsultation = () => {
//     setShowVideoConsult(false);
//     setActiveAppointment(null);
//   };

//   // Function to format date from ISO string
//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Dashboard tab view
//   const renderDashboard = () => {
//     return (
//       <>
//         {/* Dashboard Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//             <div className="flex items-center mb-4">
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 ml-3">Book Appointment</h3>
//             </div>
//             <p className="text-gray-600 mb-4">Schedule appointments with veterinarians for your pets</p>

//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//             <div className="flex items-center mb-4">
//               <div className="bg-red-100 p-3 rounded-full">
//                 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 ml-3">Emergency Consult</h3>
//             </div>
//             <p className="text-gray-600 mb-4">Get immediate help for pet emergencies</p>
//             <button
//               onClick={handleEmergencyConsult}
//               className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
//             >
//               Emergency Help
//             </button>
//           </div>

//           <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
//             <div className="flex items-center mb-4">
//               <div className="bg-green-100 p-3 rounded-full">
//                 <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 ml-3">Prescriptions</h3>
//             </div>
//             <p className="text-gray-600 mb-4">View and manage your pet's prescriptions</p>
//             <button
//               onClick={() => setActiveTab('prescriptions')}
//               className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
//             >
//               View Prescriptions
//             </button>
//           </div>
//         </div>

//         {/* Veterinarians Section */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           {/* <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">Our Veterinarians</h3>
//             <button
//               onClick={() => setActiveTab('veterinarians')}
//               className="text-white-600 hover:text-blue-700 font-medium text-sm"
//             >
//               View All
//             </button>
//           </div> */}


//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">Our Veterinarians</h3>
//             <button
//               onClick={() => {
//                 setShowAllVets(true);
//                 setActiveTab('profile');
//               }}
//               className="text-blue-600 hover:text-blue-700 font-medium text-sm"
//             >
//               View All
//             </button>
//           </div>

//           {vetLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : veterinarians.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {veterinarians.slice(0, 3).map((vet) => (
//                 <div key={vet.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
//                   <div className="bg-blue-600 p-4 text-center">
//                     <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
//                       <span className="text-xl font-bold text-blue-600">
//                         {vet.name ? vet.name.charAt(0).toUpperCase() : "V"}
//                       </span>
//                     </div>
//                     <h4 className="text-white font-semibold text-lg">{vet.name}</h4>
//                     <p className="text-blue-100 text-sm">{vet.specialization}</p>
//                   </div>
//                   <div className="p-4">
//                     <div className="flex items-center text-sm mb-2">
//                       <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                       <span className="text-gray-600">{vet.email}</span>
//                     </div>
//                     <div className="flex items-center text-sm mb-2">
//                       <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                       </svg>
//                       <span className="text-gray-600">{vet.phone || "Not available"}</span>
//                     </div>
//                     {vet.experience && (
//                       <div className="flex items-center text-sm">
//                         <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         <span className="text-gray-600">{vet.experience} {vet.experience === 1 ? "year" : "years"} experience</span>
//                       </div>
//                     )}
//                     <button
//                       onClick={() => handleBookAppointment(vet.id)}
//                       className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
//                     >
//                       Book Appointment
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//               <h4 className="text-lg font-medium text-gray-900">No Veterinarians Available</h4>
//               <p className="text-gray-600 mt-2">Please check back later for available veterinarians.</p>
//             </div>
//           )}
//         </div>

//         {/* Recent Appointments */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">Recent Appointments</h3>
//             <button
//               onClick={() => setActiveTab('appointments')}
//               className="text-white-600 hover:text-blue-700 font-medium text-sm"
//             >
//               View All
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-8">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : appointments.length > 0 ? (
//             <div className="space-y-4">
//               {appointments.slice(0, 3).map((appointment) => (
//                 <div key={appointment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
//                   <div className={`p-2 rounded-full mr-3 ${appointment.status === 'pending' ? 'bg-yellow-100' :
//                     appointment.status === 'confirmed' ? 'bg-green-100' :
//                       appointment.status === 'completed' ? 'bg-blue-100' :
//                         'bg-red-100'
//                     }`}>
//                     <svg className={`w-5 h-5 ${appointment.status === 'pending' ? 'text-yellow-600' :
//                       appointment.status === 'confirmed' ? 'text-green-600' :
//                         appointment.status === 'completed' ? 'text-blue-600' :
//                           'text-red-600'
//                       }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between">
//                       <p className="text-sm font-medium text-gray-900">
//                         Appointment with Dr. {appointment.vetName}
//                       </p>
//                       <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                           appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                             'bg-red-100 text-red-800'
//                         }`}>
//                         {appointment.status}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                       {new Date(appointment.date).toDateString()} at {appointment.time}
//                     </p>
//                     {appointment.status === 'confirmed' && (
//                       <button
//                         onClick={() => joinVideoConsultation(appointment)}
//                         className="mt-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
//                       >
//                         Join Video Consultation
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-4">
//               <p className="text-gray-600">No appointments scheduled yet.</p>
//               <button
//                 onClick={() => {
//                   setShowCalendar(true);
//                   setSelectedVet(veterinarians[0] || { name: 'Dr. Sarah Williams', specialization: 'General Veterinarian' });
//                 }}
//                 className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
//               >
//                 Book your first appointment
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Profile Section */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
//             <div className="space-x-3">
//               <button
//                 onClick={() => setActiveTab('appointments')}
//                 className="text-white-600 hover:text-blue-700 font-medium"
//               >
//                 View Appointments
//               </button>

//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Name</label>
//               <p className="mt-1 text-sm text-gray-900">{userData?.name || 'Not provided'}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <p className="mt-1 text-sm text-gray-900">{userData?.email || currentUser?.email}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone</label>
//               <p className="mt-1 text-sm text-gray-900">{userData?.phone || 'Not provided'}</p>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Address</label>
//               <p className="mt-1 text-sm text-gray-900">{userData?.address || 'Not provided'}</p>
//             </div>
//           </div>
//           <PetDetailsForm />
//         </div>
//       </>
//     );
//   };

//   // Appointments tab
//   const renderAppointments = () => {
//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>

//         {/* Filter Tabs */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">


//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : appointments.length > 0 ? (
//             <div className="divide-y divide-gray-200">
//               {appointments.map((appointment) => {
//                 const isPast = new Date(`${appointment.date} ${appointment.time}`) < new Date();

//                 return (
//                   <div key={appointment.id} className="p-6">
//                     <div className="flex flex-col md:flex-row md:justify-between md:items-center">
//                       <div className="mb-4 md:mb-0">
//                         <div className="flex items-center">
//                           <div className={`p-2 rounded-full mr-3 ${appointment.status === 'pending' ? 'bg-yellow-100' :
//                             appointment.status === 'confirmed' ? 'bg-green-100' :
//                               appointment.status === 'completed' ? 'bg-blue-100' :
//                                 'bg-red-100'
//                             }`}>
//                             <svg className={`w-5 h-5 ${appointment.status === 'pending' ? 'text-yellow-600' :
//                               appointment.status === 'confirmed' ? 'text-green-600' :
//                                 appointment.status === 'completed' ? 'text-blue-600' :
//                                   'text-red-600'
//                               }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                           <div>
//                             <h4 className="text-lg font-medium text-gray-900">
//                               Appointment with Dr. {appointment.vetName}
//                             </h4>
//                             <div className="flex items-center mt-1">
//                               <span className="text-sm text-gray-600 mr-3">
//                                 {new Date(appointment.date).toDateString()}
//                               </span>
//                               <span className="text-sm text-gray-600 mr-3">
//                                 {appointment.time}
//                               </span>
//                               <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                                 appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                                   appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                                     'bg-red-100 text-red-800'
//                                 }`}>
//                                 {appointment.status}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-3">
//                         {appointment.status === 'confirmed' && !isPast && (
//                           <button
//                             onClick={() => joinVideoConsultation(appointment)}
//                             className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
//                           >
//                             Join Consultation
//                           </button>
//                         )}
//                         {appointment.status === 'pending' && !isPast && (
//                           <button
//                             onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
//                             className="text-red-600 hover:text-red-800 text-sm font-medium"
//                           >
//                             Cancel
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     {/* Additional Details */}
//                     <div className="mt-4 pt-4 border-t border-gray-100">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                           <h5 className="text-xs font-medium text-gray-500 uppercase">Fee</h5>
//                           <p className="mt-1 text-sm font-medium text-gray-900">₹{appointment.amount}</p>
//                         </div>

//                         <div>
//                           <h5 className="text-xs font-medium text-gray-500 uppercase">Booked On</h5>
//                           <p className="mt-1 text-sm text-gray-900">
//                             {new Date(appointment.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>

//                         <div>
//                           <h5 className="text-xs font-medium text-gray-500 uppercase">Reference ID</h5>
//                           <p className="mt-1 text-sm text-gray-900">{appointment.id.slice(0, 8).toUpperCase()}</p>
//                         </div>
//                       </div>

//                       {appointment.status === 'completed' && (
//                         <div className="mt-4 flex justify-end">
//                           <button
//                             onClick={() => {
//                               setSelectedAppointmentForFeedback(appointment);
//                               setShowFeedbackForm(true);
//                             }}
//                             className="text-white-600 hover:text-white-800 text-sm font-medium"
//                           >
//                             Send Feedback
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
//               <p className="text-gray-500 mb-4">You don't have any appointments scheduled yet.</p>
//               <button
//                 onClick={() => {
//                   setShowCalendar(true);
//                   setSelectedVet(veterinarians[0] || { name: 'Dr. Sarah Williams', specialization: 'General Veterinarian' });
//                 }}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
//               >
//                 Book New Appointment
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Prescriptions tab
//   const renderPrescriptions = () => {
//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">My Prescriptions</h2>

//         {/* Cart notification message */}
//         {cartMessage.show && (
//           <div className={`p-3 rounded-lg ${cartMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//             {cartMessage.text}
//           </div>
//         )}

//         {/* Cart items display */}
//         {cartItems.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border p-4">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-lg font-semibold">Cart ({cartItems.length} items)</h3>
//               <button
//                 onClick={handleCheckout}
//                 className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
//               >
//                 Checkout
//               </button>
//             </div>

//             <div className="space-y-2 max-h-40 overflow-auto">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                   <div>
//                     <p className="font-medium">{item.medicineName}</p>
//                     <p className="text-xs text-gray-600">{item.dosage} - {item.duration}</p>
//                   </div>
//                   <button
//                     onClick={() => removeFromCart(item.id)}
//                     className="text-red-600 text-sm hover:text-red-800"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           {prescriptions.length > 0 ? (
//             <div className="space-y-6">
//               {prescriptions.map((prescription) => (
//                 <div key={prescription.id} className="border rounded-lg overflow-hidden">
//                   <div className="bg-blue-600 p-4 text-white">
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-semibold">Prescription from Dr. {prescription.vetName}</h3>
//                       <span className="text-sm bg-blue-500 px-2 py-1 rounded">
//                         {new Date(prescription.date).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="p-4">
//                     <div className="mb-4">
//                       <h4 className="text-sm font-medium text-gray-700 uppercase mb-2">Notes</h4>
//                       <p className="text-gray-800 bg-gray-50 p-3 rounded">{prescription.notes}</p>
//                     </div>

//                     {prescription.medicines && prescription.medicines.length > 0 && (
//                       <div>
//                         <h4 className="text-sm font-medium text-gray-700 uppercase mb-2">Medicines</h4>
//                         <div className="space-y-2">
//                           {prescription.medicines.map((medicine, index) => (
//                             <div key={index} className="bg-gray-50 p-3 rounded flex justify-between items-center">
//                               <div>
//                                 <p className="font-medium">{medicine.name}</p>
//                                 <div className="flex text-sm text-gray-600 mt-1">
//                                   <span className="mr-4">Dosage: {medicine.dosage}</span>
//                                   <span>Duration: {medicine.duration}</span>
//                                 </div>
//                               </div>

//                               {isOrdered(`${prescription.id}-${medicine.name}`) ? (
//                                 <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
//                                   Order Placed
//                                 </span>
//                               ) : isInCart(`${prescription.id}-${medicine.name}`) ? (
//                                 <button
//                                   onClick={() => removeFromCart(`${prescription.id}-${medicine.name}`)}
//                                   className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
//                                 >
//                                   Remove
//                                 </button>
//                               ) : (
//                                 <button
//                                   onClick={() => addToCart(prescription, medicine)}
//                                   className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
//                                 >
//                                   Add to Cart
//                                 </button>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions found</h3>
//               <p className="text-gray-500">You don't have any prescriptions yet.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };



//   // Booking view with calendar
//   const renderBookingView = () => {
//     return (
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Veterinarian info */}
//         <div className="bg-blue-600 p-6 text-white">
//           <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
//           {selectedVet && (
//             <div className="flex items-center">
//               <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
//                 {selectedVet.name.charAt(0).toUpperCase()}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-xl">{selectedVet.name}</h3>
//                 <p className="text-blue-100">{selectedVet.specialization}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Step 1: Select Date */}
//         {paymentStep === 0 && (
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>

//             {/* Month selector */}
//             <div className="mb-6 flex justify-between items-center">
//               <button className="text-blue-600 hover:text-blue-800">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//               <h4 className="text-lg font-medium">
//                 {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
//               </h4>
//               <button className="text-blue-600 hover:text-blue-800">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </button>
//             </div>

//             {/* Calendar grid */}
//             <div className="grid grid-cols-7 border-r border-b">
//               {/* Days of week */}
//               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//                 <div key={day} className="h-10 bg-gray-100 flex items-center justify-center font-medium border-t border-l">
//                   {day}
//                 </div>
//               ))}

//               {/* Calendar cells */}
//               {Array.from({ length: 42 }).map((_, index) => {
//                 const currentMonth = selectedDate.getMonth();
//                 const currentYear = selectedDate.getFullYear();
//                 const firstDay = new Date(currentYear, currentMonth, 1).getDay();
//                 const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

//                 const day = index - firstDay + 1;
//                 const isCurrentMonth = day > 0 && day <= lastDate;
//                 const date = new Date(currentYear, currentMonth, day);
//                 const isToday = isCurrentMonth && date.toDateString() === new Date().toDateString();
//                 const isSelected = isCurrentMonth && date.toDateString() === selectedDate.toDateString();
//                 const isPast = date < new Date().setHours(0, 0, 0, 0);

//                 return (
//                   <div
//                     key={index}
//                     onClick={() => isCurrentMonth && !isPast && handleSelectDate(date)}
//                     className={`h-12 border-t border-l p-1 ${!isCurrentMonth ? 'bg-gray-100 text-gray-400' :
//                       isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//                         isSelected ? 'bg-blue-100 border-2 border-blue-500 cursor-pointer' :
//                           isToday ? 'bg-yellow-50 cursor-pointer' :
//                             'hover:bg-blue-50 cursor-pointer'
//                       }`}
//                   >
//                     {isCurrentMonth && (
//                       <div className={`text-right ${isToday ? 'font-bold' : 'font-medium'}`}>{day}</div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Time slots */}
//             <div className="mt-6">
//               <h4 className="font-medium text-gray-900 mb-3">
//                 Available Time Slots for {selectedDate.toLocaleDateString()}
//               </h4>
//               {availableTimeSlots.length > 0 ? (
//                 <div className="grid grid-cols-4 gap-2">
//                   {availableTimeSlots.map((time) => (
//                     <div
//                       key={time}
//                       onClick={() => handleSelectTime(time)}
//                       className={`p-2 border rounded text-center cursor-pointer ${selectedTime === time ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
//                         }`}
//                     >
//                       {time}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-4 bg-gray-50 rounded">
//                   <p className="text-gray-500">No available slots for this date. Please select another date.</p>
//                 </div>
//               )}
//             </div>

//             {/* Payment section */}
//             <div className="mt-8 pt-6 border-t">
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h4 className="font-medium text-gray-900">Consultation Fee</h4>
//                   <p className="text-gray-600">Standard appointment (30 minutes)</p>
//                 </div>
//                 <span className="text-xl font-bold">₹800</span>
//               </div>

//               <button
//                 onClick={handlePayment}
//                 disabled={!selectedTime}
//                 className={`w-full py-3 rounded-lg font-medium ${selectedTime ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   } transition duration-300`}
//               >
//                 Pay Now
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Payment processing */}
//         {paymentStep === 1 && (
//           <div className="p-6 text-center py-12">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Payment</h3>
//             <p className="text-gray-600">Please wait while we process your payment...</p>
//           </div>
//         )}

//         {/* Payment success */}
//         {paymentStep === 2 && (
//           <div className="p-6 text-center py-12">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-green-600 mb-2">Payment Successful!</h3>
//             <p className="text-gray-600 mb-6">Your appointment has been scheduled successfully.</p>

//             <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto mb-6">
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Date:</span>
//                 <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Time:</span>
//                 <span className="font-medium">{selectedTime}</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Doctor:</span>
//                 <span className="font-medium">Dr. {selectedVet?.name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Status:</span>
//                 <span className="font-medium text-yellow-600">Pending</span>
//               </div>
//             </div>

//             <p className="text-sm text-gray-500">
//               Redirecting to dashboard in a few seconds...
//             </p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Video consultation component
//   const VideoConsultation = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col overflow-hidden">
//         <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
//           <div className="flex items-center">
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//             <h3 className="font-semibold">Consultation with Dr. {activeAppointment?.vetName}</h3>
//           </div>
//           <button
//             onClick={endVideoConsultation}
//             className="p-1 hover:bg-blue-700 rounded"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-4">
//           <div className="text-center text-white">
//             <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//             </svg>
//             <p className="font-medium text-xl mb-2">Video call in progress</p>
//             <p className="text-gray-400">Connected with Dr. {activeAppointment?.vetName}</p>
//           </div>
//         </div>

//         <div className="p-4 bg-gray-800 flex justify-center space-x-4">
//           <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-9.9m2.828 9.9a9 9 0 001.414-12.728" />
//             </svg>
//           </button>
//           <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//             </svg>
//           </button>
//           <button className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
//             </svg>
//           </button>
//           <button
//             onClick={endVideoConsultation}
//             className="p-3 bg-red-600 rounded-full hover:bg-red-700"
//           >
//             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Emergency modal
//   const EmergencyModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl w-full max-w-lg p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold text-gray-900">Emergency Consultation</h3>
//           <button
//             onClick={() => {
//               setShowEmergencyModal(false);
//               setEmergencyPaymentStep(0);
//               setSelectedEmergencyVet(null);
//             }}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {emergencyPaymentStep === 0 && (
//           <>
//             <div className="bg-red-50 p-4 rounded-lg mb-6">
//               <div className="flex items-start">
//                 <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//                 <div>
//                   <h4 className="font-medium text-red-800">Emergency Service</h4>
//                   <p className="text-sm text-red-700 mt-1">
//                     This service is for pet emergencies only. You will be connected to an available veterinarian immediately.
//                     The consultation fee for emergency services is ₹1200.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {emergencyVets.length > 0 ? (
//               <div className="space-y-4 mb-6">
//                 <h4 className="font-medium text-gray-900">Available Veterinarians</h4>
//                 {emergencyVets.map((vet) => (
//                   <div key={vet.id} className="border rounded-lg p-4 hover:bg-gray-50">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                           <span className="font-bold text-blue-600">{vet.name.charAt(0)}</span>
//                         </div>
//                         <div>
//                           <h5 className="font-medium">{vet.name}</h5>
//                           <p className="text-sm text-gray-600">{vet.specialization}</p>
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => handleEmergencyPayment(vet.id)}
//                         className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
//                       >
//                         Pay & Connect (₹1200)
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-6 mb-6">
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <h4 className="text-lg font-medium text-gray-900 mb-1">No Veterinarians Available</h4>
//                 <p className="text-gray-500">Sorry, there are no veterinarians available for emergency consultations at the moment.</p>
//               </div>
//             )}

//             <div className="flex justify-end">
//               <button
//                 onClick={() => setShowEmergencyModal(false)}
//                 className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         )}

//         {/* Payment processing */}
//         {emergencyPaymentStep === 1 && (
//           <div className="p-6 text-center py-12">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-6"></div>
//             <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Payment</h3>
//             <p className="text-gray-600">Please wait while we process your emergency consultation payment...</p>
//           </div>
//         )}

//         {/* Payment success */}
//         {emergencyPaymentStep === 2 && (
//           <div className="p-6 text-center py-12">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-green-600 mb-2">Payment Successful!</h3>
//             <p className="text-gray-600 mb-6">Your emergency consultation is being set up.</p>

//             <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto mb-6">
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Doctor:</span>
//                 <span className="font-medium">Dr. {selectedEmergencyVet?.name}</span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span className="text-gray-600">Amount Paid:</span>
//                 <span className="font-medium">₹1200</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Status:</span>
//                 <span className="font-medium text-green-600">Confirmed</span>
//               </div>
//             </div>

//             <p className="text-sm text-gray-500">
//               Connecting to video consultation in a few seconds...
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
//     try {
//       const db = getDatabase();
//       const appointmentRef = ref(db, `appointments/${appointmentId}`);

//       await update(appointmentRef, {
//         status: newStatus
//       });

//       // UI will update automatically through the onValue listener
//     } catch (error) {
//       console.error("Error updating appointment status:", error);
//     }
//   };

// if (showEcommerce) {
//   return (
//     <div>
//       <button 
//         onClick={() => setShowEcommerce(false)}
//         className="fixed top-4 left-4 z-50 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700"
//       >
//         Return to Pet-Vet Platform
//       </button>
//       <VetEcommercePlatform />
//     </div>
//   );
// }


//   return (
//     <div className="min-h-screen bg-gray-50">


//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold text-gray-900">Pet-Vet Platform</h1>
//               <button
//                 onClick={() => setShowEcommerce(true)}
//                 className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
//               >
//                 E-Commerce
//               </button>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-700">Welcome, {userData?.name || currentUser?.email}</span>
//               <button
//                 onClick={handleLogout}
//                 className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h2>
//           <p className="text-gray-600">Manage your pet care needs and appointments</p>
//         </div>

//         {/* Show Back Button when in Calendar/Booking Mode */}
//         {showCalendar && (
//           <div className="mb-4">
//             <button
//               onClick={() => { setShowCalendar(false); setPaymentStep(0); }}
//               className="flex items-center text-blue-600 hover:text-blue-800"
//             >
//               <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back to Dashboard
//             </button>
//           </div>
//         )}

//         {/* Tab Navigation - Only show when not in booking mode */}
//         {!showCalendar && (
//           <div className="flex border-b border-gray-200 mb-8 gap-4">
//             <button
//               className={`py-4 px-8 font-medium ${activeTab === 'dashboard'
//                 ? 'text-white-600 border-b-2 border-blue-600'
//                 : 'text-white-500 hover:text-gray-700'
//                 }`}
//               onClick={() => setActiveTab('dashboard')}
//             >
//               Dashboard
//             </button>
//             <button
//               className={`py-4 px-8 font-medium ${activeTab === 'appointments'
//                 ? 'text-white-600 border-b-2 border-blue-600'
//                 : 'text-white-500 hover:text-gray-700'
//                 }`}
//               onClick={() => setActiveTab('appointments')}
//             >
//               Appointments
//             </button>
//             <button
//               className={`py-4 px-8 font-medium ${activeTab === 'prescriptions'
//                 ? 'text-white-600 border-b-2 border-blue-600'
//                 : 'text-white-500 hover:text-gray-700'
//                 }`}
//               onClick={() => setActiveTab('prescriptions')}
//             >
//               Prescriptions
//             </button>
//             {/* <button
//               className={`py-4 px-8 font-medium ${activeTab === 'profile'
//                   ? 'text-white-600 border-b-2 border-blue-600'
//                   : 'text-white-500 hover:text-gray-700'
//                 }`}
//               onClick={() => setActiveTab('profile')}
//             >
//               Profile
//             </button> */}
//           </div>
//         )}

//         {/* Content */}
//         {showCalendar ? renderBookingView() : (
//           activeTab === 'dashboard' ? renderDashboard() :
//             activeTab === 'appointments' ? renderAppointments() :
//               activeTab === 'prescriptions' ? renderPrescriptions() :
//                activeTab === 'profile' && showAllVets ? renderAllVeterinarians() :
//                 <div className="bg-white rounded-lg shadow-md p-6 text-center">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h3>
//                   <p className="text-gray-600">This section is currently under development.</p>
//                 </div>
//         )}
//       </main>

//       {/* Video Consultation Modal */}
//       {showVideoConsult && activeAppointment && <VideoConsultation />}

//       {/* Emergency Modal */}
//       {showEmergencyModal && <EmergencyModal />}

//       {showFeedbackForm && selectedAppointmentForFeedback && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl w-full max-w-lg p-4 max-h-[90vh] overflow-y-auto">
//             <FeedbackForm
//               appointment={selectedAppointmentForFeedback}
//               onClose={() => {
//                 setShowFeedbackForm(false);
//                 setSelectedAppointmentForFeedback(null);
//               }}
//             />
//           </div>
//         </div>
//       )}


//     </div>
//   );
// };

// export default UserDashboard;




import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, set, push, update, query, orderByChild, equalTo } from 'firebase/database';
import PetDetailsForm from './PetDetailsForm';  // Adjust path as needed
import FeedbackForm from './FeedbackForm';      // Adjust path as needed
import ZegoVideoCall from './ZegoVideoCall';
import SimpleVideoCall from './SimpleVideoCall' // Adjust path as needed
let razorpayScriptLoaded = false;

/**
 * Loads the Razorpay SDK asynchronously
 * @returns {Promise} Resolves when script is loaded
 */
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    if (razorpayScriptLoaded) {
      // Script is loading, check again in 100ms
      const checkInterval = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      return;
    }

    razorpayScriptLoaded = true;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (error) => {
      razorpayScriptLoaded = false;
      reject(new Error('Failed to load Razorpay SDK'));
    };
    document.body.appendChild(script);
  });
};

const UserDashboard = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vetLoading, setVetLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [paymentStep, setPaymentStep] = useState(0); // 0: not started, 1: in progress, 2: success
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [showVideoConsult, setShowVideoConsult] = useState(false);
  const [emergencyVets, setEmergencyVets] = useState([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [emergencyPaymentStep, setEmergencyPaymentStep] = useState(0); // 0: not started, 1: in progress, 2: success
  const [selectedEmergencyVet, setSelectedEmergencyVet] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState({ show: false, type: '', text: '' });
  const [orderedItems, setOrderedItems] = useState([]);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedAppointmentForFeedback, setSelectedAppointmentForFeedback] = useState(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const addToCart = (prescription, medicine) => {
    const cartItem = {
      id: `${prescription.id}-${medicine.name}`,
      prescriptionId: prescription.id,
      medicineName: medicine.name,
      dosage: medicine.dosage,
      duration: medicine.duration,
      doctor: prescription.vetName,
      date: prescription.date
    };

    setCartItems([...cartItems, cartItem]);

    // Show success message
    setCartMessage({
      show: true,
      type: 'success',
      text: `${medicine.name} added to cart`
    });

    // Hide message after 3 seconds
    setTimeout(() => {
      setCartMessage({ show: false, type: '', text: '' });
    }, 3000);
  };

  const removeFromCart = (itemId) => {
    const item = cartItems.find(item => item.id === itemId);
    setCartItems(cartItems.filter(item => item.id !== itemId));

    // Show removal message
    setCartMessage({
      show: true,
      type: 'error',
      text: `${item.medicineName} removed from cart`
    });

    // Hide message after 3 seconds
    setTimeout(() => {
      setCartMessage({ show: false, type: '', text: '' });
    }, 3000);
  };

  const isInCart = (prescriptionId, medicineName) => {
    return cartItems.some(item =>
      item.prescriptionId === prescriptionId && item.medicineName === medicineName
    );
  };

  const handleCheckout = async () => {
    try {
      const db = getDatabase();
      const ordersRef = ref(db, 'orders');
      const newOrderRef = push(ordersRef);

      // Create order data
      const orderData = {
        userId: currentUser.uid,
        userName: userData?.name || currentUser.email,
        items: cartItems,
        totalItems: cartItems.length,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save to Firebase
      await set(newOrderRef, orderData);

      // Add all cart items to orderedItems
      setOrderedItems(prev => [...prev, ...cartItems]);

      // Show success message
      setCartMessage({
        show: true,
        type: 'success',
        text: 'Order placed successfully! Your medicines will be delivered soon.'
      });

      // Clear the cart
      setCartItems([]);

      // Hide message after 5 seconds
      setTimeout(() => {
        setCartMessage({ show: false, type: '', text: '' });
      }, 5000);
    } catch (error) {
      console.error("Error placing order:", error);
      setCartMessage({
        show: true,
        type: 'error',
        text: 'Failed to place order. Please try again.'
      });
    }
  };

  // Add a helper function to check if an item is ordered
  const isOrdered = (itemId) => {
    return orderedItems.some(item => item.id === itemId);
  };
  // Fetch veterinarians from Firebase
  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        setVetLoading(true);
        const db = getDatabase();
        const veterinaryRef = ref(db, 'veterinary');

        onValue(veterinaryRef, (snapshot) => {
          const vets = [];
          const availableForEmergency = [];

          snapshot.forEach((childSnapshot) => {
            // Only include active veterinarians
            const vetData = childSnapshot.val();
            if (vetData.status === 'active') {
              const vetWithId = {
                id: childSnapshot.key,
                ...vetData
              };

              vets.push(vetWithId);

              // Check if available for emergency
              if (vetData.emergencyAvailable) {
                availableForEmergency.push(vetWithId);
              }
            }
          });

          setVeterinarians(vets);
          setEmergencyVets(availableForEmergency);
          setVetLoading(false);
        });
      } catch (error) {
        console.error("Error fetching veterinarians:", error);
        setVetLoading(false);
      }
    };

    fetchVeterinarians();
  }, []);

  // Fetch user's appointments
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const db = getDatabase();
      const appointmentsRef = ref(db, 'appointments');

      onValue(appointmentsRef, (snapshot) => {
        const userAppointments = [];
        snapshot.forEach((childSnapshot) => {
          const appointment = childSnapshot.val();
          if (appointment.userId === currentUser.uid) {
            userAppointments.push({
              id: childSnapshot.key,
              ...appointment
            });
          }
        });

        // Sort by date (newest first)
        userAppointments.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        });

        setAppointments(userAppointments);
        setLoading(false);
      });
    }
  }, [currentUser]);

  // Fetch prescriptions
  useEffect(() => {
    if (currentUser) {
      const db = getDatabase();
      const prescriptionsRef = ref(db, 'prescriptions');

      onValue(prescriptionsRef, (snapshot) => {
        const userPrescriptions = [];
        snapshot.forEach((childSnapshot) => {
          const prescription = childSnapshot.val();
          if (prescription.userId === currentUser.uid) {
            userPrescriptions.push({
              id: childSnapshot.key,
              ...prescription
            });
          }
        });

        // Sort by date (newest first)
        userPrescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));

        setPrescriptions(userPrescriptions);
      });
    }
  }, [currentUser]);

  // Fetch available time slots when vet and date are selected
  useEffect(() => {
    if (selectedVet && selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedVet, selectedDate]);

  // Replace the current useEffect for loading Razorpay
  useEffect(() => {
    loadRazorpayScript()
      .then(() => {
        setRazorpayReady(true);
        console.log("Razorpay SDK loaded successfully");
      })
      .catch(error => {
        console.error("Failed to load Razorpay SDK:", error);
        alert("Payment system couldn't be initialized. Please try again later.");
      });

    // No cleanup needed for this implementation
  }, []);



  const fetchAvailableTimeSlots = () => {
    if (!selectedVet || !selectedDate) return;

    try {
      const db = getDatabase();

      // Get vet's time slots configuration
      const vetRef = ref(db, `veterinary/${selectedVet.id}`);
      onValue(vetRef, (snapshot) => {
        if (snapshot.exists()) {
          const vetData = snapshot.val();
          const timeSlots = vetData.timeSlots || {};

          // Get day of week from selected date
          const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const dayOfWeek = days[selectedDate.getDay()];

          // Get available hours for that day
          const daySlots = timeSlots[dayOfWeek] || {};

          // Convert to time strings (9:00 AM, etc.)
          const availableSlots = [];
          for (const [hour, available] of Object.entries(daySlots)) {
            if (available) {
              const hourNum = parseInt(hour);
              const timeString = hourNum < 12
                ? `${hourNum}:00 AM`
                : hourNum === 12
                  ? '12:00 PM'
                  : `${hourNum - 12}:00 PM`;

              availableSlots.push(timeString);

              // Also add half-hour slots
              const halfHourString = hourNum < 12
                ? `${hourNum}:30 AM`
                : hourNum === 12
                  ? '12:30 PM'
                  : `${hourNum - 12}:30 PM`;

              availableSlots.push(halfHourString);
            }
          }

          // Now check against existing appointments
          const appointmentsRef = ref(db, 'appointments');
          const dateString = selectedDate.toISOString().split('T')[0];

          onValue(appointmentsRef, (snapshot) => {
            const bookedSlots = [];

            snapshot.forEach((childSnapshot) => {
              const appointment = childSnapshot.val();
              if (appointment.vetId === selectedVet.id && appointment.date === dateString) {
                bookedSlots.push(appointment.time);
              }
            });

            // Filter out booked slots
            const availableTimes = availableSlots.filter(slot => !bookedSlots.includes(slot));
            setAvailableTimeSlots(availableTimes);
          });
        }
      });
    } catch (error) {
      console.error("Error fetching available time slots:", error);
    }
  };

const handleLogout = async () => {
  try {
    console.log("EMERGENCY LOGOUT: Starting forced logout process");
    
    // 1. Set a permanent flag in localStorage (not sessionStorage which gets cleared)
    localStorage.setItem('FORCE_LOGOUT', 'true');
    
    // 2. Mark the session as inactive directly in Firebase
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      try {
        const db = getDatabase();
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
      logout();
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
  const handleBookAppointment = (vetId) => {
    const selectedVet = veterinarians.find(vet => vet.id === vetId);
    setSelectedVet(selectedVet);
    setShowCalendar(true);
    setSelectedDate(new Date());
    setSelectedTime('');
    setPaymentStep(0);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleSelectTime = (time) => {
    setSelectedTime(time);
  };


  const handlePayment = () => {
    if (!selectedVet || !selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    if (!razorpayReady) {
      alert("Payment system is initializing. Please try again in a moment.");
      return;
    }

    setPaymentStep(1); // Show processing state


    const createPendingAppointment = async () => {
      try {
        const db = getDatabase();
        const dateString = selectedDate.toISOString().split('T')[0];
        const appointmentsRef = ref(db, 'appointments');
        const newAppointmentRef = push(appointmentsRef);

        const pendingAppointment = {
          userId: currentUser.uid,
          userName: userData?.name || currentUser.email,
          userEmail: currentUser.email,
          userPhone: userData?.phone || '',
          vetId: selectedVet.id,
          vetName: selectedVet.name,
          vetEmail: selectedVet.email || '',
          date: dateString,
          time: selectedTime,
          status: 'payment_pending',
          amount: 800,
          createdAt: new Date().toISOString(),
          reason: '',
          notes: ''
        };

        await set(newAppointmentRef, pendingAppointment);
        return newAppointmentRef.key;
      } catch (error) {
        console.error('Error creating pending appointment:', error);
        throw error;
      }
    };

    // 2. Process payment with Razorpay
    createPendingAppointment()
      .then(appointmentId => {
        // In a real app, your backend would create a Razorpay order and return the order_id
        // For demo, we'll create the options directly
        const options = {
          key: 'rzp_test_psQiRu5RCF99Dp', // Replace with your actual key
          amount: 80000, // in paise (800 INR)
          currency: 'INR',
          name: 'Pet-Vet Platform',
          description: `Appointment with Dr. ${selectedVet.name}`,
          // order_id would come from your backend in production
          // Creating one here just for demo (this won't work in production)
          // order_id: 'order_' + Math.random().toString(36).substring(2, 15),
          prefill: {
            name: userData?.name || currentUser.email,
            email: currentUser.email,
            contact: userData?.phone || ''
          },
          notes: {
            appointmentId: appointmentId,
            vetId: selectedVet.id,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime
          },
          theme: {
            color: '#2563EB' // Blue color that matches your UI
          },
          handler: function (response) {
            // Payment successful
            const paymentId = response.razorpay_payment_id;

            // Update the appointment with payment info
            updateAppointmentAfterPayment(appointmentId, paymentId, 'confirmed')
              .then(() => {
                setPaymentStep(2); // Show success state

                // Add delay before redirecting back to dashboard
                setTimeout(() => {
                  setShowCalendar(false);
                  setSelectedVet(null);
                  setSelectedTime('');
                  setPaymentStep(0);
                  setActiveTab('dashboard');
                }, 3000);
              })
              .catch(error => {
                console.error('Error updating appointment:', error);
                // Still show success since payment went through
                // but notify about the error
                setPaymentStep(2);
                alert('Payment successful, but there was an issue updating your appointment. Our team will fix this shortly.');
              });
          },
          modal: {
            ondismiss: function () {
              console.log('Payment modal closed');
              setPaymentStep(0); // Reset payment step
              // User canceled, mark appointment as abandoned or delete it
              deleteOrMarkAppointment(appointmentId, 'abandoned');
            }
          }
        };

        // Create and open Razorpay instance
        try {
          const razorpayInstance = new window.Razorpay(options);

          // Add payment failed handler
          razorpayInstance.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            setPaymentStep(0); // Reset payment step
            alert(`Payment failed: ${response.error.description}`);
            // Mark appointment as payment_failed
            updateAppointmentAfterPayment(appointmentId, null, 'payment_failed');
          });

          // Open payment form
          razorpayInstance.open();
        } catch (error) {
          console.error('Error initializing Razorpay:', error);
          setPaymentStep(0);
          alert('Could not initialize payment. Please try again later.');
          // Delete the pending appointment
          deleteOrMarkAppointment(appointmentId, 'error');
        }
      })
      .catch(error => {
        console.error('Error in payment process:', error);
        setPaymentStep(0);
        alert('There was an error starting the payment process. Please try again.');
      });
  };
  const deleteOrMarkAppointment = async (appointmentId, reason) => {
    try {
      const db = getDatabase();
      const appointmentRef = ref(db, `appointments/${appointmentId}`);

      if (reason === 'error') {
        // Delete appointment created in error
        await set(appointmentRef, null);
      } else {
        // Mark as abandoned or payment failed
        await update(appointmentRef, {
          status: reason,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(`Error ${reason === 'error' ? 'deleting' : 'updating'} appointment:`, error);
      // Don't throw, as this is a background operation
    }
  };

  const updateAppointmentAfterPayment = async (appointmentId, paymentId, newStatus) => {
    try {
      const db = getDatabase();
      const appointmentRef = ref(db, `appointments/${appointmentId}`);

      await update(appointmentRef, {
        paymentId: paymentId || null,
        paymentStatus: paymentId ? 'completed' : 'failed',
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error updating appointment after payment:', error);
      throw error;
    }
  };
  const saveAppointment = async (paymentId = null) => {
    if (!currentUser || !selectedVet || !selectedDate || !selectedTime) {
      console.error('Missing required information for appointment');
      return false;
    }

    try {
      const db = getDatabase();

      // Format date to YYYY-MM-DD
      const dateString = selectedDate.toISOString().split('T')[0];

      // Generate a unique ID for the appointment
      const appointmentsRef = ref(db, 'appointments');
      const newAppointmentRef = push(appointmentsRef);

      // Create appointment data
      const appointmentData = {
        userId: currentUser.uid,
        userName: userData?.name || currentUser.email,
        userEmail: currentUser.email,
        userPhone: userData?.phone || '',
        vetId: selectedVet.id,
        vetName: selectedVet.name,
        vetEmail: selectedVet.email || '',
        date: dateString,
        time: selectedTime,
        status: 'pending',
        amount: 800,
        paymentId: paymentId, // Add payment ID to record
        paymentStatus: paymentId ? 'completed' : 'pending',
        createdAt: new Date().toISOString(),
        reason: '',
        notes: ''
      };

      // Save to Firebase
      await set(newAppointmentRef, appointmentData);
      return true;
    } catch (error) {
      console.error('Error saving appointment:', error);
      return false;
    }
  };


  const handleEmergencyConsult = () => {
    if (emergencyVets.length === 0) {
      alert('No veterinarians are currently available for emergency consultations.');
      return;
    }

    setShowEmergencyModal(true);
    setEmergencyPaymentStep(0);
    setSelectedEmergencyVet(null);
  };

  const handleEmergencyPayment = (vetId) => {
    const vet = emergencyVets.find(v => v.id === vetId);
    if (!vet) {
      alert('Selected veterinarian is not available. Please try another.');
      return;
    }

    if (!razorpayReady) {
      alert("Payment system is initializing. Please try again in a moment.");
      return;
    }

    setSelectedEmergencyVet(vet);
    setEmergencyPaymentStep(1);

    // Create a pending emergency appointment first
    const createPendingEmergencyAppointment = async () => {
      try {
        const db = getDatabase();
        const now = new Date();
        const dateString = now.toISOString().split('T')[0];
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const appointmentsRef = ref(db, 'appointments');
        const newAppointmentRef = push(appointmentsRef);

        const pendingAppointment = {
          userId: currentUser.uid,
          userName: userData?.name || currentUser.email,
          userEmail: currentUser.email,
          userPhone: userData?.phone || '',
          vetId: vet.id,
          vetName: vet.name,
          vetEmail: vet.email || '',
          date: dateString,
          time: timeString,
          status: 'payment_pending',
          isEmergency: true,
          amount: 1200, // Higher fee for emergency
          createdAt: now.toISOString(),
          reason: 'Emergency consultation',
          notes: ''
        };

        await set(newAppointmentRef, pendingAppointment);
        return newAppointmentRef.key;
      } catch (error) {
        console.error('Error creating pending emergency appointment:', error);
        throw error;
      }
    };

    createPendingEmergencyAppointment()
      .then(appointmentId => {
        // Create Razorpay options
        const options = {
          key: 'rzp_test_psQiRu5RCF99Dp', // Replace with your actual key
          amount: 120000, // in paise (1200 INR for emergency)
          currency: 'INR',
          name: 'Pet-Vet Platform',
          description: `Emergency Consultation with Dr. ${vet.name}`,
          prefill: {
            name: userData?.name || currentUser.email,
            email: currentUser.email,
            contact: userData?.phone || ''
          },
          notes: {
            appointmentId: appointmentId,
            vetId: vet.id,
            isEmergency: 'true'
          },
          theme: {
            color: '#DC2626' // Red color for emergency
          },
          handler: function (response) {
            // Payment successful
            const paymentId = response.razorpay_payment_id;

            // Update appointment with payment info
            updateAppointmentAfterPayment(appointmentId, paymentId, 'confirmed')
              .then(() => {
                setEmergencyPaymentStep(2);

                // Add delay before starting video consultation
                setTimeout(() => {
                  setShowEmergencyModal(false);
                  setEmergencyPaymentStep(0);

                  // Fetch the updated appointment
                  const db = getDatabase();
                  const appointmentRef = ref(db, `appointments/${appointmentId}`);

                  onValue(appointmentRef, (snapshot) => {
                    if (snapshot.exists()) {
                      const appointment = {
                        id: snapshot.key,
                        ...snapshot.val()
                      };
                      setActiveAppointment(appointment);
                      setShowVideoConsult(true);
                    }
                  }, { onlyOnce: true });
                }, 3000);
              })
              .catch(error => {
                console.error('Error updating emergency appointment:', error);
                // Still show success since payment went through
                setEmergencyPaymentStep(2);
                alert('Payment successful, but there was an issue updating your emergency consultation. Our team is notified and will contact you shortly.');
              });
          },
          modal: {
            ondismiss: function () {
              setEmergencyPaymentStep(0);
              // User canceled, mark appointment as abandoned
              deleteOrMarkAppointment(appointmentId, 'abandoned');
            }
          }
        };

        // Create and open Razorpay instance
        try {
          const razorpayInstance = new window.Razorpay(options);

          // Add payment failed handler
          razorpayInstance.on('payment.failed', function (response) {
            console.error('Emergency payment failed:', response.error);
            setEmergencyPaymentStep(0);
            alert(`Payment failed: ${response.error.description}`);
            // Mark appointment as payment_failed
            updateAppointmentAfterPayment(appointmentId, null, 'payment_failed');
          });

          // Open payment form
          razorpayInstance.open();
        } catch (error) {
          console.error('Error initializing Razorpay for emergency:', error);
          setEmergencyPaymentStep(0);
          alert('Could not initialize emergency payment. Please try again.');
          // Delete the pending appointment
          deleteOrMarkAppointment(appointmentId, 'error');
        }
      })
      .catch(error => {
        console.error('Error in emergency payment process:', error);
        setEmergencyPaymentStep(0);
        alert('There was an error starting the emergency payment. Please try again.');
      });
  };
  const saveEmergencyConsultation = async (vet, paymentId = null) => {
    try {
      // Create an emergency appointment
      const db = getDatabase();
      const appointmentsRef = ref(db, 'appointments');
      const newAppointmentRef = push(appointmentsRef);

      const now = new Date();
      const dateString = now.toISOString().split('T')[0];
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const appointmentData = {
        userId: currentUser.uid,
        userName: userData?.name || currentUser.email,
        userEmail: currentUser.email,
        userPhone: userData?.phone || '',
        vetId: vet.id,
        vetName: vet.name,
        vetEmail: vet.email || '',
        date: dateString,
        time: timeString,
        status: 'confirmed',
        isEmergency: true,
        amount: 1200, // Higher fee for emergency
        paymentId: paymentId, // Add payment ID
        paymentStatus: paymentId ? 'completed' : 'pending',
        createdAt: now.toISOString(),
        reason: 'Emergency consultation',
        notes: ''
      };

      await set(newAppointmentRef, appointmentData);

      return {
        id: newAppointmentRef.key,
        ...appointmentData
      };
    } catch (error) {
      console.error('Error creating emergency consultation:', error);
      throw error;
    }
  };

  // const joinVideoConsultation = (appointment) => {
  //   setActiveAppointment(appointment);
  //   setShowVideoConsult(true);
  // };

  const joinVideoConsultation = (appointment) => {
    setActiveAppointment(appointment);
    setShowVideoConsult(true);
  };
  // 
  // const endVideoConsultation = () => {
  //   setShowVideoConsult(false);
  //   setActiveAppointment(null);
  // };


  const endVideoConsultation = () => {
    setShowVideoConsult(false);
    setActiveAppointment(null);
  };
  // Function to format date from ISO string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Dashboard tab view
  const renderDashboard = () => {
    return (
      <>
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Book Appointment</h3>
            </div>
            <p className="text-gray-600 mb-4">Schedule appointments with veterinarians for your pets</p>

          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Emergency Consult</h3>
            </div>
            <p className="text-gray-600 mb-4">Get immediate help for pet emergencies</p>
            <button
              onClick={handleEmergencyConsult}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Emergency Help
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Prescriptions</h3>
            </div>
            <p className="text-gray-600 mb-4">View and manage your pet's prescriptions</p>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              View Prescriptions
            </button>
          </div>
        </div>






        {/* Veterinarians Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Our Veterinarians</h3>
            <button
              onClick={() => setActiveTab('veterinarians')}
              className="text-white-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </button>
          </div>

          {vetLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : veterinarians.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {veterinarians.slice(0, 3).map((vet) => (
                <div key={vet.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="bg-blue-600 p-4 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl font-bold text-blue-600">
                        {vet.name ? vet.name.charAt(0).toUpperCase() : "V"}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold text-lg">{vet.name}</h4>
                    <p className="text-blue-100 text-sm">{vet.specialization}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-sm mb-2">
                      <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{vet.email}</span>
                    </div>
                    <div className="flex items-center text-sm mb-2">
                      <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-600">{vet.phone || "Not available"}</span>
                    </div>
                    {vet.experience && (
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-600">{vet.experience} {vet.experience === 1 ? "year" : "years"} experience</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleBookAppointment(vet.id)}
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900">No Veterinarians Available</h4>
              <p className="text-gray-600 mt-2">Please check back later for available veterinarians.</p>
            </div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Appointments</h3>
            <button
              onClick={() => setActiveTab('appointments')}
              className="text-white-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full mr-3 ${appointment.status === 'pending' ? 'bg-yellow-100' :
                    appointment.status === 'confirmed' ? 'bg-green-100' :
                      appointment.status === 'completed' ? 'bg-blue-100' :
                        'bg-red-100'
                    }`}>
                    <svg className={`w-5 h-5 ${appointment.status === 'pending' ? 'text-yellow-600' :
                      appointment.status === 'confirmed' ? 'text-green-600' :
                        appointment.status === 'completed' ? 'text-blue-600' :
                          'text-red-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Appointment with Dr. {appointment.vetName}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.date).toDateString()} at {appointment.time}
                    </p>
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => joinVideoConsultation(appointment)}
                        className="mt-2 text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Join Video Consultation
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">No appointments scheduled yet.</p>
              <button
                onClick={() => {
                  setShowCalendar(true);
                  setSelectedVet(veterinarians[0] || { name: 'Dr. Sarah Williams', specialization: 'General Veterinarian' });
                }}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Book your first appointment
              </button>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
            <div className="space-x-3">
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-white-600 hover:text-blue-700 font-medium"
              >
                View Appointments
              </button>

            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{userData?.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{userData?.email || currentUser?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{userData?.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{userData?.address || 'Not provided'}</p>
            </div>
          </div>
          <PetDetailsForm />
        </div>
      </>
    );
  };

  // Appointments tab
  const renderAppointments = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">


          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {appointments.map((appointment) => {
                const isPast = new Date(`${appointment.date} ${appointment.time}`) < new Date();

                return (
                  <div key={appointment.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${appointment.status === 'pending' ? 'bg-yellow-100' :
                            appointment.status === 'confirmed' ? 'bg-green-100' :
                              appointment.status === 'completed' ? 'bg-blue-100' :
                                'bg-red-100'
                            }`}>
                            <svg className={`w-5 h-5 ${appointment.status === 'pending' ? 'text-yellow-600' :
                              appointment.status === 'confirmed' ? 'text-green-600' :
                                appointment.status === 'completed' ? 'text-blue-600' :
                                  'text-red-600'
                              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              Appointment with Dr. {appointment.vetName}
                            </h4>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-gray-600 mr-3">
                                {new Date(appointment.date).toDateString()}
                              </span>
                              <span className="text-sm text-gray-600 mr-3">
                                {appointment.time}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {appointment.status === 'confirmed' && !isPast && (
                          <button
                            onClick={() => joinVideoConsultation(appointment)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Join Consultation
                          </button>
                        )}
                        {appointment.status === 'pending' && !isPast && (
                          <button
                            onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 uppercase">Fee</h5>
                          <p className="mt-1 text-sm font-medium text-gray-900">₹{appointment.amount}</p>
                        </div>

                        <div>
                          <h5 className="text-xs font-medium text-gray-500 uppercase">Booked On</h5>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(appointment.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div>
                          <h5 className="text-xs font-medium text-gray-500 uppercase">Reference ID</h5>
                          <p className="mt-1 text-sm text-gray-900">{appointment.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                      </div>

                      {appointment.status === 'completed' && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedAppointmentForFeedback(appointment);
                              setShowFeedbackForm(true);
                            }}
                            className="text-white-600 hover:text-white-800 text-sm font-medium"
                          >
                            Send Feedback
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
              <p className="text-gray-500 mb-4">You don't have any appointments scheduled yet.</p>
              <button
                onClick={() => {
                  setShowCalendar(true);
                  setSelectedVet(veterinarians[0] || { name: 'Dr. Sarah Williams', specialization: 'General Veterinarian' });
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Book New Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };


  // Veterinarians tab
  const renderVeterinarians = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Our Veterinarians</h2>

        {vetLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : veterinarians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {veterinarians.map((vet) => (
              <div key={vet.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-blue-600 p-4 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-blue-600">
                      {vet.name ? vet.name.charAt(0).toUpperCase() : "V"}
                    </span>
                  </div>
                  <h4 className="text-white font-semibold text-lg">{vet.name}</h4>
                  <p className="text-blue-100 text-sm">{vet.specialization}</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center text-sm mb-2">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">{vet.email}</span>
                  </div>
                  <div className="flex items-center text-sm mb-2">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{vet.phone || "Not available"}</span>
                  </div>
                  {vet.experience && (
                    <div className="flex items-center text-sm mb-2">
                      <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{vet.experience} {vet.experience === 1 ? "year" : "years"} experience</span>
                    </div>
                  )}
                  {vet.emergencyAvailable && (
                    <div className="flex items-center text-sm mb-2">
                      <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-red-600">Available for emergencies</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleBookAppointment(vet.id)}
                    className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900">No Veterinarians Available</h4>
            <p className="text-gray-600 mt-2">Please check back later for available veterinarians.</p>
          </div>
        )}
      </div>
    );
  };


  // Prescriptions tab
  const renderPrescriptions = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Prescriptions</h2>

        {/* Cart notification message */}
        {cartMessage.show && (
          <div className={`p-3 rounded-lg ${cartMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {cartMessage.text}
          </div>
        )}

        {/* Cart items display */}
        {cartItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Cart ({cartItems.length} items)</h3>
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
              >
                Checkout
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.medicineName}</p>
                    <p className="text-xs text-gray-600">{item.dosage} - {item.duration}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border p-6">
          {prescriptions.length > 0 ? (
            <div className="space-y-6">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-blue-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Prescription from Dr. {prescription.vetName}</h3>
                      <span className="text-sm bg-blue-500 px-2 py-1 rounded">
                        {new Date(prescription.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 uppercase mb-2">Notes</h4>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded">{prescription.notes}</p>
                    </div>

                    {prescription.medicines && prescription.medicines.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 uppercase mb-2">Medicines</h4>
                        <div className="space-y-2">
                          {prescription.medicines.map((medicine, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                              <div>
                                <p className="font-medium">{medicine.name}</p>
                                <div className="flex text-sm text-gray-600 mt-1">
                                  <span className="mr-4">Dosage: {medicine.dosage}</span>
                                  <span>Duration: {medicine.duration}</span>
                                </div>
                              </div>

                              {isOrdered(`${prescription.id}-${medicine.name}`) ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                                  Order Placed
                                </span>
                              ) : isInCart(`${prescription.id}-${medicine.name}`) ? (
                                <button
                                  onClick={() => removeFromCart(`${prescription.id}-${medicine.name}`)}
                                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                                >
                                  Remove
                                </button>
                              ) : (
                                <button
                                  onClick={() => addToCart(prescription, medicine)}
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                                >
                                  Add to Cart
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No prescriptions found</h3>
              <p className="text-gray-500">You don't have any prescriptions yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };



  // Booking view with calendar
  const renderBookingView = () => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Veterinarian info */}
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
          {selectedVet && (
            <div className="flex items-center">
              <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                {selectedVet.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-xl">{selectedVet.name}</h3>
                <p className="text-blue-100">{selectedVet.specialization}</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 1: Select Date */}
        {paymentStep === 0 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>

            {/* Month selector */}
            <div className="mb-6 flex justify-between items-center">
              <button className="text-blue-600 hover:text-blue-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h4 className="text-lg font-medium">
                {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h4>
              <button className="text-blue-600 hover:text-blue-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 border-r border-b">
              {/* Days of week */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="h-10 bg-gray-100 flex items-center justify-center font-medium border-t border-l">
                  {day}
                </div>
              ))}

              {/* Calendar cells */}
              {Array.from({ length: 42 }).map((_, index) => {
                const currentMonth = selectedDate.getMonth();
                const currentYear = selectedDate.getFullYear();
                const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

                const day = index - firstDay + 1;
                const isCurrentMonth = day > 0 && day <= lastDate;
                const date = new Date(currentYear, currentMonth, day);
                const isToday = isCurrentMonth && date.toDateString() === new Date().toDateString();
                const isSelected = isCurrentMonth && date.toDateString() === selectedDate.toDateString();
                const isPast = date < new Date().setHours(0, 0, 0, 0);

                return (
                  <div
                    key={index}
                    onClick={() => isCurrentMonth && !isPast && handleSelectDate(date)}
                    className={`h-12 border-t border-l p-1 ${!isCurrentMonth ? 'bg-gray-100 text-gray-400' :
                      isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                        isSelected ? 'bg-blue-100 border-2 border-blue-500 cursor-pointer' :
                          isToday ? 'bg-yellow-50 cursor-pointer' :
                            'hover:bg-blue-50 cursor-pointer'
                      }`}
                  >
                    {isCurrentMonth && (
                      <div className={`text-right ${isToday ? 'font-bold' : 'font-medium'}`}>{day}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time slots */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Available Time Slots for {selectedDate.toLocaleDateString()}
              </h4>
              {availableTimeSlots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableTimeSlots.map((time) => (
                    <div
                      key={time}
                      onClick={() => handleSelectTime(time)}
                      className={`p-2 border rounded text-center cursor-pointer ${selectedTime === time ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                        }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded">
                  <p className="text-gray-500">No available slots for this date. Please select another date.</p>
                </div>
              )}
            </div>

            {/* Payment section */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">Consultation Fee</h4>
                  <p className="text-gray-600">Standard appointment (30 minutes)</p>
                </div>
                <span className="text-xl font-bold">₹800</span>
              </div>

              <button
                onClick={handlePayment}
                disabled={!selectedTime}
                className={`w-full py-3 rounded-lg font-medium ${selectedTime ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition duration-300`}
              >
                Pay Now
              </button>
            </div>
          </div>
        )}

        {/* Payment processing */}
        {paymentStep === 1 && (
          <div className="p-6 text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        )}

        {/* Payment success */}
        {paymentStep === 2 && (
          <div className="p-6 text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your appointment has been scheduled successfully.</p>

            <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">Dr. {selectedVet?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-yellow-600">Pending</span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Redirecting to dashboard in a few seconds...
            </p>
          </div>
        )}
      </div>
    );
  };

  // Video consultation component
  const VideoConsultation = () => (
    <div className=" fixed inset-0 bg-gray-900 rounded-lg shadow-lg w-full max-w-xl mx-auto my-8">
      <SimpleVideoCall
        appointmentId={activeAppointment?.id || 'default-room'}
        userId={currentUser?.uid || 'user-' + Date.now()}
        userName={userData?.name || currentUser?.email || 'User'}
        onEndCall={endVideoConsultation}
      />
    </div>
  );

  // Emergency modal
  const EmergencyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Emergency Consultation</h3>
          <button
            onClick={() => {
              setShowEmergencyModal(false);
              setEmergencyPaymentStep(0);
              setSelectedEmergencyVet(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {emergencyPaymentStep === 0 && (
          <>
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="font-medium text-red-800">Emergency Service</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This service is for pet emergencies only. You will be connected to an available veterinarian immediately.
                    The consultation fee for emergency services is ₹1200.
                  </p>
                </div>
              </div>
            </div>

            {emergencyVets.length > 0 ? (
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-900">Available Veterinarians</h4>
                {emergencyVets.map((vet) => (
                  <div key={vet.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="font-bold text-blue-600">{vet.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h5 className="font-medium">{vet.name}</h5>
                          <p className="text-sm text-gray-600">{vet.specialization}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEmergencyPayment(vet.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Pay & Connect (₹1200)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 mb-6">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-900 mb-1">No Veterinarians Available</h4>
                <p className="text-gray-500">Sorry, there are no veterinarians available for emergency consultations at the moment.</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Payment processing */}
        {emergencyPaymentStep === 1 && (
          <div className="p-6 text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-6"></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your emergency consultation payment...</p>
          </div>
        )}

        {/* Payment success */}
        {emergencyPaymentStep === 2 && (
          <div className="p-6 text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your emergency consultation is being set up.</p>

            <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">Dr. {selectedEmergencyVet?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">₹1200</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Confirmed</span>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Connecting to video consultation in a few seconds...
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      const db = getDatabase();
      const appointmentRef = ref(db, `appointments/${appointmentId}`);

      await update(appointmentRef, {
        status: newStatus
      });

      // UI will update automatically through the onValue listener
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Pet-Vet Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {userData?.name || currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h2>
          <p className="text-gray-600">Manage your pet care needs and appointments</p>
        </div>

        {/* Show Back Button when in Calendar/Booking Mode */}
        {showCalendar && (
          <div className="mb-4">
            <button
              onClick={() => { setShowCalendar(false); setPaymentStep(0); }}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Tab Navigation - Only show when not in booking mode */}
        {!showCalendar && (
          <div className="flex border-b border-gray-200 mb-8 gap-4">
            <button
              className={`py-4 px-8 font-medium ${activeTab === 'dashboard'
                ? 'text-white-600 border-b-2 border-blue-600'
                : 'text-white-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`py-4 px-8 font-medium ${activeTab === 'appointments'
                ? 'text-white-600 border-b-2 border-blue-600'
                : 'text-white-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button
              className={`py-4 px-8 font-medium ${activeTab === 'prescriptions'
                ? 'text-white-600 border-b-2 border-blue-600'
                : 'text-white-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('prescriptions')}
            >
              Prescriptions
            </button>
            <button
              className={`py-4 px-8 font-medium ${activeTab === 'veterinarians'
                ? 'text-white-600 border-b-2 border-blue-600'
                : 'text-white-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('veterinarians')}
            >
              Veterinarians
            </button>
          </div>
        )}

        {/* Content */}
        {/* Content */}
        {showCalendar ? renderBookingView() : (
          activeTab === 'dashboard' ? renderDashboard() :
            activeTab === 'appointments' ? renderAppointments() :
              activeTab === 'prescriptions' ? renderPrescriptions() :
                activeTab === 'veterinarians' ? renderVeterinarians() :
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h3>
                    <p className="text-gray-600">This section is currently under development.</p>
                  </div>
        )}
      </main>

      {/* Video Consultation Modal */}
      {showVideoConsult && activeAppointment && <VideoConsultation />}

      {/* Emergency Modal */}
      {showEmergencyModal && <EmergencyModal />}

      {showFeedbackForm && selectedAppointmentForFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg p-4 max-h-[90vh] overflow-y-auto">
            <FeedbackForm
              appointment={selectedAppointmentForFeedback}
              onClose={() => {
                setShowFeedbackForm(false);
                setSelectedAppointmentForFeedback(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
