// import React, { useState, useEffect } from 'react';
// import { 
//   Calendar, Users, Activity, TrendingUp, Clock, User, 
//   Phone, Mail, MapPin, Settings, LogOut, Bell, 
//   FileText, Heart, Stethoscope, Award
// } from 'lucide-react';

// const VeterinaryDashboard = () => {
//   const [userData, setUserData] = useState({});
//   const [activeTab, setActiveTab] = useState('dashboard');

//   useEffect(() => {
//     // Get user data from session storage
//     const storedUserData = sessionStorage.getItem('userData');
//     if (storedUserData) {
//       setUserData(JSON.parse(storedUserData));
//     }
//   }, []);

//   const handleLogout = () => {
//     // Clear all session data
//     sessionStorage.removeItem('vetToken');
//     sessionStorage.removeItem('userData');
//     sessionStorage.removeItem('userEmail');
//     sessionStorage.clear();

//     alert('Logged out successfully! Redirecting to login...');
//     setTimeout(() => {
//       window.location.href = '/login';
//     }, 500);
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Activity },
//     { id: 'appointments', label: 'Appointments', icon: Calendar },
//     { id: 'patients', label: 'Patients', icon: Heart },
//     { id: 'consultations', label: 'Consultations', icon: Stethoscope },
//     { id: 'reports', label: 'Reports', icon: FileText },
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'settings', label: 'Settings', icon: Settings }
//   ];

//   const stats = {
//     totalAppointments: 45,
//     todayAppointments: 8,
//     totalPatients: 156,
//     consultationsThisMonth: 78,
//     rating: 4.8,
//     experience: userData.experience || 'Not specified'
//   };

//   const DashboardOverview = () => (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Welcome back, {userData.name || 'Doctor'}!
//             </h1>
//             <p className="text-gray-600 mt-1">
//               {userData.specialization && `Specializing in ${userData.specialization}`}
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Today's Date</p>
//               <p className="font-semibold">{new Date().toLocaleDateString()}</p>
//             </div>
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//               <Stethoscope className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Appointments</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
//             </div>
//             <Calendar className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
//             </div>
//             <Clock className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Patients</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
//             </div>
//             <Heart className="w-8 h-8 text-red-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">This Month</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.consultationsThisMonth}</p>
//             </div>
//             <TrendingUp className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//               <div>
//                 <p className="font-medium text-gray-900">Morning Consultation</p>
//                 <p className="text-sm text-gray-600">9:00 AM - 12:00 PM</p>
//               </div>
//               <span className="text-blue-600 text-sm font-medium">3 patients</span>
//             </div>
//             <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
//               <div>
//                 <p className="font-medium text-gray-900">Afternoon Consultation</p>
//                 <p className="text-sm text-gray-600">2:00 PM - 5:00 PM</p>
//               </div>
//               <span className="text-green-600 text-sm font-medium">5 patients</span>
//             </div>
//             <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//               <div>
//                 <p className="font-medium text-gray-900">Surgery Scheduled</p>
//                 <p className="text-sm text-gray-600">6:00 PM - 7:00 PM</p>
//               </div>
//               <span className="text-gray-600 text-sm font-medium">1 patient</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <button className="p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
//               <Calendar className="w-6 h-6 mx-auto mb-2" />
//               <span className="text-sm font-medium">New Appointment</span>
//             </button>
//             <button className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
//               <Heart className="w-6 h-6 mx-auto mb-2" />
//               <span className="text-sm font-medium">Add Patient</span>
//             </button>
//             <button className="p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors">
//               <FileText className="w-6 h-6 mx-auto mb-2" />
//               <span className="text-sm font-medium">View Reports</span>
//             </button>
//             <button className="p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors">
//               <Stethoscope className="w-6 h-6 mx-auto mb-2" />
//               <span className="text-sm font-medium">Consultation</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Professional Info */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex items-center space-x-3">
//             <Award className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm text-gray-600">Experience</p>
//               <p className="font-medium">{stats.experience} years</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Stethoscope className="w-5 h-5 text-green-600" />
//             <div>
//               <p className="text-sm text-gray-600">Specialization</p>
//               <p className="font-medium">{userData.specialization || 'General Practice'}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <TrendingUp className="w-5 h-5 text-purple-600" />
//             <div>
//               <p className="text-sm text-gray-600">Rating</p>
//               <p className="font-medium">{stats.rating}/5.0</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const ProfilePage = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//             <input
//               type="text"
//               value={userData.name || ''}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//             <input
//               type="email"
//               value={userData.email || ''}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//             <input
//               type="tel"
//               value={userData.phone || 'Not provided'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
//             <input
//               type="text"
//               value={userData.specialization || 'Not specified'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//         </div>
//         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//           <p className="text-sm text-blue-700">
//             <strong>Note:</strong> To update your profile information, please contact the administrator.
//           </p>
//         </div>
//       </div>
//     </div>
//   );

//   const renderActivePage = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardOverview />;
//       case 'profile':
//         return <ProfilePage />;
//       case 'appointments':
//         return (
//           <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//             <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointments Management</h3>
//             <p className="text-gray-600">View and manage your appointments here</p>
//           </div>
//         );
//       case 'patients':
//         return (
//           <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//             <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Records</h3>
//             <p className="text-gray-600">Manage patient information and medical records</p>
//           </div>
//         );
//       case 'consultations':
//         return (
//           <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//             <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultations</h3>
//             <p className="text-gray-600">Conduct and manage virtual consultations</p>
//           </div>
//         );
//       default:
//         return <DashboardOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-6 border-b">
//           <h1 className="text-xl font-bold text-gray-800">Veterinary Portal</h1>
//           <p className="text-sm text-gray-600">{userData.name || 'Doctor'}</p>
//         </div>

//         <nav className="mt-6">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
//                   activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
//                 }`}
//               >
//                 <Icon className="mr-3 h-5 w-5" />
//                 {item.label}
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
//               {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('-', ' ')}
//             </h2>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-600 hover:text-gray-800 relative">
//                 <Bell className="h-6 w-6" />
//               </button>
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-semibold">
//                     {userData.name ? userData.name.charAt(0).toUpperCase() : 'D'}
//                   </span>
//                 </div>
//                 <span className="text-gray-700">{userData.name || 'Doctor'}</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {renderActivePage()}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default VeterinaryDashboard;




// import React, { useState, useEffect } from 'react';
// import { 
//   Calendar, Users, Activity, TrendingUp, Clock, User, 
//   Phone, Mail, MapPin, Settings, LogOut, Bell, 
//   FileText, Heart, Stethoscope, Award, Video, 
//   CheckCircle, XCircle, Clock4, PenTool, AlertCircle
// } from 'lucide-react';
// import { getDatabase, ref, onValue, update, set, push } from 'firebase/database';

// const VeterinaryDashboard = () => {
//   const [userData, setUserData] = useState({});
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [emergencyAvailable, setEmergencyAvailable] = useState(false);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeAppointment, setActiveAppointment] = useState(null);
//   const [videoConsultActive, setVideoConsultActive] = useState(false);
//   const [prescription, setPrescription] = useState({
//     notes: '',
//     medicines: []
//   });
//   const [stats, setStats] = useState({
//     totalAppointments: 0,
//     todayAppointments: 0,
//     totalPatients: 0,
//     consultationsThisMonth: 0,
//     rating: 0,
//     feedbacks: []
//   });

//   useEffect(() => {
//     // Get user data from session storage
//     const storedUserData = sessionStorage.getItem('userData');
//     if (storedUserData) {
//       setUserData(JSON.parse(storedUserData));
//     }

//     // Fetch veterinarian data and appointments from Firebase
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const db = getDatabase();

//         // Fetch vet profile if we have the ID
//         if (userData.id) {
//           const vetRef = ref(db, `veterinary/${userData.id}`);
//           onValue(vetRef, (snapshot) => {
//             if (snapshot.exists()) {
//               const vetData = snapshot.val();
//               setUserData(prevData => ({ ...prevData, ...vetData }));

//               // Set emergency status from DB
//               setEmergencyAvailable(vetData.emergencyAvailable || false);

//               // Set time slots from DB
//               setTimeSlots(vetData.timeSlots || generateDefaultTimeSlots());
//             }
//           });
//         }

//         // Fetch all appointments for this veterinarian
//         const appointmentsRef = ref(db, 'appointments');
//         onValue(appointmentsRef, (snapshot) => {
//           const appointmentsList = [];
//           const uniquePatients = new Set();
//           let todayCount = 0;
//           let monthlyCount = 0;

//           const today = new Date();
//           const thisMonth = today.getMonth();
//           const thisYear = today.getFullYear();

//           snapshot.forEach((childSnapshot) => {
//             const appointment = childSnapshot.val();

//             // Only include appointments for this vet
//             if (appointment.vetId === userData.id) {
//               // Add ID to appointment object
//               const appointmentWithId = {
//                 id: childSnapshot.key,
//                 ...appointment
//               };

//               appointmentsList.push(appointmentWithId);

//               // Count unique patients
//               uniquePatients.add(appointment.userId);

//               // Count today's appointments
//               const appointmentDate = new Date(appointment.date);
//               if (
//                 appointmentDate.getDate() === today.getDate() &&
//                 appointmentDate.getMonth() === today.getMonth() &&
//                 appointmentDate.getFullYear() === today.getFullYear()
//               ) {
//                 todayCount++;
//               }

//               // Count this month's consultations
//               if (
//                 appointmentDate.getMonth() === thisMonth &&
//                 appointmentDate.getFullYear() === thisYear &&
//                 appointment.status !== 'pending' && 
//                 appointment.status !== 'cancelled'
//               ) {
//                 monthlyCount++;
//               }
//             }
//           });

//           // Sort by date (newest first)
//           appointmentsList.sort((a, b) => {
//             const dateA = new Date(`${a.date} ${a.time}`);
//             const dateB = new Date(`${b.date} ${b.time}`);
//             return dateA - dateB;
//           });

//           setAppointments(appointmentsList);

//           // Update stats
//           setStats(prevStats => ({
//             ...prevStats,
//             totalAppointments: appointmentsList.length,
//             todayAppointments: todayCount,
//             totalPatients: uniquePatients.size,
//             consultationsThisMonth: monthlyCount
//           }));

//           setLoading(false);
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userData.id]);

//   const handleLogout = () => {
//     // Clear all session data
//     sessionStorage.removeItem('vetToken');
//     sessionStorage.removeItem('userData');
//     sessionStorage.removeItem('userEmail');
//     sessionStorage.clear();

//     alert('Logged out successfully! Redirecting to login...');
//     setTimeout(() => {
//       window.location.href = '/login';
//     }, 500);
//   };

//   const toggleEmergencyAvailability = async () => {
//     try {
//       const newStatus = !emergencyAvailable;
//       setEmergencyAvailable(newStatus);

//       // Update in Firebase
//       if (userData.id) {
//         const db = getDatabase();
//         const vetRef = ref(db, `veterinary/${userData.id}`);
//         await update(vetRef, {
//           emergencyAvailable: newStatus
//         });
//       }
//     } catch (error) {
//       console.error("Error updating emergency status:", error);
//       // Revert UI state on error
//       setEmergencyAvailable(!emergencyAvailable);
//     }
//   };

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

//   const startVideoConsultation = (appointment) => {
//     setActiveAppointment(appointment);
//     setVideoConsultActive(true);
//     // In a real implementation, you would initialize the video call service here
//   };

//   const endVideoConsultation = () => {
//     setVideoConsultActive(false);
//     setActiveAppointment(null);
//   };

//   const submitPrescription = async () => {
//     if (!activeAppointment || !prescription.notes) {
//       alert('Please add prescription details first');
//       return;
//     }

//     try {
//       const db = getDatabase();

//       // Create prescription in DB
//       const prescriptionsRef = ref(db, 'prescriptions');
//       const newPrescriptionRef = push(prescriptionsRef);

//       await set(newPrescriptionRef, {
//         appointmentId: activeAppointment.id,
//         userId: activeAppointment.userId,
//         vetId: userData.id,
//         vetName: userData.name,
//         date: new Date().toISOString(),
//         notes: prescription.notes,
//         medicines: prescription.medicines,
//         status: 'active'
//       });

//       // Mark appointment as completed
//       const appointmentRef = ref(db, `appointments/${activeAppointment.id}`);
//       await update(appointmentRef, {
//         status: 'completed',
//         hasPrescription: true
//       });

//       // Reset state
//       setPrescription({ notes: '', medicines: [] });
//       alert('Prescription saved successfully');
//       endVideoConsultation();
//     } catch (error) {
//       console.error("Error saving prescription:", error);
//       alert('Failed to save prescription. Please try again.');
//     }
//   };

//   const addMedicineToList = (medicineName, dosage, duration) => {
//     if (!medicineName) return;

//     setPrescription(prev => ({
//       ...prev,
//       medicines: [
//         ...prev.medicines,
//         { name: medicineName, dosage, duration }
//       ]
//     }));
//   };

//   const removeMedicine = (index) => {
//     setPrescription(prev => ({
//       ...prev,
//       medicines: prev.medicines.filter((_, i) => i !== index)
//     }));
//   };

//   const updateTimeSlot = async (day, hour, available) => {
//     // Create a deep copy of the timeSlots
//     const updatedSlots = JSON.parse(JSON.stringify(timeSlots));

//     // Update the specific slot
//     if (!updatedSlots[day]) {
//       updatedSlots[day] = {};
//     }
//     updatedSlots[day][hour] = available;

//     setTimeSlots(updatedSlots);

//     // Save to Firebase
//     try {
//       if (userData.id) {
//         const db = getDatabase();
//         const vetRef = ref(db, `veterinary/${userData.id}`);
//         await update(vetRef, {
//           timeSlots: updatedSlots
//         });
//       }
//     } catch (error) {
//       console.error("Error updating time slots:", error);
//     }
//   };

//   const generateDefaultTimeSlots = () => {
//     const slots = {};
//     const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     const hours = [9, 10, 11, 12, 14, 15, 16, 17];

//     days.forEach(day => {
//       slots[day] = {};
//       hours.forEach(hour => {
//         // By default, make weekday working hours available, weekend unavailable
//         const isWeekend = day === 'saturday' || day === 'sunday';
//         slots[day][hour] = !isWeekend;
//       });
//     });

//     return slots;
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Activity },
//     { id: 'appointments', label: 'Appointments', icon: Calendar },
//     { id: 'patients', label: 'Patients', icon: Heart },
//     { id: 'consultations', label: 'Consultations', icon: Stethoscope },
//     { id: 'timeslots', label: 'Time Slots', icon: Clock },
//     { id: 'reports', label: 'Reports', icon: FileText },
//     { id: 'profile', label: 'Profile', icon: User },
//     { id: 'settings', label: 'Settings', icon: Settings }
//   ];

//   const getTodayAppointments = () => {
//     const today = new Date();
//     return appointments.filter(appointment => {
//       const appointmentDate = new Date(appointment.date);
//       return (
//         appointmentDate.getDate() === today.getDate() &&
//         appointmentDate.getMonth() === today.getMonth() &&
//         appointmentDate.getFullYear() === today.getFullYear() &&
//         appointment.status !== 'cancelled'
//       );
//     });
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-50 text-yellow-600';
//       case 'confirmed':
//         return 'bg-green-50 text-green-600';
//       case 'cancelled':
//         return 'bg-red-50 text-red-600';
//       case 'completed':
//         return 'bg-blue-50 text-blue-600';
//       default:
//         return 'bg-gray-50 text-gray-600';
//     }
//   };

//   const DashboardOverview = () => (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Welcome back, {userData.name || 'Doctor'}!
//             </h1>
//             <p className="text-gray-600 mt-1">
//               {userData.specialization && `Specializing in ${userData.specialization}`}
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Today's Date</p>
//               <p className="font-semibold">{new Date().toLocaleDateString()}</p>
//             </div>
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//               <Stethoscope className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Emergency Toggle */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <AlertCircle className={`w-8 h-8 ${emergencyAvailable ? 'text-green-600' : 'text-red-600'}`} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Emergency Availability</h3>
//               <p className="text-gray-600">You are currently {emergencyAvailable ? 'available' : 'not available'} for emergency consultations</p>
//             </div>
//           </div>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input 
//               type="checkbox" 
//               className="sr-only peer" 
//               checked={emergencyAvailable}
//               onChange={toggleEmergencyAvailability}
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//           </label>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Appointments</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
//             </div>
//             <Calendar className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
//             </div>
//             <Clock className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Patients</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
//             </div>
//             <Heart className="w-8 h-8 text-red-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">This Month</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.consultationsThisMonth}</p>
//             </div>
//             <TrendingUp className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>
//       </div>

//       {/* Today's Appointments */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>

//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : getTodayAppointments().length > 0 ? (
//           <div className="space-y-3">
//             {getTodayAppointments().map((appointment) => (
//               <div key={appointment.id} className={`flex items-center justify-between p-3 rounded-lg ${getStatusClass(appointment.status)}`}>
//                 <div>
//                   <p className="font-medium text-gray-900">{appointment.userName}</p>
//                   <p className="text-sm text-gray-600">{appointment.time}</p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm font-medium capitalize">{appointment.status}</span>
//                   {appointment.status === 'confirmed' && (
//                     <button
//                       onClick={() => startVideoConsultation(appointment)}
//                       className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
//                       title="Start Consultation"
//                     >
//                       <Video className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-6 text-gray-500">
//             No appointments scheduled for today
//           </div>
//         )}
//       </div>

//       {/* Professional Info */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex items-center space-x-3">
//             <Award className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm text-gray-600">Experience</p>
//               <p className="font-medium">{userData.experience || 'Not specified'} years</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Stethoscope className="w-5 h-5 text-green-600" />
//             <div>
//               <p className="text-sm text-gray-600">Specialization</p>
//               <p className="font-medium">{userData.specialization || 'General Practice'}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <TrendingUp className="w-5 h-5 text-purple-600" />
//             <div>
//               <p className="text-sm text-gray-600">Rating</p>
//               <p className="font-medium">{stats.rating || '4.5'}/5.0</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const AppointmentsManager = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-800">Appointment Management</h2>

//       {/* Filter Tabs */}
//       <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//         <div className="flex border-b">
//           <button className="px-4 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">All Appointments</button>
//           <button className="px-4 py-3 text-gray-600 hover:text-gray-800">Pending</button>
//           <button className="px-4 py-3 text-gray-600 hover:text-gray-800">Confirmed</button>
//           <button className="px-4 py-3 text-gray-600 hover:text-gray-800">Completed</button>
//           <button className="px-4 py-3 text-gray-600 hover:text-gray-800">Cancelled</button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : appointments.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Patient
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date & Time
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {appointments.map((appointment) => {
//                   const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
//                   const isPast = appointmentDate < new Date();

//                   return (
//                     <tr key={appointment.id} className={isPast && appointment.status !== 'completed' ? 'bg-gray-50' : ''}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{appointment.userName}</div>
//                             <div className="text-sm text-gray-500">{appointment.userEmail}</div>
//                             {appointment.userPhone && (
//                               <div className="text-sm text-gray-500">{appointment.userPhone}</div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{new Date(appointment.date).toDateString()}</div>
//                         <div className="text-sm text-gray-500">{appointment.time}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                           appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {appointment.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           {appointment.status === 'pending' && (
//                             <>
//                               <button
//                                 onClick={() => handleAppointmentStatusChange(appointment.id, 'confirmed')}
//                                 className="text-green-600 hover:text-green-900 mr-2"
//                               >
//                                 <CheckCircle className="w-5 h-5" />
//                               </button>
//                               <button
//                                 onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
//                                 className="text-red-600 hover:text-red-900"
//                               >
//                                 <XCircle className="w-5 h-5" />
//                               </button>
//                             </>
//                           )}
//                           {appointment.status === 'confirmed' && !isPast && (
//                             <button
//                               onClick={() => startVideoConsultation(appointment)}
//                               className="text-blue-600 hover:text-blue-900"
//                               title="Start Consultation"
//                             >
//                               <Video className="w-5 h-5" />
//                             </button>
//                           )}
//                           {appointment.status === 'confirmed' && (
//                             <button
//                               onClick={() => handleAppointmentStatusChange(appointment.id, 'completed')}
//                               className="text-blue-600 hover:text-blue-900"
//                               title="Mark Completed"
//                             >
//                               <CheckCircle className="w-5 h-5" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
//             <p className="text-gray-600">You don't have any appointments yet.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const TimeSlotsManager = () => {
//     // Days of the week
//     const days = [
//       { id: 'monday', label: 'Monday' },
//       { id: 'tuesday', label: 'Tuesday' },
//       { id: 'wednesday', label: 'Wednesday' },
//       { id: 'thursday', label: 'Thursday' },
//       { id: 'friday', label: 'Friday' },
//       { id: 'saturday', label: 'Saturday' },
//       { id: 'sunday', label: 'Sunday' }
//     ];

//     // Hours in 24-hour format
//     const hours = [9, 10, 11, 12, 14, 15, 16, 17];

//     const formatHour = (hour) => {
//       return hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour-12}:00 PM`;
//     };

//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Manage Time Slots</h2>

//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Your Available Hours</h3>
//           <p className="text-gray-600 mb-6">Click on the time slots to toggle availability. Blue indicates available, gray indicates unavailable.</p>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Day
//                   </th>
//                   {hours.map((hour) => (
//                     <th key={hour} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {formatHour(hour)}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {days.map((day) => (
//                   <tr key={day.id}>
//                     <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
//                       {day.label}
//                     </td>
//                     {hours.map((hour) => {
//                       const isAvailable = timeSlots[day.id]?.[hour] || false;
//                       return (
//                         <td key={`${day.id}-${hour}`} className="px-2 py-4 text-center">
//                           <button
//                             onClick={() => updateTimeSlot(day.id, hour, !isAvailable)}
//                             className={`w-full h-8 rounded-md transition-colors ${
//                               isAvailable ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
//                             }`}
//                           >
//                             {isAvailable ? 'Available' : 'Unavailable'}
//                           </button>
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//             <p className="text-sm text-blue-700">
//               <strong>Note:</strong> Changes to your availability are saved automatically. Make sure to check for any conflicts with existing appointments.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const ProfilePage = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//             <input
//               type="text"
//               value={userData.name || ''}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//             <input
//               type="email"
//               value={userData.email || ''}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//             <input
//               type="tel"
//               value={userData.phone || 'Not provided'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
//             <input
//               type="text"
//               value={userData.specialization || 'Not specified'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//         </div>
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
//           <input
//             type="number"
//             value={userData.experience || ''}
//             readOnly
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//           />
//         </div>
//         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//           <p className="text-sm text-blue-700">
//             <strong>Note:</strong> To update your profile information, please contact the administrator.
//           </p>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h3>
//         <div className="p-4 bg-green-50 rounded-lg flex items-center">
//           <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
//           <div>
//             <p className="font-medium text-green-800">Your documents have been verified</p>
//             <p className="text-sm text-green-700">Your license and credentials have been approved by our team.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const VideoConsultation = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl w-full max-w-5xl h-full max-h-[80vh] flex flex-col overflow-hidden">
//         <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
//           <div className="flex items-center">
//             <Video className="w-5 h-5 mr-2" />
//             <h3 className="font-semibold">Consultation with {activeAppointment?.userName}</h3>
//           </div>
//           <button 
//             onClick={endVideoConsultation}
//             className="p-1 hover:bg-blue-700 rounded"
//           >
//             <XCircle className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="flex-1 grid grid-cols-3 gap-4 p-4">
//           <div className="col-span-2 bg-gray-900 rounded-lg flex items-center justify-center">
//             <div className="text-center text-white">
//               <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
//               <p className="font-medium">Video call would be integrated here</p>
//               <p className="text-sm text-gray-400 mt-2">Using Jitsi, Zoom, or WebRTC</p>
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
//             <h4 className="font-semibold text-gray-900 mb-3">Create Prescription</h4>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//               <textarea
//                 value={prescription.notes}
//                 onChange={(e) => setPrescription({...prescription, notes: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 rows={4}
//                 placeholder="Enter prescription notes and instructions..."
//               ></textarea>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>

//               {prescription.medicines.map((medicine, index) => (
//                 <div key={index} className="flex items-center justify-between mb-2 p-2 bg-white rounded border">
//                   <div>
//                     <p className="font-medium text-sm">{medicine.name}</p>
//                     <p className="text-xs text-gray-500">{medicine.dosage} - {medicine.duration}</p>
//                   </div>
//                   <button 
//                     onClick={() => removeMedicine(index)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     <XCircle className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}

//               <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
//                 <div className="grid grid-cols-3 gap-2 mb-2">
//                   <input 
//                     type="text" 
//                     className="col-span-3 px-2 py-1 border border-gray-300 rounded" 
//                     placeholder="Medicine name"
//                     id="medicine-name"
//                   />
//                   <input 
//                     type="text" 
//                     className="px-2 py-1 border border-gray-300 rounded" 
//                     placeholder="Dosage"
//                     id="medicine-dosage"
//                   />
//                   <input 
//                     type="text" 
//                     className="px-2 py-1 border border-gray-300 rounded" 
//                     placeholder="Duration"
//                     id="medicine-duration"
//                   />
//                   <button 
//                     onClick={() => {
//                       const name = document.getElementById('medicine-name').value;
//                       const dosage = document.getElementById('medicine-dosage').value;
//                       const duration = document.getElementById('medicine-duration').value;
//                       addMedicineToList(name, dosage, duration);
//                       document.getElementById('medicine-name').value = '';
//                       document.getElementById('medicine-dosage').value = '';
//                       document.getElementById('medicine-duration').value = '';
//                     }}
//                     className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={submitPrescription}
//               disabled={!prescription.notes}
//               className={`w-full py-2 rounded-lg font-medium ${
//                 prescription.notes ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               Save Prescription & Complete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderActivePage = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardOverview />;
//       case 'profile':
//         return <ProfilePage />;
//       case 'appointments':
//         return <AppointmentsManager />;
//       case 'timeslots':
//         return <TimeSlotsManager />;
//       case 'patients':
//         return (
//           <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//             <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Records</h3>
//             <p className="text-gray-600">Manage patient information and medical records</p>
//           </div>
//         );
//       case 'consultations':
//         return (
//           <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//             <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultations</h3>
//             <p className="text-gray-600">Conduct and manage virtual consultations</p>
//           </div>
//         );
//       default:
//         return <DashboardOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-6 border-b">
//           <h1 className="text-xl font-bold text-gray-800">Veterinary Portal</h1>
//           <p className="text-sm text-gray-600">{userData.name || 'Doctor'}</p>
//         </div>

//         <nav className="mt-6">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
//                   activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
//                 }`}
//               >
//                 <Icon className="mr-3 h-5 w-5" />
//                 {item.label}
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
//               {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('-', ' ')}
//             </h2>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-600 hover:text-gray-800 relative">
//                 <Bell className="h-6 w-6" />
//               </button>
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-semibold">
//                     {userData.name ? userData.name.charAt(0).toUpperCase() : 'D'}
//                   </span>
//                 </div>
//                 <span className="text-gray-700">{userData.name || 'Doctor'}</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {renderActivePage()}
//         </main>
//       </div>

//       {/* Video Consultation Modal */}
//       {videoConsultActive && activeAppointment && <VideoConsultation />}
//     </div>
//   );
// };

// export default VeterinaryDashboard;






// import React, { useState, useEffect } from 'react';
// import { 
//   Calendar, Users, Activity, TrendingUp, Clock, User, 
//   Phone, Mail, MapPin, Settings, LogOut, Bell, 
//   FileText, Heart, Stethoscope, Award, Video, 
//   CheckCircle, XCircle, Clock4, PenTool, AlertCircle
// } from 'lucide-react';
// import { getDatabase, ref, onValue, update, set, push, get } from 'firebase/database';

// const VeterinaryDashboard = () => {
//   const [userData, setUserData] = useState({});
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [emergencyAvailable, setEmergencyAvailable] = useState(false);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeAppointment, setActiveAppointment] = useState(null);
//   const [videoConsultActive, setVideoConsultActive] = useState(false);
//   const [prescription, setPrescription] = useState({
//     notes: '',
//     medicines: []
//   });
//   const [stats, setStats] = useState({
//     totalAppointments: 0,
//     todayAppointments: 0,
//     totalPatients: 0,
//     consultationsThisMonth: 0,
//     rating: 0,
//     feedbacks: []
//   });
//   const [notification, setNotification] = useState({ show: false, type: '', message: '' });

//   // Show notification helper
//   const showNotification = (type, message) => {
//     setNotification({ show: true, type, message });
//     setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
//   };

//   useEffect(() => {
//     // Get user data from session storage
//     const storedUserData = sessionStorage.getItem('userData');
//     const storedEmail = sessionStorage.getItem('userEmail'); 
//     const storedToken = sessionStorage.getItem('vetToken');

//     console.log("Initial session data:", { 
//       storedUserData: storedUserData ? 'present' : 'missing', 
//       storedEmail, 
//       storedToken: storedToken ? 'present' : 'missing' 
//     });

//     if (storedUserData) {
//       try {
//         const parsedData = JSON.parse(storedUserData);
//         console.log("Parsed user data:", parsedData);
//         setUserData(parsedData);
//       } catch (error) {
//         console.error("Error parsing userData from session storage:", error);
//       }
//     } else if (storedEmail) {
//       // If we have email but not userData, set email in userData
//       setUserData(prev => ({ ...prev, email: storedEmail }));
//       console.log("Using email from session storage:", storedEmail);
//     }

//     // Fetch veterinarian data and appointments from Firebase
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const db = getDatabase();
//         console.log("Database reference obtained");

//         // WORKAROUND: If we don't have any user data, create a mock entry for testing
//         // Remove this in production - this is just to bypass the ID error
//         if (!storedUserData && !storedEmail && !userData.id && !userData.email) {
//           console.log("No user identification found - using default fallback for testing");
//           // This is just a temporary workaround to prevent the error
//           setUserData({
//             id: "default-vet-id",
//             name: "Doctor",
//             email: "vet@example.com",
//             specialization: "General Practice"
//           });

//           // Create a mock entry in the database if it doesn't exist yet
//           try {
//             const vetRef = ref(db, `veterinary/default-vet-id`);
//             const snapshot = await get(vetRef);
//             if (!snapshot.exists()) {
//               await set(vetRef, {
//                 name: "Doctor",
//                 email: "vet@example.com",
//                 specialization: "General Practice",
//                 experience: 5,
//                 emergencyAvailable: false,
//                 timeSlots: generateDefaultTimeSlots(),
//                 createdAt: new Date().toISOString()
//               });
//               console.log("Created default vet entry for testing");
//             }
//           } catch (err) {
//             console.error("Error creating default vet entry:", err);
//           }
//         }

//         // First, try to find the vet by ID, email, or name
//         let vetId = null;
//         let vetData = null;

//         // Try all possible ways to identify the vet
//         const identifyVet = async () => {
//           // If we have an ID, use it directly
//           if (userData.id) {
//             vetId = userData.id;
//             console.log("Using ID from userData:", vetId);
//             return;
//           } 

//           // Otherwise, search for the vet by email
//           if (userData.email || storedEmail) {
//             const emailToUse = userData.email || storedEmail;
//             console.log("Searching for vet by email:", emailToUse);
//             const vetsRef = ref(db, 'veterinary');
//             const snapshot = await get(vetsRef);

//             if (snapshot.exists()) {
//               const vets = snapshot.val();
//               // Find the vet with matching email
//               for (const id in vets) {
//                 if (vets[id].email === emailToUse) {
//                   vetId = id;
//                   vetData = vets[id];
//                   console.log("Found vet by email, ID:", vetId);
//                   return;
//                 }
//               }
//             }
//           }

//           // If still no ID, try to find by name
//           if (userData.name) {
//             console.log("Searching for vet by name:", userData.name);
//             const vetsRef = ref(db, 'veterinary');
//             const snapshot = await get(vetsRef);

//             if (snapshot.exists()) {
//               const vets = snapshot.val();
//               // Find the vet with matching name
//               for (const id in vets) {
//                 if (vets[id].name === userData.name) {
//                   vetId = id;
//                   vetData = vets[id];
//                   console.log("Found vet by name, ID:", vetId);
//                   return;
//                 }
//               }
//             }
//           }

//           // If still no ID found, use default (for development/testing only)
//           if (!vetId) {
//             vetId = "default-vet-id";
//             console.log("Using default vet ID as fallback");
//           }
//         };

//         await identifyVet();

//         // If we found a vet ID, fetch their data
//         if (vetId) {
//           console.log("Fetching data for vet ID:", vetId);
//           const vetRef = ref(db, `veterinary/${vetId}`);

//           // Update userData with the ID we found
//           setUserData(prevData => {
//             const updatedData = { ...prevData, id: vetId };
//             // Store the updated data in session storage
//             sessionStorage.setItem('userData', JSON.stringify(updatedData));
//             console.log("Updated userData with ID:", updatedData);
//             return updatedData;
//           });

//           onValue(vetRef, (snapshot) => {
//             if (snapshot.exists()) {
//               const fetchedVetData = snapshot.val();
//               console.log("Fetched vet data:", fetchedVetData);

//               // Update userData with the latest data
//               setUserData(prevData => {
//                 const newData = { ...prevData, ...fetchedVetData, id: vetId };
//                 // Update session storage with the complete data
//                 sessionStorage.setItem('userData', JSON.stringify(newData));
//                 return newData;
//               });

//               // Set emergency status from DB
//               setEmergencyAvailable(fetchedVetData.emergencyAvailable || false);

//               // Set time slots from DB or use defaults
//               if (fetchedVetData.timeSlots) {
//                 console.log("Setting time slots from DB:", fetchedVetData.timeSlots);
//                 setTimeSlots(fetchedVetData.timeSlots);
//               } else {
//                 const defaultSlots = generateDefaultTimeSlots();
//                 console.log("Setting default time slots:", defaultSlots);
//                 setTimeSlots(defaultSlots);

//                 // Save default time slots to the database
//                 update(vetRef, { timeSlots: defaultSlots })
//                   .then(() => console.log("Default time slots saved to DB"))
//                   .catch(err => console.error("Error saving default time slots:", err));
//               }
//             } else {
//               console.log("No vet data found, using defaults");
//               const defaultSlots = generateDefaultTimeSlots();
//               setTimeSlots(defaultSlots);

//               // Create a default vet profile if it doesn't exist
//               set(vetRef, {
//                 id: vetId,
//                 name: userData.name || "Doctor",
//                 email: userData.email || storedEmail || "vet@example.com",
//                 specialization: "General Practice",
//                 experience: 0,
//                 emergencyAvailable: false,
//                 timeSlots: defaultSlots,
//                 createdAt: new Date().toISOString()
//               })
//                 .then(() => console.log("Created default vet profile"))
//                 .catch(err => console.error("Error creating default profile:", err));
//             }
//           });

//           // Fetch all appointments for this veterinarian
//           const appointmentsRef = ref(db, 'appointments');
//           onValue(appointmentsRef, (snapshot) => {
//             const appointmentsList = [];
//             const uniquePatients = new Set();
//             let todayCount = 0;
//             let monthlyCount = 0;

//             const today = new Date();
//             const thisMonth = today.getMonth();
//             const thisYear = today.getFullYear();

//             if (snapshot.exists()) {
//               snapshot.forEach((childSnapshot) => {
//                 const appointment = childSnapshot.val();

//                 // Include appointments for this vet by ID, email, or name
//                 if (
//                   appointment.vetId === vetId ||
//                   (userData.email && appointment.vetEmail === userData.email) ||
//                   (storedEmail && appointment.vetEmail === storedEmail) ||
//                   (userData.name && appointment.vetName === userData.name)
//                 ) {
//                   // Add ID to appointment object
//                   const appointmentWithId = {
//                     id: childSnapshot.key,
//                     ...appointment
//                   };

//                   appointmentsList.push(appointmentWithId);

//                   // Count unique patients
//                   uniquePatients.add(appointment.userId);

//                   // Count today's appointments
//                   const appointmentDate = new Date(appointment.date);
//                   if (
//                     appointmentDate.getDate() === today.getDate() &&
//                     appointmentDate.getMonth() === today.getMonth() &&
//                     appointmentDate.getFullYear() === today.getFullYear()
//                   ) {
//                     todayCount++;
//                   }

//                   // Count this month's consultations
//                   if (
//                     appointmentDate.getMonth() === thisMonth &&
//                     appointmentDate.getFullYear() === thisYear &&
//                     appointment.status !== 'pending' && 
//                     appointment.status !== 'cancelled'
//                   ) {
//                     monthlyCount++;
//                   }
//                 }
//               });
//             }

//             // Sort by date (newest first)
//             appointmentsList.sort((a, b) => {
//               const dateA = new Date(`${a.date} ${a.time}`);
//               const dateB = new Date(`${b.date} ${b.time}`);
//               return dateA - dateB;
//             });

//             console.log(`Found ${appointmentsList.length} appointments for this vet`);
//             setAppointments(appointmentsList);

//             // Update stats
//             setStats(prevStats => ({
//               ...prevStats,
//               totalAppointments: appointmentsList.length,
//               todayAppointments: todayCount,
//               totalPatients: uniquePatients.size,
//               consultationsThisMonth: monthlyCount
//             }));

//             setLoading(false);
//           });
//         } else {
//           console.error("Could not find vet ID by any method");
//           showNotification('error', 'Could not identify your account. Please log in again.');
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//         showNotification('error', 'Failed to load data. Please refresh the page.');
//       }
//     };

//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     // Clear all session data
//     sessionStorage.removeItem('vetToken');
//     sessionStorage.removeItem('userData');
//     sessionStorage.removeItem('userEmail');
//     sessionStorage.clear();

//     showNotification('success', 'Logged out successfully! Redirecting to login...');
//     setTimeout(() => {
//       window.location.href = '/login';
//     }, 1500);
//   };

//   const toggleEmergencyAvailability = async () => {
//     try {
//       const newStatus = !emergencyAvailable;
//       setEmergencyAvailable(newStatus);

//       // Update in Firebase
//       if (userData.id) {
//         const db = getDatabase();
//         const vetRef = ref(db, `veterinary/${userData.id}`);
//         await update(vetRef, {
//           emergencyAvailable: newStatus
//         });
//         showNotification('success', `Emergency availability ${newStatus ? 'enabled' : 'disabled'}`);
//       }
//     } catch (error) {
//       console.error("Error updating emergency status:", error);
//       // Revert UI state on error
//       setEmergencyAvailable(!emergencyAvailable);
//       showNotification('error', 'Failed to update emergency status.');
//     }
//   };

//   const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
//     try {
//       const db = getDatabase();
//       const appointmentRef = ref(db, `appointments/${appointmentId}`);

//       await update(appointmentRef, {
//         status: newStatus,
//         updatedAt: new Date().toISOString()
//       });

//       // UI will update automatically through the onValue listener
//       showNotification('success', `Appointment ${newStatus === 'confirmed' ? 'accepted' : newStatus === 'cancelled' ? 'rejected' : 'updated'} successfully`);
//     } catch (error) {
//       console.error("Error updating appointment status:", error);
//       showNotification('error', 'Failed to update appointment status.');
//     }
//   };

//   const startVideoConsultation = (appointment) => {
//     setActiveAppointment(appointment);
//     setVideoConsultActive(true);
//     // In a real implementation, you would initialize the video call service here
//   };

//   const endVideoConsultation = () => {
//     setVideoConsultActive(false);
//     setActiveAppointment(null);
//   };

//   const submitPrescription = async () => {
//     if (!activeAppointment || !prescription.notes) {
//       showNotification('error', 'Please add prescription details first');
//       return;
//     }

//     try {
//       const db = getDatabase();

//       // Create prescription in DB
//       const prescriptionsRef = ref(db, 'prescriptions');
//       const newPrescriptionRef = push(prescriptionsRef);

//       await set(newPrescriptionRef, {
//         appointmentId: activeAppointment.id,
//         userId: activeAppointment.userId,
//         vetId: userData.id,
//         vetName: userData.name,
//         date: new Date().toISOString(),
//         notes: prescription.notes,
//         medicines: prescription.medicines,
//         status: 'active'
//       });

//       // Mark appointment as completed
//       const appointmentRef = ref(db, `appointments/${activeAppointment.id}`);
//       await update(appointmentRef, {
//         status: 'completed',
//         hasPrescription: true,
//         updatedAt: new Date().toISOString()
//       });

//       // Reset state
//       setPrescription({ notes: '', medicines: [] });
//       showNotification('success', 'Prescription saved successfully');
//       endVideoConsultation();
//     } catch (error) {
//       console.error("Error saving prescription:", error);
//       showNotification('error', 'Failed to save prescription. Please try again.');
//     }
//   };

//   const addMedicineToList = (medicineName, dosage, duration) => {
//     if (!medicineName) {
//       showNotification('error', 'Medicine name is required');
//       return;
//     }

//     setPrescription(prev => ({
//       ...prev,
//       medicines: [
//         ...prev.medicines,
//         { name: medicineName, dosage, duration }
//       ]
//     }));
//   };

//   const removeMedicine = (index) => {
//     setPrescription(prev => ({
//       ...prev,
//       medicines: prev.medicines.filter((_, i) => i !== index)
//     }));
//   };

//   const updateTimeSlot = async (day, hour, available) => {
//     // Check for conflicts with existing appointments
//     if (!available) {
//       const formattedDay = formatDayForAppointment(day);
//       const formattedHour = formatHourForAppointment(hour);

//       const conflictingAppointments = appointments.filter(apt => {
//         const aptDate = new Date(apt.date);
//         const aptDay = aptDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//         return (
//           aptDay === day && 
//           apt.time === formattedHour &&
//           apt.status !== 'cancelled' &&
//           apt.status !== 'completed'
//         );
//       });

//       if (conflictingAppointments.length > 0) {
//         showNotification('error', 'Cannot mark as unavailable - you have existing appointments in this slot');
//         return;
//       }
//     }

//     // Create a deep copy of the timeSlots
//     const updatedSlots = JSON.parse(JSON.stringify(timeSlots));

//     // Update the specific slot
//     if (!updatedSlots[day]) {
//       updatedSlots[day] = {};
//     }
//     updatedSlots[day][hour] = available;

//     setTimeSlots(updatedSlots);

//     // Save to Firebase
//     try {
//       if (userData.id) {
//         const db = getDatabase();
//         const vetRef = ref(db, `veterinary/${userData.id}`);
//         await update(vetRef, {
//           timeSlots: updatedSlots
//         });
//         showNotification('success', 'Time slot updated successfully');
//       }
//     } catch (error) {
//       console.error("Error updating time slots:", error);
//       // Revert UI state on error
//       setTimeSlots(timeSlots);
//       showNotification('error', 'Failed to update time slot');
//     }
//   };

//   const formatDayForAppointment = (day) => {
//     // Convert day string to date format
//     const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//     const dayIndex = days.indexOf(day.toLowerCase());
//     const today = new Date();
//     const currentDayIndex = today.getDay();
//     const diff = dayIndex - currentDayIndex;

//     const targetDate = new Date();
//     targetDate.setDate(today.getDate() + diff + (diff < 0 ? 7 : 0));

//     return targetDate.toISOString().split('T')[0];
//   };

//   const formatHourForAppointment = (hour) => {
//     // Convert hour number to formatted time string (e.g., "9:00 AM")
//     const isPM = hour >= 12;
//     const hour12 = hour === 12 ? 12 : hour % 12;
//     return `${hour12}:00 ${isPM ? 'PM' : 'AM'}`;
//   };

//   const generateDefaultTimeSlots = () => {
//     const slots = {};
//     const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     const hours = [9, 10, 11, 12, 14, 15, 16, 17];

//     days.forEach(day => {
//       slots[day] = {};
//       hours.forEach(hour => {
//         // By default, make weekday slots available (Monday to Friday)
//         const isWeekend = day === 'saturday' || day === 'sunday';
//         slots[day][hour] = !isWeekend;
//       });
//     });

//     return slots;
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Activity },
//     { id: 'appointments', label: 'Appointments', icon: Calendar },
//     { id: 'patients', label: 'Patients', icon: Heart },
//     { id: 'consultations', label: 'Consultations', icon: Stethoscope },
//     { id: 'timeslots', label: 'Time Slots', icon: Clock },

//     { id: 'profile', label: 'Profile', icon: User },

//   ];

//   const getTodayAppointments = () => {
//     const today = new Date();
//     return appointments.filter(appointment => {
//       const appointmentDate = new Date(appointment.date);
//       return (
//         appointmentDate.getDate() === today.getDate() &&
//         appointmentDate.getMonth() === today.getMonth() &&
//         appointmentDate.getFullYear() === today.getFullYear() &&
//         appointment.status !== 'cancelled'
//       );
//     });
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-50 text-yellow-600';
//       case 'confirmed':
//         return 'bg-green-50 text-green-600';
//       case 'cancelled':
//         return 'bg-red-50 text-red-600';
//       case 'completed':
//         return 'bg-blue-50 text-blue-600';
//       default:
//         return 'bg-gray-50 text-gray-600';
//     }
//   };

//   const NotificationToast = () => {
//     if (!notification.show) return null;

//     const bgColor = notification.type === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
//     const textColor = notification.type === 'success' ? 'text-green-800' : 'text-red-800';

//     return (
//       <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-md border-l-4 ${bgColor} z-50`}>
//         <p className={`font-medium ${textColor}`}>{notification.message}</p>
//       </div>
//     );
//   };

//   const DashboardOverview = () => (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Welcome back, {userData.name || 'Doctor'}!
//             </h1>
//             <p className="text-gray-600 mt-1">
//               {userData.specialization && `Specializing in ${userData.specialization}`}
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Today's Date</p>
//               <p className="font-semibold">{new Date().toLocaleDateString()}</p>
//             </div>
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//               <Stethoscope className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Emergency Toggle */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <AlertCircle className={`w-8 h-8 ${emergencyAvailable ? 'text-green-600' : 'text-red-600'}`} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Emergency Availability</h3>
//               <p className="text-gray-600">You are currently {emergencyAvailable ? 'available' : 'not available'} for emergency consultations</p>
//             </div>
//           </div>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input 
//               type="checkbox" 
//               className="sr-only peer" 
//               checked={emergencyAvailable}
//               onChange={toggleEmergencyAvailability}
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//           </label>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Appointments</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
//             </div>
//             <Calendar className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
//             </div>
//             <Clock className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Patients</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
//             </div>
//             <Heart className="w-8 h-8 text-red-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">This Month</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.consultationsThisMonth}</p>
//             </div>
//             <TrendingUp className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>
//       </div>

//       {/* Today's Appointments */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>

//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : getTodayAppointments().length > 0 ? (
//           <div className="space-y-3">
//             {getTodayAppointments().map((appointment) => (
//               <div key={appointment.id} className={`flex items-center justify-between p-3 rounded-lg ${getStatusClass(appointment.status)}`}>
//                 <div>
//                   <p className="font-medium text-gray-900">{appointment.userName}</p>
//                   <p className="text-sm text-gray-600">{appointment.time}</p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm font-medium capitalize">{appointment.status}</span>

//                   {appointment.status === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => handleAppointmentStatusChange(appointment.id, 'confirmed')}
//                         className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
//                         title="Accept"
//                       >
//                         <CheckCircle className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
//                         className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
//                         title="Reject"
//                       >
//                         <XCircle className="w-4 h-4" />
//                       </button>
//                     </>
//                   )}

//                   {appointment.status === 'confirmed' && (
//                     <button
//                       onClick={() => startVideoConsultation(appointment)}
//                       className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
//                       title="Start Consultation"
//                     >
//                       <Video className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-6 text-gray-500">
//             No appointments scheduled for today
//           </div>
//         )}
//       </div>

//       {/* Professional Info */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex items-center space-x-3">
//             <Award className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm text-gray-600">Experience</p>
//               <p className="font-medium">{userData.experience || 'Not specified'} years</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Stethoscope className="w-5 h-5 text-green-600" />
//             <div>
//               <p className="text-sm text-gray-600">Specialization</p>
//               <p className="font-medium">{userData.specialization || 'General Practice'}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <TrendingUp className="w-5 h-5 text-purple-600" />
//             <div>
//               <p className="text-sm text-gray-600">Rating</p>
//               <p className="font-medium">{stats.rating || '4.5'}/5.0</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const AppointmentsManager = () => {
//     const [filterStatus, setFilterStatus] = useState('all');

//     const filteredAppointments = appointments.filter(appointment => {
//       if (filterStatus === 'all') return true;
//       return appointment.status === filterStatus;
//     });

//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Appointment Management</h2>

//         {/* Filter Tabs */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <div className="flex border-b overflow-x-auto">
//             <button 
//               onClick={() => setFilterStatus('all')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${
//                 filterStatus === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               All Appointments
//             </button>
//             <button 
//               onClick={() => setFilterStatus('pending')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${
//                 filterStatus === 'pending' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Pending
//             </button>
//             <button 
//               onClick={() => setFilterStatus('confirmed')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${
//                 filterStatus === 'confirmed' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Confirmed
//             </button>
//             <button 
//               onClick={() => setFilterStatus('completed')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${
//                 filterStatus === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Completed
//             </button>
//             <button 
//               onClick={() => setFilterStatus('cancelled')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${
//                 filterStatus === 'cancelled' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-800'
//               }`}
//             >
//               Cancelled
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : filteredAppointments.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Patient
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date & Time
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredAppointments.map((appointment) => {
//                     const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
//                     const isPast = appointmentDate < new Date();

//                     return (
//                       <tr key={appointment.id} className={isPast && appointment.status !== 'completed' ? 'bg-gray-50' : ''}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">{appointment.userName}</div>
//                               <div className="text-sm text-gray-500">{appointment.userEmail}</div>
//                               {appointment.userPhone && (
//                                 <div className="text-sm text-gray-500">{appointment.userPhone}</div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{new Date(appointment.date).toDateString()}</div>
//                           <div className="text-sm text-gray-500">{appointment.time}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                             appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                             appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                             'bg-red-100 text-red-800'
//                           }`}>
//                             {appointment.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             {appointment.status === 'pending' && (
//                               <>
//                                 <button
//                                   onClick={() => handleAppointmentStatusChange(appointment.id, 'confirmed')}
//                                   className="text-green-600 hover:text-green-900 mr-2"
//                                   title="Accept"
//                                 >
//                                   <CheckCircle className="w-5 h-5" />
//                                 </button>
//                                 <button
//                                   onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
//                                   className="text-red-600 hover:text-red-900"
//                                   title="Reject"
//                                 >
//                                   <XCircle className="w-5 h-5" />
//                                 </button>
//                               </>
//                             )}
//                             {appointment.status === 'confirmed' && !isPast && (
//                               <button
//                                 onClick={() => startVideoConsultation(appointment)}
//                                 className="text-blue-600 hover:text-blue-900"
//                                 title="Start Consultation"
//                               >
//                                 <Video className="w-5 h-5" />
//                               </button>
//                             )}
//                             {appointment.status === 'confirmed' && (
//                               <button
//                                 onClick={() => handleAppointmentStatusChange(appointment.id, 'completed')}
//                                 className="text-blue-600 hover:text-blue-900"
//                                 title="Mark Completed"
//                               >
//                                 <CheckCircle className="w-5 h-5" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
//               <p className="text-gray-600">
//                 {filterStatus === 'all' 
//                   ? "You don't have any appointments yet."
//                   : `You don't have any ${filterStatus} appointments.`}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const TimeSlotsManager = () => {
//     const [selectedSlots, setSelectedSlots] = useState([]);
//     const [saving, setSaving] = useState(false);
//     const [multipleSelectMode, setMultipleSelectMode] = useState(false);

//     // Days of the week
//     const days = [
//       { id: 'monday', label: 'Monday' },
//       { id: 'tuesday', label: 'Tuesday' },
//       { id: 'wednesday', label: 'Wednesday' },
//       { id: 'thursday', label: 'Thursday' },
//       { id: 'friday', label: 'Friday' },
//       { id: 'saturday', label: 'Saturday' },
//       { id: 'sunday', label: 'Sunday' }
//     ];

//     // Hours in 24-hour format
//     const hours = [9, 10, 11, 12, 14, 15, 16, 17];

//     const formatHour = (hour) => {
//       return hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour-12}:00 PM`;
//     };

//     const toggleSlotSelection = (day, hour) => {
//       const slotKey = `${day}-${hour}`;
//       const isSelected = selectedSlots.includes(slotKey);

//       if (isSelected) {
//         setSelectedSlots(selectedSlots.filter(slot => slot !== slotKey));
//       } else {
//         setSelectedSlots([...selectedSlots, slotKey]);
//       }
//     };

//     const saveMultipleSlots = async () => {
//       if (selectedSlots.length === 0) {
//         showNotification('error', 'No slots selected');
//         return;
//       }

//       setSaving(true);

//       try {
//         // Create a deep copy of the timeSlots
//         const updatedSlots = JSON.parse(JSON.stringify(timeSlots));
//         let hasConflict = false;

//         // Update all selected slots
//         selectedSlots.forEach(slotKey => {
//           const [day, hourStr] = slotKey.split('-');
//           const hour = parseInt(hourStr);

//           // Check for conflicts with existing appointments
//           const formattedDay = formatDayForAppointment(day);
//           const formattedHour = formatHourForAppointment(hour);

//           const conflictingAppointments = appointments.filter(apt => {
//             const aptDate = new Date(apt.date);
//             const aptDay = aptDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//             return (
//               aptDay === day && 
//               apt.time === formattedHour &&
//               apt.status !== 'cancelled' &&
//               apt.status !== 'completed'
//             );
//           });

//           if (conflictingAppointments.length > 0) {
//             showNotification('error', `Cannot update ${day} at ${formatHour(hour)} - you have existing appointments in this slot`);
//             hasConflict = true;
//             return;
//           }

//           // Initialize the day object if it doesn't exist
//           if (!updatedSlots[day]) {
//             updatedSlots[day] = {};
//           }

//           // Set the availability
//           updatedSlots[day][hourStr] = true; // Make all selected slots available
//         });

//         // If there's a conflict, abort the save
//         if (hasConflict) {
//           setSaving(false);
//           return;
//         }

//         // Get Firebase database reference
//         const db = getDatabase();

//         // Determine the path where we need to save the data
//         let vetPath = '';
//         let vetId = '';

//         // Try to get the vet ID from userData
//         if (userData.id) {
//           vetId = userData.id;
//           vetPath = `veterinary/${vetId}`;
//         } 
//         // If no ID, try to find by email
//         else if (userData.email) {
//           console.log("Finding vet by email:", userData.email);
//           const vetsRef = ref(db, 'veterinary');
//           const snapshot = await get(vetsRef);

//           if (snapshot.exists()) {
//             const vets = snapshot.val();
//             // Find the vet with matching email
//             for (const id in vets) {
//               if (vets[id].email === userData.email) {
//                 vetId = id;
//                 vetPath = `veterinary/${vetId}`;
//                 // Update userData with the found ID
//                 setUserData(prev => ({ ...prev, id: vetId }));
//                 sessionStorage.setItem('userData', JSON.stringify({ ...userData, id: vetId }));
//                 console.log("Found vet by email, ID:", vetId);
//                 break;
//               }
//             }
//           }
//         }

//         // If still no ID, try to find by name
//         if (!vetId && userData.name) {
//           console.log("Finding vet by name:", userData.name);
//           const vetsRef = ref(db, 'veterinary');
//           const snapshot = await get(vetsRef);

//           if (snapshot.exists()) {
//             const vets = snapshot.val();
//             // Find the vet with matching name
//             for (const id in vets) {
//               if (vets[id].name === userData.name) {
//                 vetId = id;
//                 vetPath = `veterinary/${vetId}`;
//                 // Update userData with the found ID
//                 setUserData(prev => ({ ...prev, id: vetId }));
//                 sessionStorage.setItem('userData', JSON.stringify({ ...userData, id: vetId }));
//                 console.log("Found vet by name, ID:", vetId);
//                 break;
//               }
//             }
//           }
//         }

//         // If we couldn't determine the vet ID by any method, show error
//         if (!vetPath) {
//           throw new Error('Could not identify vet account. Please log in again.');
//         }

//         console.log(`Saving time slots to path: ${vetPath}`);
//         const vetRef = ref(db, vetPath);

//         // First, fetch the current data to make sure we have the latest
//         const snapshot = await get(vetRef);
//         if (snapshot.exists()) {
//           const currentData = snapshot.val();
//           // Merge with any existing time slots
//           if (currentData.timeSlots) {
//             // Keep existing slots that aren't being updated
//             Object.keys(currentData.timeSlots).forEach(day => {
//               if (!updatedSlots[day]) {
//                 updatedSlots[day] = currentData.timeSlots[day];
//               } else {
//                 // For days that exist in both, merge the hours
//                 Object.keys(currentData.timeSlots[day]).forEach(hour => {
//                   if (updatedSlots[day][hour] === undefined) {
//                     updatedSlots[day][hour] = currentData.timeSlots[day][hour];
//                   }
//                 });
//               }
//             });
//           }
//         }

//         // Log what we're about to save
//         console.log('Updating time slots in Firebase:', updatedSlots);

//         // Now save the merged data
//         await update(vetRef, {
//           timeSlots: updatedSlots,
//           lastUpdated: new Date().toISOString() // Add timestamp for tracking
//         });

//         // Verify the data was saved
//         const verifySnapshot = await get(vetRef);
//         if (verifySnapshot.exists()) {
//           const verifyData = verifySnapshot.val();
//           console.log('Verification data after save:', verifyData.timeSlots);

//           // Update local state with verified data from Firebase
//           setTimeSlots(verifyData.timeSlots);
//           showNotification('success', `${selectedSlots.length} time slots updated successfully`);

//           // Clear selection
//           setSelectedSlots([]);
//         } else {
//           throw new Error('Failed to verify data was saved');
//         }
//       } catch (error) {
//         console.error("Error updating time slots:", error);
//         showNotification('error', 'Failed to update time slots: ' + error.message);
//       } finally {
//         setSaving(false);
//       }
//     };

//     const updateTimeSlot = async (day, hour, available) => {
//       // If in multiple select mode, just toggle selection
//       if (multipleSelectMode) {
//         toggleSlotSelection(day, hour);
//         return;
//       }

//       // Check for conflicts with existing appointments if making slot unavailable
//       if (!available) {
//         const formattedDay = formatDayForAppointment(day);
//         const formattedHour = formatHourForAppointment(hour);

//         const conflictingAppointments = appointments.filter(apt => {
//           const aptDate = new Date(apt.date);
//           const aptDay = aptDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//           return (
//             aptDay === day && 
//             apt.time === formattedHour &&
//             apt.status !== 'cancelled' &&
//             apt.status !== 'completed'
//           );
//         });

//         if (conflictingAppointments.length > 0) {
//           showNotification('error', 'Cannot mark as unavailable - you have existing appointments in this slot');
//           return;
//         }
//       }

//       setSaving(true);

//       // Create a deep copy of the timeSlots
//       const updatedSlots = JSON.parse(JSON.stringify(timeSlots));

//       // Update the specific slot
//       if (!updatedSlots[day]) {
//         updatedSlots[day] = {};
//       }
//       updatedSlots[day][hour] = available;

//       // Save to Firebase
//       try {
//         const db = getDatabase();

//         // Determine the path where we need to save the data
//         let vetPath = '';
//         let vetId = '';

//         // Try to get the vet ID from userData
//         if (userData.id) {
//           vetId = userData.id;
//           vetPath = `veterinary/${vetId}`;
//         } 
//         // If no ID, try to find by email
//         else if (userData.email) {
//           console.log("Finding vet by email:", userData.email);
//           const vetsRef = ref(db, 'veterinary');
//           const snapshot = await get(vetsRef);

//           if (snapshot.exists()) {
//             const vets = snapshot.val();
//             // Find the vet with matching email
//             for (const id in vets) {
//               if (vets[id].email === userData.email) {
//                 vetId = id;
//                 vetPath = `veterinary/${vetId}`;
//                 // Update userData with the found ID
//                 setUserData(prev => ({ ...prev, id: vetId }));
//                 sessionStorage.setItem('userData', JSON.stringify({ ...userData, id: vetId }));
//                 console.log("Found vet by email, ID:", vetId);
//                 break;
//               }
//             }
//           }
//         }

//         // If still no ID, try to find by name
//         if (!vetId && userData.name) {
//           console.log("Finding vet by name:", userData.name);
//           const vetsRef = ref(db, 'veterinary');
//           const snapshot = await get(vetsRef);

//           if (snapshot.exists()) {
//             const vets = snapshot.val();
//             // Find the vet with matching name
//             for (const id in vets) {
//               if (vets[id].name === userData.name) {
//                 vetId = id;
//                 vetPath = `veterinary/${vetId}`;
//                 // Update userData with the found ID
//                 setUserData(prev => ({ ...prev, id: vetId }));
//                 sessionStorage.setItem('userData', JSON.stringify({ ...userData, id: vetId }));
//                 console.log("Found vet by name, ID:", vetId);
//                 break;
//               }
//             }
//           }
//         }

//         // If we couldn't determine the vet ID by any method, show error
//         if (!vetPath) {
//           throw new Error('Could not identify vet account. Please log in again.');
//         }

//         console.log(`Saving time slot to path: ${vetPath}`);
//         const vetRef = ref(db, vetPath);

//         console.log('Updating time slot in Firebase:', day, hour, available);
//         console.log('Current timeSlots state before update:', timeSlots);
//         console.log('Updated timeSlots to save:', updatedSlots);

//         await update(vetRef, {
//           timeSlots: updatedSlots,
//           lastUpdated: new Date().toISOString() // Add timestamp for tracking
//         });

//         // Verify the data was saved by fetching it again
//         const verifyRef = ref(db, vetPath);
//         const snapshot = await get(verifyRef);

//         if (snapshot.exists()) {
//           const verifyData = snapshot.val();
//           console.log('Verification data after save:', verifyData.timeSlots);

//           // Update local state with verified data from Firebase
//           setTimeSlots(verifyData.timeSlots);
//           showNotification('success', `Time slot ${available ? 'enabled' : 'disabled'}: ${day} at ${formatHour(hour)}`);
//         } else {
//           throw new Error('Failed to verify data was saved');
//         }
//       } catch (error) {
//         console.error("Error updating time slot:", error);
//         showNotification('error', 'Failed to update time slot: ' + error.message);
//       } finally {
//         setSaving(false);
//       }
//     };

//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Manage Time Slots</h2>

//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Set Your Available Hours</h3>

//             <div className="flex items-center space-x-4">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input 
//                   type="checkbox" 
//                   checked={multipleSelectMode}
//                   onChange={() => {
//                     setMultipleSelectMode(!multipleSelectMode);
//                     setSelectedSlots([]);
//                   }}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Multiple Selection Mode</span>
//               </label>

//               {multipleSelectMode && (
//                 <button
//                   onClick={saveMultipleSlots}
//                   disabled={saving || selectedSlots.length === 0}
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${
//                     saving || selectedSlots.length === 0
//                       ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                   }`}
//                 >
//                   {saving ? 'Saving...' : `Save Selected (${selectedSlots.length})`}
//                 </button>
//               )}
//             </div>
//           </div>

//           <p className="text-gray-600 mb-6">
//             {multipleSelectMode 
//               ? 'Click on multiple time slots to select them, then click "Save Selected".' 
//               : 'Click on the time slots to toggle availability. Blue indicates available, gray indicates unavailable.'}
//           </p>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Day
//                   </th>
//                   {hours.map((hour) => (
//                     <th key={hour} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {formatHour(hour)}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {days.map((day) => (
//                   <tr key={day.id}>
//                     <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
//                       {day.label}
//                     </td>
//                     {hours.map((hour) => {
//                       const isAvailable = timeSlots[day.id]?.[hour] || false;
//                       const isSelected = selectedSlots.includes(`${day.id}-${hour}`);

//                       let buttonClass = '';
//                       if (multipleSelectMode) {
//                         buttonClass = isSelected 
//                           ? 'bg-blue-500 text-white hover:bg-blue-600' 
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
//                       } else {
//                         buttonClass = isAvailable 
//                           ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
//                           : 'bg-gray-100 text-gray-400 hover:bg-gray-200';
//                       }

//                       return (
//                         <td key={`${day.id}-${hour}`} className="px-2 py-4 text-center">
//                           <button
//                             onClick={() => multipleSelectMode 
//                               ? toggleSlotSelection(day.id, hour) 
//                               : updateTimeSlot(day.id, hour, !isAvailable)
//                             }
//                             disabled={saving}
//                             className={`w-full h-8 rounded-md transition-colors ${buttonClass} ${
//                               saving ? 'opacity-50 cursor-not-allowed' : ''
//                             }`}
//                           >
//                             {multipleSelectMode 
//                               ? (isSelected ? 'Selected' : 'Select') 
//                               : (isAvailable ? 'Available' : 'Unavailable')}
//                           </button>
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//             <p className="text-sm text-blue-700">
//               <strong>Note:</strong> Changes to your availability are saved automatically. Make sure to check for any conflicts with existing appointments.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const ProfilePage = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//             <input
//               type="text"
//               value={userData.name || ''}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//             <input
//               type="email"
//               value={userData.email || ''}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//             <input
//               type="tel"
//               value={userData.phone || 'Not provided'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
//             <input
//               type="text"
//               value={userData.specialization || 'Not specified'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//         </div>
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
//           <input
//             type="number"
//             value={userData.experience || ''}
//             readOnly
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//           />
//         </div>
//         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//           <p className="text-sm text-blue-700">
//             <strong>Note:</strong> To update your profile information, please contact the administrator.
//           </p>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h3>
//         <div className="p-4 bg-green-50 rounded-lg flex items-center">
//           <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
//           <div>
//             <p className="font-medium text-green-800">Your documents have been verified</p>
//             <p className="text-sm text-green-700">Your license and credentials have been approved by our team.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const VideoConsultation = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl w-full max-w-5xl h-full max-h-[80vh] flex flex-col overflow-hidden">
//         <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
//           <div className="flex items-center">
//             <Video className="w-5 h-5 mr-2" />
//             <h3 className="font-semibold">Consultation with {activeAppointment?.userName}</h3>
//           </div>
//           <button 
//             onClick={endVideoConsultation}
//             className="p-1 hover:bg-blue-700 rounded"
//           >
//             <XCircle className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="flex-1 grid grid-cols-3 gap-4 p-4">
//           <div className="col-span-2 bg-gray-900 rounded-lg flex items-center justify-center">
//             <div className="text-center text-white">
//               <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
//               <p className="font-medium">Video call would be integrated here</p>
//               <p className="text-sm text-gray-400 mt-2">Using Jitsi, Zoom, or WebRTC</p>
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
//             <h4 className="font-semibold text-gray-900 mb-3">Create Prescription</h4>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//               <textarea
//                 value={prescription.notes}
//                 onChange={(e) => setPrescription({...prescription, notes: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//                 rows={4}
//                 placeholder="Enter prescription notes and instructions..."
//               ></textarea>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>

//               {prescription.medicines.map((medicine, index) => (
//                 <div key={index} className="flex items-center justify-between mb-2 p-2 bg-white rounded border">
//                   <div>
//                     <p className="font-medium text-sm">{medicine.name}</p>
//                     <p className="text-xs text-gray-500">{medicine.dosage} - {medicine.duration}</p>
//                   </div>
//                   <button 
//                     onClick={() => removeMedicine(index)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     <XCircle className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}

//               <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
//                 <div className="grid grid-cols-3 gap-2 mb-2">
//                   <input 
//                     type="text" 
//                     className="col-span-3 px-2 py-1 border border-gray-300 rounded" 
//                     placeholder="Medicine name"
//                     id="medicine-name"
//                   />
//                   <input 
//                     type="text" 
//                     className="px-2 py-1 border border-gray-300 rounded" 
//                     placeholder="Dosage"
//                     id="medicine-dosage"
//                   />
//                   <input 
//                     type="text" 
//                     className="px-2 py-1 border border-gray-300 rounded" 
//                     placeholder="Duration"
//                     id="medicine-duration"
//                   />
//                   <button 
//                     onClick={() => {
//                       const name = document.getElementById('medicine-name').value;
//                       const dosage = document.getElementById('medicine-dosage').value;
//                       const duration = document.getElementById('medicine-duration').value;
//                       addMedicineToList(name, dosage, duration);
//                       document.getElementById('medicine-name').value = '';
//                       document.getElementById('medicine-dosage').value = '';
//                       document.getElementById('medicine-duration').value = '';
//                     }}
//                     className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={submitPrescription}
//               disabled={!prescription.notes}
//               className={`w-full py-2 rounded-lg font-medium ${
//                 prescription.notes ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               Save Prescription & Complete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const PatientsManager = () => {
//     const [patients, setPatients] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filterType, setFilterType] = useState('all'); // all, new, returning
//     const [selectedPatient, setSelectedPatient] = useState(null);
//     const [followUpDate, setFollowUpDate] = useState('');
//     const [followUpNotes, setFollowUpNotes] = useState('');
//     const [showFollowUpModal, setShowFollowUpModal] = useState(false);

//     useEffect(() => {
//       // Fetch patients data
//       const fetchPatients = async () => {
//         try {
//           setLoading(true);
//           const db = getDatabase();
//           const patientsRef = ref(db, 'appointments');

//           const snapshot = await get(patientsRef);
//           const patientsList = [];
//           const uniquePatients = new Map();

//           if (snapshot.exists()) {
//             snapshot.forEach((childSnapshot) => {
//               const appointment = childSnapshot.val();

//               // Only include appointments for this vet
//               if (
//                 appointment.vetId === userData.id ||
//                 (userData.email && appointment.vetEmail === userData.email) ||
//                 (userData.name && appointment.vetName === userData.name)
//               ) {
//                 const userId = appointment.userId;
//                 const userName = appointment.userName;
//                 const userEmail = appointment.userEmail;
//                 const userPhone = appointment.userPhone || '';
//                 const date = appointment.date;
//                 const time = appointment.time;
//                 const status = appointment.status;
//                 const hasPrescription = appointment.hasPrescription || false;

//                 // Create unique key for this patient
//                 const patientKey = `${userId}-${userName}`;

//                 if (!uniquePatients.has(patientKey)) {
//                   // First time seeing this patient
//                   uniquePatients.set(patientKey, {
//                     id: userId,
//                     name: userName,
//                     email: userEmail,
//                     phone: userPhone,
//                     isNew: true,
//                     lastVisit: new Date(`${date} ${time}`),
//                     appointments: [
//                       {
//                         id: childSnapshot.key,
//                         date,
//                         time,
//                         status,
//                         hasPrescription
//                       }
//                     ],
//                     nextFollowUp: appointment.followUpDate ? new Date(appointment.followUpDate) : null,
//                     followUpNotes: appointment.followUpNotes || '',
//                     petDetails: appointment.petDetails || {
//                       name: 'Not specified',
//                       type: 'Not specified',
//                       breed: 'Not specified',
//                       age: 'Not specified'
//                     }
//                   });
//                 } else {
//                   // Existing patient - add this appointment
//                   const patient = uniquePatients.get(patientKey);
//                   patient.appointments.push({
//                     id: childSnapshot.key,
//                     date,
//                     time,
//                     status,
//                     hasPrescription
//                   });

//                   // Update last visit if this appointment is more recent
//                   const appointmentDate = new Date(`${date} ${time}`);
//                   if (appointmentDate > patient.lastVisit) {
//                     patient.lastVisit = appointmentDate;

//                     // Update next follow-up if available
//                     if (appointment.followUpDate) {
//                       patient.nextFollowUp = new Date(appointment.followUpDate);
//                       patient.followUpNotes = appointment.followUpNotes || '';
//                     }
//                   }

//                   // Not a new patient anymore if they have multiple appointments
//                   if (patient.appointments.length > 1) {
//                     patient.isNew = false;
//                   }

//                   // Update pet details if available
//                   if (appointment.petDetails) {
//                     patient.petDetails = appointment.petDetails;
//                   }
//                 }
//               }
//             });

//             // Convert map to array and sort by last visit (most recent first)
//             uniquePatients.forEach(patient => {
//               // Sort patient's appointments by date (newest first)
//               patient.appointments.sort((a, b) => {
//                 return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
//               });

//               patientsList.push(patient);
//             });

//             patientsList.sort((a, b) => b.lastVisit - a.lastVisit);
//             setPatients(patientsList);
//           }
//           setLoading(false);
//         } catch (error) {
//           console.error("Error fetching patients:", error);
//           showNotification('error', 'Failed to load patients data');
//           setLoading(false);
//         }
//       };

//       fetchPatients();
//     }, [userData.id, userData.email, userData.name]);

//     const handleScheduleFollowUp = async () => {
//       if (!selectedPatient || !followUpDate) {
//         showNotification('error', 'Please select a follow-up date');
//         return;
//       }

//       try {
//         const db = getDatabase();

//         // Update the latest appointment with follow-up information
//         const latestAppointmentId = selectedPatient.appointments[0].id;
//         const appointmentRef = ref(db, `appointments/${latestAppointmentId}`);

//         await update(appointmentRef, {
//           followUpDate,
//           followUpNotes,
//           updatedAt: new Date().toISOString()
//         });

//         // Update local state
//         setPatients(patients.map(patient => {
//           if (patient.id === selectedPatient.id) {
//             return {
//               ...patient,
//               nextFollowUp: new Date(followUpDate),
//               followUpNotes
//             };
//           }
//           return patient;
//         }));

//         showNotification('success', 'Follow-up scheduled successfully');
//         setShowFollowUpModal(false);
//         setSelectedPatient(null);
//         setFollowUpDate('');
//         setFollowUpNotes('');
//       } catch (error) {
//         console.error("Error scheduling follow-up:", error);
//         showNotification('error', 'Failed to schedule follow-up');
//       }
//     };

//     const filteredPatients = patients.filter(patient => {
//       if (filterType === 'all') return true;
//       if (filterType === 'new') return patient.isNew;
//       if (filterType === 'returning') return !patient.isNew;
//       return true;
//     });

//     const FollowUpModal = () => (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg w-full max-w-md p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Follow-Up</h3>
//           <p className="mb-4 text-gray-700">Patient: {selectedPatient?.name}</p>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Follow-Up Date</label>
//             <input
//               type="date"
//               value={followUpDate}
//               onChange={(e) => setFollowUpDate(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               min={new Date().toISOString().split('T')[0]}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//             <textarea
//               value={followUpNotes}
//               onChange={(e) => setFollowUpNotes(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               rows={4}
//               placeholder="Add notes about the follow-up..."
//             ></textarea>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => {
//                 setShowFollowUpModal(false);
//                 setSelectedPatient(null);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleScheduleFollowUp}
//               disabled={!followUpDate}
//               className={`px-4 py-2 rounded-lg ${
//                 followUpDate ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               Schedule
//             </button>
//           </div>
//         </div>
//       </div>
//     );

//     const formatDate = (date) => {
//       return new Date(date).toLocaleDateString();
//     };

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-semibold text-gray-800">Patient Records</h2>

//           <div className="flex space-x-2">
//             <button
//               onClick={() => setFilterType('all')}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${
//                 filterType === 'all'
//                   ? 'bg-blue-100 text-blue-700'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               All Patients
//             </button>
//             <button
//               onClick={() => setFilterType('new')}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${
//                 filterType === 'new'
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               New Patients
//             </button>
//             <button
//               onClick={() => setFilterType('returning')}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${
//                 filterType === 'returning'
//                   ? 'bg-purple-100 text-purple-700'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               Returning Patients
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : filteredPatients.length > 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Patient / Pet
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Last Visit
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Next Follow-Up
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredPatients.map((patient) => (
//                     <tr key={patient.id} className={patient.isNew ? 'bg-green-50' : ''}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900 flex items-center">
//                             {patient.name}
//                             {patient.isNew && (
//                               <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
//                                 New
//                               </span>
//                             )}
//                           </div>
//                           <div className="text-sm text-gray-500">{patient.email}</div>
//                           {patient.phone && <div className="text-sm text-gray-500">{patient.phone}</div>}
//                           <div className="mt-1 text-xs text-gray-600">
//                             Pet: {patient.petDetails.name} ({patient.petDetails.type} - {patient.petDetails.breed})
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{formatDate(patient.lastVisit)}</div>
//                         <div className="text-sm text-gray-500">
//                           {patient.appointments[0].time}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col">
//                           <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                             patient.appointments[0].status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                             patient.appointments[0].status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                             patient.appointments[0].status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                             'bg-red-100 text-red-800'
//                           }`}>
//                             {patient.appointments[0].status}
//                           </span>

//                           {patient.appointments[0].hasPrescription && (
//                             <span className="mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
//                               Has Prescription
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {patient.nextFollowUp ? (
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {formatDate(patient.nextFollowUp)}
//                             </div>
//                             {patient.followUpNotes && (
//                               <div className="text-xs text-gray-500 max-w-xs truncate">
//                                 {patient.followUpNotes}
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <span className="text-sm text-gray-500">Not scheduled</span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => {
//                             setSelectedPatient(patient);
//                             setShowFollowUpModal(true);
//                           }}
//                           className="text-blue-600 hover:text-blue-900 mr-3"
//                           title="Schedule Follow-Up"
//                         >
//                           <Calendar className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() => {
//                             // View patient details or medical history
//                           }}
//                           className="text-purple-600 hover:text-purple-900"
//                           title="View Medical History"
//                         >
//                           <FileText className="w-5 h-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//             <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
//             <p className="text-gray-600">
//               {filterType === 'all' 
//                 ? "You don't have any patients yet."
//                 : filterType === 'new'
//                 ? "You don't have any new patients."
//                 : "You don't have any returning patients."}
//             </p>
//           </div>
//         )}

//         {showFollowUpModal && selectedPatient && <FollowUpModal />}
//       </div>
//     );
//   };

//   const ConsultationsManager = () => {
//     const [emergencyConsultations, setEmergencyConsultations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showDeclineModal, setShowDeclineModal] = useState(false);
//     const [selectedConsultation, setSelectedConsultation] = useState(null);
//     const [declineReason, setDeclineReason] = useState('');

//     useEffect(() => {
//       // Fetch emergency consultation requests
//       const fetchEmergencyConsultations = async () => {
//         try {
//           setLoading(true);
//           const db = getDatabase();
//           const consultationsRef = ref(db, 'emergencyRequests');

//           onValue(consultationsRef, (snapshot) => {
//             const consultationsList = [];

//             if (snapshot.exists()) {
//               snapshot.forEach((childSnapshot) => {
//                 const consultation = childSnapshot.val();

//                 // Only include consultations for this vet
//                 if (
//                   consultation.vetId === userData.id ||
//                   (userData.email && consultation.vetEmail === userData.email) ||
//                   (userData.name && consultation.vetName === userData.name) ||
//                   // If no specific vet is assigned yet but we have emergency availability
//                   (consultation.status === 'pending' && !consultation.vetId && emergencyAvailable)
//                 ) {
//                   consultationsList.push({
//                     id: childSnapshot.key,
//                     ...consultation
//                   });
//                 }
//               });
//             }

//             // Sort by creation date (newest first)
//             consultationsList.sort((a, b) => {
//               return new Date(b.createdAt) - new Date(a.createdAt);
//             });

//             setEmergencyConsultations(consultationsList);
//             setLoading(false);
//           });
//         } catch (error) {
//           console.error("Error fetching emergency consultations:", error);
//           showNotification('error', 'Failed to load emergency consultation requests');
//           setLoading(false);
//         }
//       };

//       fetchEmergencyConsultations();
//     }, [userData.id, userData.email, userData.name, emergencyAvailable]);

//     const handleAcceptConsultation = async (consultationId) => {
//       try {
//         const db = getDatabase();
//         const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

//         // Update consultation status
//         await update(consultationRef, {
//           status: 'accepted',
//           vetId: userData.id,
//           vetName: userData.name,
//           vetEmail: userData.email,
//           acceptedAt: new Date().toISOString()
//         });

//         // No need to update local state as onValue will trigger automatically
//         showNotification('success', 'Emergency consultation accepted');
//       } catch (error) {
//         console.error("Error accepting consultation:", error);
//         showNotification('error', 'Failed to accept consultation');
//       }
//     };

//     const handleDeclineConsultation = async () => {
//       if (!selectedConsultation) return;

//       try {
//         const db = getDatabase();
//         const consultationRef = ref(db, `emergencyRequests/${selectedConsultation.id}`);

//         // Update consultation status
//         await update(consultationRef, {
//           status: 'declined',
//           declineReason,
//           declinedAt: new Date().toISOString()
//         });

//         // No need to update local state as onValue will trigger automatically
//         showNotification('success', 'Emergency consultation declined');
//         setShowDeclineModal(false);
//         setSelectedConsultation(null);
//         setDeclineReason('');
//       } catch (error) {
//         console.error("Error declining consultation:", error);
//         showNotification('error', 'Failed to decline consultation');
//       }
//     };

//     const handleCompleteConsultation = async (consultationId) => {
//       try {
//         const db = getDatabase();
//         const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

//         // Update consultation status
//         await update(consultationRef, {
//           status: 'completed',
//           completedAt: new Date().toISOString()
//         });

//         // No need to update local state as onValue will trigger automatically
//         showNotification('success', 'Emergency consultation marked as completed');
//       } catch (error) {
//         console.error("Error completing consultation:", error);
//         showNotification('error', 'Failed to complete consultation');
//       }
//     };

//     const handleDeleteConsultation = async (consultationId) => {
//       try {
//         const db = getDatabase();
//         const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

//         // Delete consultation
//         await set(consultationRef, null);

//         // No need to update local state as onValue will trigger automatically
//         showNotification('success', 'Emergency consultation record removed');
//       } catch (error) {
//         console.error("Error deleting consultation:", error);
//         showNotification('error', 'Failed to delete consultation record');
//       }
//     };

//     const DeclineModal = () => (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg w-full max-w-md p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Decline Emergency Consultation</h3>
//           <p className="mb-4 text-gray-700">Patient: {selectedConsultation?.userName}</p>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
//             <textarea
//               value={declineReason}
//               onChange={(e) => setDeclineReason(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               rows={4}
//               placeholder="Provide a reason for declining this consultation..."
//             ></textarea>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => {
//                 setShowDeclineModal(false);
//                 setSelectedConsultation(null);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeclineConsultation}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Decline
//             </button>
//           </div>
//         </div>
//       </div>
//     );

//     const formatDateTime = (dateTimeStr) => {
//       const date = new Date(dateTimeStr);
//       return date.toLocaleString();
//     };

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-semibold text-gray-800">Emergency Consultations</h2>

//           <div className="flex items-center">
//             <div className={`mr-2 w-3 h-3 rounded-full ${emergencyAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
//             <span className="text-sm text-gray-700">
//               You are currently {emergencyAvailable ? 'available' : 'not available'} for emergency consultations
//             </span>
//             <button
//               onClick={toggleEmergencyAvailability}
//               className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
//                 emergencyAvailable
//                   ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                   : 'bg-green-100 text-green-700 hover:bg-green-200'
//               }`}
//             >
//               {emergencyAvailable ? 'Turn Off' : 'Turn On'}
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : emergencyConsultations.length > 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Patient
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Pet Details
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Requested
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {emergencyConsultations.map((consultation) => (
//                     <tr key={consultation.id} className={consultation.status === 'pending' ? 'bg-yellow-50' : ''}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{consultation.userName}</div>
//                           <div className="text-sm text-gray-500">{consultation.userEmail}</div>
//                           {consultation.userPhone && (
//                             <div className="text-sm text-gray-500">{consultation.userPhone}</div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {consultation.petName || 'Not specified'}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {consultation.petType || 'Type not specified'} - {consultation.petBreed || 'Breed not specified'}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             Age: {consultation.petAge || 'Not specified'}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {formatDateTime(consultation.createdAt)}
//                         </div>
//                         <div className="text-sm text-red-600 font-medium">
//                           Emergency: {consultation.emergencyReason || 'Not specified'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           consultation.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                           consultation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {consultation.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           {consultation.status === 'pending' && (
//                             <>
//                               <button
//                                 onClick={() => handleAcceptConsultation(consultation.id)}
//                                 className="text-green-600 hover:text-green-900"
//                                 title="Accept"
//                               >
//                                 <CheckCircle className="w-5 h-5" />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedConsultation(consultation);
//                                   setShowDeclineModal(true);
//                                 }}
//                                 className="text-red-600 hover:text-red-900"
//                                 title="Decline"
//                               >
//                                 <XCircle className="w-5 h-5" />
//                               </button>
//                             </>
//                           )}

//                           {consultation.status === 'accepted' && (
//                             <button
//                               onClick={() => handleCompleteConsultation(consultation.id)}
//                               className="text-blue-600 hover:text-blue-900"
//                               title="Mark Completed"
//                             >
//                               <CheckCircle className="w-5 h-5" />
//                             </button>
//                           )}

//                           {(consultation.status === 'completed' || consultation.status === 'declined') && (
//                             <button
//                               onClick={() => {
//                                 if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
//                                   handleDeleteConsultation(consultation.id);
//                                 }
//                               }}
//                               className="text-gray-600 hover:text-gray-900"
//                               title="Delete Record"
//                             >
//                               <XCircle className="w-5 h-5" />
//                             </button>
//                           )}

//                           <button
//                             onClick={() => startVideoConsultation({
//                               ...consultation,
//                               time: 'Now', // Emergency consultation is immediate
//                               date: new Date().toISOString().split('T')[0]
//                             })}
//                             className="text-blue-600 hover:text-blue-900"
//                             title="Start Consultation"
//                             disabled={consultation.status === 'completed' || consultation.status === 'declined'}
//                           >
//                             <Video className={`w-5 h-5 ${
//                               consultation.status === 'completed' || consultation.status === 'declined'
//                                 ? 'opacity-30 cursor-not-allowed'
//                                 : ''
//                             }`} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//             <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No emergency consultations</h3>
//             <p className="text-gray-600">
//               {emergencyAvailable
//                 ? "You are available for emergency consultations. Requests will appear here."
//                 : "You are currently not available for emergency consultations. Toggle availability to receive requests."}
//             </p>
//           </div>
//         )}

//         {showDeclineModal && selectedConsultation && <DeclineModal />}
//       </div>
//     );
//   };

//   const renderActivePage = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardOverview />;
//       case 'profile':
//         return <ProfilePage />;
//       case 'appointments':
//         return <AppointmentsManager />;
//       case 'timeslots':
//         return <TimeSlotsManager />;
//       case 'patients':
//         return <PatientsManager />;
//       case 'consultations':
//         return <ConsultationsManager />;
//       default:
//         return <DashboardOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Notification Toast */}
//       <NotificationToast />

//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-6 border-b">
//           <h1 className="text-xl font-bold text-gray-800">Veterinary Portal</h1>
//           <p className="text-sm text-gray-600">{userData.name || 'Doctor'}</p>
//         </div>

//         <nav className="mt-6">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
//                   activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
//                 }`}
//               >
//                 <Icon className="mr-3 h-5 w-5" />
//                 {item.label}
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
//               {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('-', ' ')}
//             </h2>
//             <div className="flex items-center space-x-4">
//               <button className="p-2 text-gray-600 hover:text-gray-800 relative">
//                 <Bell className="h-6 w-6" />
//               </button>
//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-semibold">
//                     {userData.name ? userData.name.charAt(0).toUpperCase() : 'D'}
//                   </span>
//                 </div>
//                 <span className="text-gray-700">{userData.name || 'Doctor'}</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {renderActivePage()}
//         </main>
//       </div>

//       {/* Video Consultation Modal */}
//       {videoConsultActive && activeAppointment && <VideoConsultation />}
//     </div>
//   );
// };

// export default VeterinaryDashboard;




// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Calendar, Users, Activity, TrendingUp, Clock, User,
//   Phone, Mail, MapPin, Settings, LogOut, Bell,
//   FileText, Heart, Stethoscope, Award, Video,
//   CheckCircle, XCircle, Clock4, PenTool, AlertCircle,
//   VolumeX, Volume2
// } from 'lucide-react';
// import { getDatabase, ref, onValue, update, set, push, get, onChildAdded } from 'firebase/database';

// const VeterinaryDashboard = () => {
//   const [userData, setUserData] = useState({});
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [emergencyAvailable, setEmergencyAvailable] = useState(false);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [notesText, setNotesText] = useState('');
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [activeAppointment, setActiveAppointment] = useState(null);
//   const [videoConsultActive, setVideoConsultActive] = useState(false);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [feedbackLoading, setFeedbackLoading] = useState(true);
//   const [prescription, setPrescription] = useState({
//     notes: '',
//     medicines: []
//   });
//   const [stats, setStats] = useState({
//     totalAppointments: 0,
//     todayAppointments: 0,
//     totalPatients: 0,
//     consultationsThisMonth: 0,
//     emergencyConsultations: 0,
//     rating: 0,
//     feedbacks: []
//   });
//   const [notification, setNotification] = useState({ show: false, type: '', message: '' });
//   const [emergencyAlerts, setEmergencyAlerts] = useState([]);
//   const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
//   const [currentEmergencyAlert, setCurrentEmergencyAlert] = useState(null);
//   const [notificationSound] = useState(new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3'));
//   const [soundEnabled, setSoundEnabled] = useState(true);
//   const [unreadNotifications, setUnreadNotifications] = useState(0);
//   const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

//   // Show notification helper
//   const showNotification = (type, message) => {
//     setNotification({ show: true, type, message });
//     setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
//   };

//   // Play notification sound
//   const playNotificationSound = useCallback(() => {
//     if (soundEnabled) {
//       notificationSound.play().catch(error => {
//         console.error("Error playing sound:", error);
//       });
//     }
//   }, [notificationSound, soundEnabled]);


//   // Function to fetch feedback for the current vet
//   const fetchFeedback = useCallback(async () => {
//     try {
//       setFeedbackLoading(true);
//       const db = getDatabase();
//       const feedbackRef = ref(db, 'feedback');

//       onValue(feedbackRef, (snapshot) => {
//         const vetFeedbacks = [];

//         if (snapshot.exists()) {
//           snapshot.forEach((childSnapshot) => {
//             const feedback = childSnapshot.val();

//             // Only include feedback for this vet
//             if (
//               feedback.vetId === userData.id ||
//               (userData.email && feedback.vetEmail === userData.email) ||
//               (userData.name && feedback.vetName === userData.name)
//             ) {
//               vetFeedbacks.push({
//                 id: childSnapshot.key,
//                 ...feedback
//               });
//             }
//           });
//         }

//         // Sort by creation date (newest first)
//         vetFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//         // Calculate average rating
//         const totalRating = vetFeedbacks.reduce((sum, item) => sum + item.rating, 0);
//         const averageRating = vetFeedbacks.length > 0 ? totalRating / vetFeedbacks.length : 0;

//         setFeedbacks(vetFeedbacks);
//         setStats(prevStats => ({
//           ...prevStats,
//           rating: averageRating.toFixed(1),
//           feedbacks: vetFeedbacks
//         }));
//         setFeedbackLoading(false);
//       });
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//       setFeedbackLoading(false);
//     }
//   }, [userData.id, userData.email, userData.name]);


//   // Handle new emergency connection alert
//   const handleEmergencyAlert = useCallback((emergencyData) => {
//     setEmergencyAlerts(prev => [emergencyData, ...prev]);
//     setUnreadNotifications(prev => prev + 1);
//     setCurrentEmergencyAlert(emergencyData);
//     setShowEmergencyAlert(true);
//     playNotificationSound();

//     // Auto-hide alert after 20 seconds if not acted upon
//     setTimeout(() => {
//       setShowEmergencyAlert(false);
//     }, 20000);
//   }, [playNotificationSound]);

//   // Listen for new emergency requests
//   useEffect(() => {
//     const db = getDatabase();
//     const emergencyRequestsRef = ref(db, 'emergencyRequests');

//     // This will fire when a new emergency request is added to the database
//     const unsubscribe = onChildAdded(emergencyRequestsRef, (snapshot) => {
//       const emergencyData = { id: snapshot.key, ...snapshot.val() };

//       // Only show alert if:
//       // 1. The request is new (status = 'pending')
//       // 2. The vet is available for emergencies
//       // 3. Either no vet is assigned yet, or this specific vet is assigned
//       if (
//         emergencyData.status === 'pending' &&
//         emergencyAvailable &&
//         (!emergencyData.vetId || emergencyData.vetId === userData.id ||
//           (userData.email && emergencyData.vetEmail === userData.email) ||
//           (userData.name && emergencyData.vetName === userData.name))
//       ) {
//         handleEmergencyAlert(emergencyData);
//       }
//     });
//     fetchFeedback();
//     return () => unsubscribe();
//   }, [emergencyAvailable, userData.id, userData.email, userData.name, handleEmergencyAlert, fetchFeedback]);

//   useEffect(() => {
//     // Get user data from session storage
//     const storedUserData = sessionStorage.getItem('userData');
//     const storedEmail = sessionStorage.getItem('userEmail');
//     const storedToken = sessionStorage.getItem('vetToken');

//     console.log("Initial session data:", {
//       storedUserData: storedUserData ? 'present' : 'missing',
//       storedEmail,
//       storedToken: storedToken ? 'present' : 'missing'
//     });

//     if (storedUserData) {
//       try {
//         const parsedData = JSON.parse(storedUserData);
//         console.log("Parsed user data:", parsedData);
//         setUserData(parsedData);
//       } catch (error) {
//         console.error("Error parsing userData from session storage:", error);
//       }
//     } else if (storedEmail) {
//       // If we have email but not userData, set email in userData
//       setUserData(prev => ({ ...prev, email: storedEmail }));
//       console.log("Using email from session storage:", storedEmail);
//     }

//     // Fetch veterinarian data and appointments from Firebase
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const db = getDatabase();
//         console.log("Database reference obtained");

//         // WORKAROUND: If we don't have any user data, create a mock entry for testing
//         // Remove this in production - this is just to bypass the ID error
//         if (!storedUserData && !storedEmail && !userData.id && !userData.email) {
//           console.log("No user identification found - using default fallback for testing");
//           // This is just a temporary workaround to prevent the error
//           setUserData({
//             id: "default-vet-id",
//             name: "Doctor",
//             email: "vet@example.com",
//             specialization: "General Practice"
//           });

//           // Create a mock entry in the database if it doesn't exist yet
//           try {
//             const vetRef = ref(db, `veterinary/default-vet-id`);
//             const snapshot = await get(vetRef);
//             if (!snapshot.exists()) {
//               await set(vetRef, {
//                 name: "Doctor",
//                 email: "vet@example.com",
//                 specialization: "General Practice",
//                 experience: 5,
//                 emergencyAvailable: false,
//                 timeSlots: generateDefaultTimeSlots(),
//                 createdAt: new Date().toISOString()
//               });
//               console.log("Created default vet entry for testing");
//             }
//           } catch (err) {
//             console.error("Error creating default vet entry:", err);
//           }
//         }

//         // First, try to find the vet by ID, email, or name
//         let vetId = null;
//         let vetData = null;

//         // Try all possible ways to identify the vet
//         const identifyVet = async () => {
//           // If we have an ID, use it directly
//           if (userData.id) {
//             vetId = userData.id;
//             console.log("Using ID from userData:", vetId);
//             return;
//           }

//           // Otherwise, search for the vet by email
//           if (userData.email || storedEmail) {
//             const emailToUse = userData.email || storedEmail;
//             console.log("Searching for vet by email:", emailToUse);
//             const vetsRef = ref(db, 'veterinary');
//             const snapshot = await get(vetsRef);

//             if (snapshot.exists()) {
//               const vets = snapshot.val();
//               // Find the vet with matching email
//               for (const id in vets) {
//                 if (vets[id].email === emailToUse) {
//                   vetId = id;
//                   vetData = vets[id];
//                   console.log("Found vet by email, ID:", vetId);
//                   return;
//                 }
//               }
//             }
//           }

//           // If still no ID, try to find by name
//           if (userData.name) {
//             console.log("Searching for vet by name:", userData.name);
//             const vetsRef = ref(db, 'veterinary');
//             const snapshot = await get(vetsRef);

//             if (snapshot.exists()) {
//               const vets = snapshot.val();
//               // Find the vet with matching name
//               for (const id in vets) {
//                 if (vets[id].name === userData.name) {
//                   vetId = id;
//                   vetData = vets[id];
//                   console.log("Found vet by name, ID:", vetId);
//                   return;
//                 }
//               }
//             }
//           }

//           // If still no ID found, use default (for development/testing only)
//           if (!vetId) {
//             vetId = "default-vet-id";
//             console.log("Using default vet ID as fallback");
//           }
//         };

//         await identifyVet();

//         // If we found a vet ID, fetch their data
//         if (vetId) {
//           console.log("Fetching data for vet ID:", vetId);
//           const vetRef = ref(db, `veterinary/${vetId}`);

//           // Update userData with the ID we found
//           setUserData(prevData => {
//             const updatedData = { ...prevData, id: vetId };
//             // Store the updated data in session storage
//             sessionStorage.setItem('userData', JSON.stringify(updatedData));
//             console.log("Updated userData with ID:", updatedData);
//             return updatedData;
//           });

//           onValue(vetRef, (snapshot) => {
//             if (snapshot.exists()) {
//               const fetchedVetData = snapshot.val();
//               console.log("Fetched vet data:", fetchedVetData);

//               // Update userData with the latest data
//               setUserData(prevData => {
//                 const newData = { ...prevData, ...fetchedVetData, id: vetId };
//                 // Update session storage with the complete data
//                 sessionStorage.setItem('userData', JSON.stringify(newData));
//                 return newData;
//               });

//               // Set emergency status from DB
//               setEmergencyAvailable(fetchedVetData.emergencyAvailable || false);

//               // Set time slots from DB or use defaults
//               if (fetchedVetData.timeSlots) {
//                 console.log("Setting time slots from DB:", fetchedVetData.timeSlots);
//                 setTimeSlots(fetchedVetData.timeSlots);
//               } else {
//                 const defaultSlots = generateDefaultTimeSlots();
//                 console.log("Setting default time slots:", defaultSlots);
//                 setTimeSlots(defaultSlots);

//                 // Save default time slots to the database
//                 update(vetRef, { timeSlots: defaultSlots })
//                   .then(() => console.log("Default time slots saved to DB"))
//                   .catch(err => console.error("Error saving default time slots:", err));
//               }
//             } else {
//               console.log("No vet data found, using defaults");
//               const defaultSlots = generateDefaultTimeSlots();
//               setTimeSlots(defaultSlots);

//               // Create a default vet profile if it doesn't exist
//               set(vetRef, {
//                 id: vetId,
//                 name: userData.name || "Doctor",
//                 email: userData.email || storedEmail || "vet@example.com",
//                 specialization: "General Practice",
//                 experience: 0,
//                 emergencyAvailable: false,
//                 timeSlots: defaultSlots,
//                 createdAt: new Date().toISOString()
//               })
//                 .then(() => console.log("Created default vet profile"))
//                 .catch(err => console.error("Error creating default profile:", err));
//             }
//           });

//           // Fetch all appointments for this veterinarian
//           const appointmentsRef = ref(db, 'appointments');
//           onValue(appointmentsRef, (snapshot) => {
//             const appointmentsList = [];
//             const uniquePatients = new Set();
//             let todayCount = 0;
//             let monthlyCount = 0;
//             let emergencyCount = 0;

//             const today = new Date();
//             const thisMonth = today.getMonth();
//             const thisYear = today.getFullYear();

//             if (snapshot.exists()) {
//               snapshot.forEach((childSnapshot) => {
//                 const appointment = childSnapshot.val();

//                 // Include appointments for this vet by ID, email, or name
//                 if (
//                   appointment.vetId === vetId ||
//                   (userData.email && appointment.vetEmail === userData.email) ||
//                   (storedEmail && appointment.vetEmail === storedEmail) ||
//                   (userData.name && appointment.vetName === userData.name)
//                 ) {
//                   // Add ID to appointment object
//                   const appointmentWithId = {
//                     id: childSnapshot.key,
//                     ...appointment
//                   };

//                   appointmentsList.push(appointmentWithId);

//                   // Count unique patients
//                   uniquePatients.add(appointment.userId);

//                   // Count today's appointments
//                   const appointmentDate = new Date(appointment.date);
//                   if (
//                     appointmentDate.getDate() === today.getDate() &&
//                     appointmentDate.getMonth() === today.getMonth() &&
//                     appointmentDate.getFullYear() === today.getFullYear()
//                   ) {
//                     todayCount++;
//                   }

//                   // Count this month's consultations
//                   if (
//                     appointmentDate.getMonth() === thisMonth &&
//                     appointmentDate.getFullYear() === thisYear &&
//                     appointment.status !== 'pending' &&
//                     appointment.status !== 'cancelled'
//                   ) {
//                     monthlyCount++;
//                   }

//                   // Count emergency consultations
//                   if (appointment.isEmergency) {
//                     emergencyCount++;
//                   }
//                 }
//               });
//             }

//             // Sort by date (newest first)
//             appointmentsList.sort((a, b) => {
//               const dateA = new Date(`${a.date} ${a.time}`);
//               const dateB = new Date(`${b.date} ${b.time}`);
//               return dateA - dateB;
//             });

//             console.log(`Found ${appointmentsList.length} appointments for this vet`);
//             setAppointments(appointmentsList);

//             // Update stats
//             setStats(prevStats => ({
//               ...prevStats,
//               totalAppointments: appointmentsList.length,
//               todayAppointments: todayCount,
//               totalPatients: uniquePatients.size,
//               consultationsThisMonth: monthlyCount,
//               emergencyConsultations: emergencyCount
//             }));

//             setLoading(false);
//           });

//           // Fetch emergency requests and check for pending ones
//           const emergencyRequestsRef = ref(db, 'emergencyRequests');
//           onValue(emergencyRequestsRef, (snapshot) => {
//             const emergencyList = [];

//             if (snapshot.exists()) {
//               snapshot.forEach((childSnapshot) => {
//                 const emergency = childSnapshot.val();

//                 // Include emergency requests for this vet or unassigned ones if vet is available
//                 if (
//                   emergency.status === 'pending' &&
//                   (emergency.vetId === vetId ||
//                     (userData.email && emergency.vetEmail === userData.email) ||
//                     (userData.name && emergency.vetName === userData.name) ||
//                     !emergency.vetId) // Unassigned requests
//                 ) {
//                   emergencyList.push({
//                     id: childSnapshot.key,
//                     ...emergency
//                   });
//                 }
//               });
//             }

//             // Update emergency alerts list
//             setEmergencyAlerts(emergencyList);
//             setUnreadNotifications(emergencyList.length);
//           });
//         } else {
//           console.error("Could not find vet ID by any method");
//           showNotification('error', 'Could not identify your account. Please log in again.');
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//         showNotification('error', 'Failed to load data. Please refresh the page.');
//       }
//     };

//     fetchData();
//   }, []);

//   const handleLogout = () => {
//     // Clear all session data
//     sessionStorage.removeItem('vetToken');
//     sessionStorage.removeItem('userData');
//     sessionStorage.removeItem('userEmail');
//     sessionStorage.clear();

//     showNotification('success', 'Logged out successfully! Redirecting to login...');
//     setTimeout(() => {
//       window.location.href = '/login';
//     }, 1500);
//   };

//   const toggleEmergencyAvailability = async () => {
//     try {
//       const newStatus = !emergencyAvailable;
//       setEmergencyAvailable(newStatus);

//       // Update in Firebase
//       if (userData.id) {
//         const db = getDatabase();
//         const vetRef = ref(db, `veterinary/${userData.id}`);
//         await update(vetRef, {
//           emergencyAvailable: newStatus
//         });
//         showNotification('success', `Emergency availability ${newStatus ? 'enabled' : 'disabled'}`);
//       }
//     } catch (error) {
//       console.error("Error updating emergency status:", error);
//       // Revert UI state on error
//       setEmergencyAvailable(!emergencyAvailable);
//       showNotification('error', 'Failed to update emergency status.');
//     }
//   };



//   const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
//     try {
//       const db = getDatabase();
//       const appointmentRef = ref(db, `appointments/${appointmentId}`);

//       // Get current appointment data
//       const snapshot = await get(appointmentRef);
//       if (!snapshot.exists()) {
//         throw new Error("Appointment not found");
//       }

//       const appointmentData = snapshot.val();

//       // Update appointment status
//       await update(appointmentRef, {
//         status: newStatus,
//         updatedAt: new Date().toISOString()
//       });

//       // UI will update automatically through the onValue listener
//       showNotification('success', `Appointment ${newStatus === 'confirmed' ? 'accepted' : newStatus === 'cancelled' ? 'rejected' : 'updated'} successfully`);

//       // Create updated appointment object with the new status
//       const updatedAppointment = {
//         ...appointmentData,
//         id: appointmentId,
//         status: newStatus
//       };

//       // Share via WhatsApp if phone number exists
//       if (updatedAppointment.userPhone) {
//         const whatsappUrl = createWhatsAppLink(updatedAppointment);
//         if (whatsappUrl) {
//           // Ask if user wants to share via WhatsApp
//           if (window.confirm('Would you like to send appointment details via WhatsApp?')) {
//             window.open(whatsappUrl, '_blank');
//           }
//         }
//       }

//     } catch (error) {
//       console.error("Error updating appointment status:", error);
//       showNotification('error', 'Failed to update appointment status.');
//     }
//   };


//   const startVideoConsultation = (appointment) => {
//     setActiveAppointment(appointment);
//     setVideoConsultActive(true);

//     // If this is from an emergency request, update the status in Firebase
//     if (appointment.isEmergency) {
//       try {
//         const db = getDatabase();

//         // Check if this came from emergencyRequests
//         if (appointment.fromEmergencyRequest && appointment.emergencyRequestId) {
//           const emergencyRef = ref(db, `emergencyRequests/${appointment.emergencyRequestId}`);
//           update(emergencyRef, {
//             status: 'active',
//             startedAt: new Date().toISOString()
//           });
//         }

//         // Update appointment status if needed
//         if (appointment.id) {
//           const appointmentRef = ref(db, `appointments/${appointment.id}`);
//           update(appointmentRef, {
//             status: 'confirmed',
//             consultationStarted: true,
//             consultationStartTime: new Date().toISOString()
//           });
//         }
//       } catch (error) {
//         console.error("Error updating emergency consultation status:", error);
//       }
//     }
//   };

//   const endVideoConsultation = () => {
//     setVideoConsultActive(false);

//     // Record consultation completion if it was an emergency
//     if (activeAppointment && activeAppointment.isEmergency) {
//       try {
//         const db = getDatabase();

//         // Update emergency request if it exists
//         if (activeAppointment.fromEmergencyRequest && activeAppointment.emergencyRequestId) {
//           const emergencyRef = ref(db, `emergencyRequests/${activeAppointment.emergencyRequestId}`);
//           update(emergencyRef, {
//             status: 'completed',
//             endedAt: new Date().toISOString()
//           });
//         }

//         // Update appointment
//         if (activeAppointment.id) {
//           const appointmentRef = ref(db, `appointments/${activeAppointment.id}`);
//           update(appointmentRef, {
//             status: 'completed',
//             consultationEnded: true,
//             consultationEndTime: new Date().toISOString()
//           });
//         }
//       } catch (error) {
//         console.error("Error completing emergency consultation:", error);
//       }
//     }

//     setActiveAppointment(null);
//   };

//   const handleEmergencyResponse = async (accept, emergencyData) => {
//     try {
//       const db = getDatabase();
//       const emergencyRef = ref(db, `emergencyRequests/${emergencyData.id}`);

//       if (accept) {
//         // Accept the emergency consultation
//         await update(emergencyRef, {
//           status: 'accepted',
//           vetId: userData.id,
//           vetName: userData.name,
//           vetEmail: userData.email,
//           acceptedAt: new Date().toISOString()
//         });

//         // Start the video consultation
//         const emergencyAppointment = {
//           ...emergencyData,
//           isEmergency: true,
//           fromEmergencyRequest: true,
//           emergencyRequestId: emergencyData.id,
//           date: new Date().toISOString().split('T')[0],
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           status: 'confirmed'
//         };

//         startVideoConsultation(emergencyAppointment);
//         showNotification('success', 'Emergency consultation accepted');
//       } else {
//         // Decline the emergency consultation
//         await update(emergencyRef, {
//           status: 'declined',
//           vetId: userData.id,
//           vetName: userData.name,
//           vetEmail: userData.email,
//           declinedAt: new Date().toISOString(),
//           declineReason: 'Vet is unavailable at this time'
//         });

//         showNotification('info', 'Emergency consultation declined');
//       }

//       // Hide the emergency alert
//       setShowEmergencyAlert(false);
//       setCurrentEmergencyAlert(null);

//       // Reduce unread notifications count
//       setUnreadNotifications(prev => Math.max(0, prev - 1));

//       // Refresh emergency alerts list
//       setEmergencyAlerts(prev => prev.filter(alert => alert.id !== emergencyData.id));
//     } catch (error) {
//       console.error("Error responding to emergency consultation:", error);
//       showNotification('error', 'Failed to respond to emergency consultation');
//     }
//   };

//   const submitPrescription = async () => {
//     const notesText = document.getElementById('prescription-notes').value;

//     if (!activeAppointment || !notesText) {
//       showNotification('error', 'Please add prescription details first');
//       return;
//     }

//     try {
//       const db = getDatabase();

//       // Create prescription in DB
//       const prescriptionsRef = ref(db, 'prescriptions');
//       const newPrescriptionRef = push(prescriptionsRef);

//       await set(newPrescriptionRef, {
//         appointmentId: activeAppointment.id,
//         userId: activeAppointment.userId,
//         vetId: userData.id,
//         vetName: userData.name,
//         date: new Date().toISOString(),
//         notes: notesText,
//         medicines: prescription.medicines,
//         status: 'active'
//       });

//       // Rest of your code...

//       // Reset state
//       setPrescription({ notes: '', medicines: [] });
//       document.getElementById('prescription-notes').value = '';
//       showNotification('success', 'Prescription saved successfully');
//       endVideoConsultation();
//     } catch (error) {
//       console.error("Error saving prescription:", error);
//       showNotification('error', 'Failed to save prescription. Please try again.');
//     }
//   };

//   const addMedicineToList = (medicineName, dosage, duration) => {
//     if (!medicineName) {
//       showNotification('error', 'Medicine name is required');
//       return;
//     }

//     setPrescription(prev => ({
//       ...prev,
//       medicines: [
//         ...prev.medicines,
//         { name: medicineName, dosage, duration }
//       ]
//     }));
//   };

//   const removeMedicine = (index) => {
//     setPrescription(prev => ({
//       ...prev,
//       medicines: prev.medicines.filter((_, i) => i !== index)
//     }));
//   };

//   const updateTimeSlot = async (day, hour, available) => {
//     // Check for conflicts with existing appointments
//     if (!available) {
//       const formattedDay = formatDayForAppointment(day);
//       const formattedHour = formatHourForAppointment(hour);

//       const conflictingAppointments = appointments.filter(apt => {
//         const aptDate = new Date(apt.date);
//         const aptDay = aptDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//         return (
//           aptDay === day &&
//           apt.time === formattedHour &&
//           apt.status !== 'cancelled' &&
//           apt.status !== 'completed'
//         );
//       });

//       if (conflictingAppointments.length > 0) {
//         showNotification('error', 'Cannot mark as unavailable - you have existing appointments in this slot');
//         return;
//       }
//     }

//     // Create a deep copy of the timeSlots
//     const updatedSlots = JSON.parse(JSON.stringify(timeSlots));

//     // Update the specific slot
//     if (!updatedSlots[day]) {
//       updatedSlots[day] = {};
//     }
//     updatedSlots[day][hour] = available;

//     setTimeSlots(updatedSlots);

//     // Save to Firebase
//     try {
//       if (userData.id) {
//         const db = getDatabase();
//         const vetRef = ref(db, `veterinary/${userData.id}`);
//         await update(vetRef, {
//           timeSlots: updatedSlots
//         });
//         showNotification('success', 'Time slot updated successfully');
//       }
//     } catch (error) {
//       console.error("Error updating time slots:", error);
//       // Revert UI state on error
//       setTimeSlots(timeSlots);
//       showNotification('error', 'Failed to update time slot');
//     }
//   };

//   const formatDayForAppointment = (day) => {
//     // Convert day string to date format
//     const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//     const dayIndex = days.indexOf(day.toLowerCase());
//     const today = new Date();
//     const currentDayIndex = today.getDay();
//     const diff = dayIndex - currentDayIndex;

//     const targetDate = new Date();
//     targetDate.setDate(today.getDate() + diff + (diff < 0 ? 7 : 0));

//     return targetDate.toISOString().split('T')[0];
//   };

//   const formatHourForAppointment = (hour) => {
//     // Convert hour number to formatted time string (e.g., "9:00 AM")
//     const isPM = hour >= 12;
//     const hour12 = hour === 12 ? 12 : hour % 12;
//     return `${hour12}:00 ${isPM ? 'PM' : 'AM'}`;
//   };

//   const generateDefaultTimeSlots = () => {
//     const slots = {};
//     const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
//     const hours = [9, 10, 11, 12, 14, 15, 16, 17];

//     days.forEach(day => {
//       slots[day] = {};
//       hours.forEach(hour => {
//         // By default, make weekday slots available (Monday to Friday)
//         const isWeekend = day === 'saturday' || day === 'sunday';
//         slots[day][hour] = !isWeekend;
//       });
//     });

//     return slots;
//   };

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Activity },
//     { id: 'appointments', label: 'Appointments', icon: Calendar },
//     { id: 'patients', label: 'Patients', icon: Heart },
//     // { id: 'consultations', label: 'Consultations', icon: Stethoscope },
//     { id: 'timeslots', label: 'Time Slots', icon: Clock },
//     { id: 'profile', label: 'Profile', icon: User },
//   ];

//   const getTodayAppointments = () => {
//     const today = new Date();
//     return appointments.filter(appointment => {
//       const appointmentDate = new Date(appointment.date);
//       return (
//         appointmentDate.getDate() === today.getDate() &&
//         appointmentDate.getMonth() === today.getMonth() &&
//         appointmentDate.getFullYear() === today.getFullYear() &&
//         appointment.status !== 'cancelled'
//       );
//     });
//   };

//   const getStatusClass = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-50 text-yellow-600';
//       case 'confirmed':
//         return 'bg-green-50 text-green-600';
//       case 'cancelled':
//         return 'bg-red-50 text-red-600';
//       case 'completed':
//         return 'bg-blue-50 text-blue-600';
//       default:
//         return 'bg-gray-50 text-gray-600';
//     }
//   };

//   const NotificationToast = () => {
//     if (!notification.show) return null;

//     const bgColor = notification.type === 'success' ? 'bg-green-100 border-green-500' :
//       notification.type === 'error' ? 'bg-red-100 border-red-500' :
//         'bg-blue-100 border-blue-500';
//     const textColor = notification.type === 'success' ? 'text-green-800' :
//       notification.type === 'error' ? 'text-red-800' :
//         'text-blue-800';

//     return (
//       <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-md border-l-4 ${bgColor} z-50`}>
//         <p className={`font-medium ${textColor}`}>{notification.message}</p>
//       </div>
//     );
//   };

//   const EmergencyAlertModal = () => {
//     if (!showEmergencyAlert || !currentEmergencyAlert) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg w-full max-w-md p-6 animate-pulse-once">
//           <div className="flex items-center mb-4">
//             <div className="bg-red-100 p-3 rounded-full mr-3">
//               <AlertCircle className="h-6 w-6 text-red-600" />
//             </div>
//             <h3 className="text-xl font-bold text-red-600">Emergency Consultation!</h3>
//           </div>

//           <div className="mb-6">
//             <p className="font-medium mb-2">A patient is requesting an emergency consultation:</p>
//             <div className="bg-red-50 p-3 rounded-lg">
//               <p><span className="font-medium">Patient:</span> {currentEmergencyAlert.userName}</p>
//               <p><span className="font-medium">Reason:</span> {currentEmergencyAlert.emergencyReason || 'Medical emergency'}</p>
//               <p><span className="font-medium">Time:</span> {new Date(currentEmergencyAlert.createdAt).toLocaleTimeString()}</p>
//             </div>
//           </div>

//           <div className="flex justify-between">
//             <button
//               onClick={() => handleEmergencyResponse(false, currentEmergencyAlert)}
//               className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Decline
//             </button>
//             <button
//               onClick={() => handleEmergencyResponse(true, currentEmergencyAlert)}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Accept & Start Consultation
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const NotificationsPanel = () => {
//     if (!showNotificationsPanel) return null;

//     return (
//       <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-auto">
//         <div className="flex justify-between items-center p-4 border-b">
//           <h3 className="font-semibold text-gray-900">Notifications</h3>
//           <button
//             className="text-gray-500 hover:text-gray-700"
//             onClick={() => setShowNotificationsPanel(false)}
//           >
//             <XCircle className="w-5 h-5" />
//           </button>
//         </div>

//         {emergencyAlerts.length > 0 ? (
//           <div className="divide-y">
//             {emergencyAlerts.map(alert => (
//               <div key={alert.id} className="p-3 hover:bg-gray-50">
//                 <div className="flex items-center mb-1">
//                   <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
//                   <p className="font-medium text-sm">Emergency Request</p>
//                   <span className="ml-auto text-xs text-gray-500">
//                     {new Date(alert.createdAt).toLocaleTimeString()}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-700 mb-1">
//                   {alert.userName} needs emergency consultation
//                 </p>
//                 <div className="flex mt-2">
//                   <button
//                     onClick={() => handleEmergencyResponse(false, alert)}
//                     className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2 hover:bg-gray-200"
//                   >
//                     Decline
//                   </button>
//                   <button
//                     onClick={() => handleEmergencyResponse(true, alert)}
//                     className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
//                   >
//                     Accept
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="py-6 text-center text-gray-500">
//             <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
//             <p>No notifications</p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const DashboardOverview = () => (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Welcome back, {userData.name || 'Doctor'}!
//             </h1>
//             <p className="text-gray-600 mt-1">
//               {userData.specialization && `Specializing in ${userData.specialization}`}
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="text-right">
//               <p className="text-sm text-gray-500">Today's Date</p>
//               <p className="font-semibold">{new Date().toLocaleDateString()}</p>
//             </div>
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//               <Stethoscope className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Emergency Toggle */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <AlertCircle className={`w-8 h-8 ${emergencyAvailable ? 'text-green-600' : 'text-red-600'}`} />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900">Emergency Availability</h3>
//               <p className="text-gray-600">You are currently {emergencyAvailable ? 'available' : 'not available'} for emergency consultations</p>
//             </div>
//           </div>
//           <div className="flex items-center">
//             <button
//               onClick={() => setSoundEnabled(!soundEnabled)}
//               className="mr-4 p-2 rounded-full hover:bg-gray-100"
//               title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
//             >
//               {soundEnabled ? (
//                 <Volume2 className="w-5 h-5 text-blue-600" />
//               ) : (
//                 <VolumeX className="w-5 h-5 text-gray-500" />
//               )}
//             </button>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={emergencyAvailable}
//                 onChange={toggleEmergencyAvailability}
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Appointments</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
//             </div>
//             <Calendar className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
//             </div>
//             <Clock className="w-8 h-8 text-green-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Patients</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
//             </div>
//             <Heart className="w-8 h-8 text-red-600" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border relative overflow-hidden">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Emergency Consults</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.emergencyConsultations}</p>
//             </div>
//             <AlertCircle className="w-8 h-8 text-red-600" />
//           </div>

//           {emergencyAlerts.length > 0 && (
//             <div className="absolute -right-1 -top-1">
//               <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white">
//                 {emergencyAlerts.length}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Today's Appointments */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>

//         {loading ? (
//           <div className="flex justify-center items-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : getTodayAppointments().length > 0 ? (
//           <div className="space-y-3">
//             {getTodayAppointments().map((appointment) => (
//               <div key={appointment.id} className={`flex items-center justify-between p-3 rounded-lg ${getStatusClass(appointment.status)}`}>
//                 <div>
//                   <p className="font-medium text-gray-900">{appointment.userName}</p>
//                   <p className="text-sm text-gray-600">{appointment.time}</p>
//                   {appointment.isEmergency && (
//                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
//                       <AlertCircle className="w-3 h-3 mr-1" />
//                       Emergency
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm font-medium capitalize">{appointment.status}</span>

//                   {appointment.status === 'pending' && (
//                     <>
//                       <button
//                         onClick={() => handleAppointmentStatusChange(appointment.id, 'confirmed')}
//                         className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
//                         title="Accept"
//                       >
//                         <CheckCircle className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
//                         className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
//                         title="Reject"
//                       >
//                         <XCircle className="w-4 h-4" />
//                       </button>
//                     </>
//                   )}

//                   {appointment.status === 'confirmed' && (
//                     <button
//                       onClick={() => startVideoConsultation(appointment)}
//                       className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
//                       title="Start Consultation"
//                     >
//                       <Video className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-6 text-gray-500">
//             No appointments scheduled for today
//           </div>
//         )}
//       </div>

//       {/* Emergency Requests Section */}
//       {emergencyAlerts.length > 0 && (
//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <div className="flex items-center mb-4">
//             <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
//             <h3 className="text-lg font-semibold text-red-600">Pending Emergency Requests</h3>
//           </div>

//           <div className="space-y-3">
//             {emergencyAlerts.map(alert => (
//               <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="font-medium">{alert.userName}</p>
//                     <p className="text-sm text-gray-700 mt-1">
//                       Requested at {new Date(alert.createdAt).toLocaleTimeString()}
//                     </p>
//                     <p className="text-sm text-red-700 mt-1">
//                       Reason: {alert.emergencyReason || 'Medical emergency'}
//                     </p>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleEmergencyResponse(false, alert)}
//                       className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//                     >
//                       Decline
//                     </button>
//                     <button
//                       onClick={() => handleEmergencyResponse(true, alert)}
//                       className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                     >
//                       Accept
//                     </button>
//                   </div>

//                   {appointments.userPhone && (
//                     <button
//                       onClick={() => {
//                         const whatsappUrl = createWhatsAppLink(appointments);
//                         if (whatsappUrl) {
//                           window.open(whatsappUrl, '_blank');
//                         }
//                       }}
//                       className="text-green-600 hover:text-green-900"
//                       title="Share via WhatsApp"
//                     >
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
//                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Professional Info */}
//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex items-center space-x-3">
//             <Award className="w-5 h-5 text-blue-600" />
//             <div>
//               <p className="text-sm text-gray-600">Experience</p>
//               <p className="font-medium">{userData.experience || 'Not specified'} years</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Stethoscope className="w-5 h-5 text-green-600" />
//             <div>
//               <p className="text-sm text-gray-600">Specialization</p>
//               <p className="font-medium">{userData.specialization || 'General Practice'}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <TrendingUp className="w-5 h-5 text-purple-600" />
//             <div>
//               <p className="text-sm text-gray-600">Rating</p>
//               <p className="font-medium">{stats.rating || '4.5'}/5.0</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const FeedbackSection = () => (
//     <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Feedback</h3>

//       {feedbackLoading ? (
//         <div className="flex justify-center items-center py-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       ) : feedbacks.length > 0 ? (
//         <div className="space-y-4">
//           <div className="flex items-center mb-6">
//             <div className="bg-blue-100 p-3 rounded-full mr-3">
//               <div className="text-2xl font-bold text-blue-600">{stats.rating}</div>
//             </div>
//             <div>
//               <div className="flex">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <svg
//                     key={star}
//                     className={`w-5 h-5 ${star <= Math.round(parseFloat(stats.rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                 ))}
//               </div>
//               <p className="text-sm text-gray-600 mt-1">Based on {feedbacks.length} reviews</p>
//             </div>
//           </div>

//           {feedbacks.slice(0, 5).map((feedback) => (
//             <div key={feedback.id} className="border rounded-lg p-4 bg-gray-50">
//               <div className="flex justify-between items-start mb-2">
//                 <div>
//                   <p className="font-medium">{feedback.userName}</p>
//                   <div className="flex mt-1">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <svg
//                         key={star}
//                         className={`w-4 h-4 ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </svg>
//                     ))}
//                   </div>
//                 </div>
//                 <span className="text-xs text-gray-500">
//                   {new Date(feedback.createdAt).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-gray-700 text-sm">{feedback.feedback}</p>
//               <div className="text-xs text-gray-500 mt-2">
//                 Appointment: {new Date(feedback.appointmentDate).toLocaleDateString()} at {feedback.appointmentTime}
//               </div>
//             </div>
//           ))}

//           {feedbacks.length > 5 && (
//             <div className="text-center pt-2">
//               <button
//                 className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                 onClick={() => {
//                   // You could implement a modal to show all feedback
//                   showNotification('info', 'Showing 5 most recent reviews');
//                 }}
//               >
//                 See all {feedbacks.length} reviews
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="text-center py-6 text-gray-500">
//           <p>You haven't received any feedback yet.</p>
//         </div>
//       )}
//     </div>
//   );

//   const createWhatsAppLink = (appointment) => {
//     if (!appointment || !appointment.userPhone) {
//       showNotification('error', 'No phone number available for WhatsApp');
//       return null;
//     }

//     // Format the phone number (remove any non-numeric characters)
//     const phone = appointment.userPhone.replace(/\D/g, '');

//     // Create message text
//     const message = `
// Hello ${appointment.userName},

// Your appointment with Dr. ${userData.name} has been ${appointment.status}.

// Details:
// - Date: ${new Date(appointment.date).toLocaleDateString()}
// - Time: ${appointment.time}
// - Status: ${appointment.status}
// ${appointment.isEmergency ? '- Type: Emergency Consultation' : ''}

// If you have any questions, please contact us.

// Thank you,
// Pet-Vet Platform
//   `.trim();

//     // Create WhatsApp URL
//     const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

//     return whatsappUrl;
//   };




//   const AppointmentsManager = () => {
//     const [filterStatus, setFilterStatus] = useState('all');

//     const filteredAppointments = appointments.filter(appointment => {
//       if (filterStatus === 'all') return true;
//       if (filterStatus === 'emergency') return appointment.isEmergency;
//       return appointment.status === filterStatus;
//     });

//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Appointment Management</h2>

//         {/* Filter Tabs */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <div className="flex border-b overflow-x-auto">
//             <button
//               onClick={() => setFilterStatus('all')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//             >
//               All Appointments
//             </button>
//             <button
//               onClick={() => setFilterStatus('emergency')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'emergency' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//             >
//               Emergency
//             </button>
//             <button
//               onClick={() => setFilterStatus('pending')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'pending' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//             >
//               Pending
//             </button>
//             <button
//               onClick={() => setFilterStatus('confirmed')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'confirmed' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//             >
//               Confirmed
//             </button>
//             <button
//               onClick={() => setFilterStatus('completed')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//             >
//               Completed
//             </button>
//             <button
//               onClick={() => setFilterStatus('cancelled')}
//               className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'cancelled' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-800'
//                 }`}
//             >
//               Cancelled
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : filteredAppointments.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Patient
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date & Time
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Type
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredAppointments.map((appointment) => {
//                     const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
//                     const isPast = appointmentDate < new Date();

//                     return (
//                       <tr key={appointment.id} className={isPast && appointment.status !== 'completed' ? 'bg-gray-50' : appointment.isEmergency ? 'bg-red-50' : ''}>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">{appointment.userName}</div>
//                               <div className="text-sm text-gray-500">{appointment.userEmail}</div>
//                               {appointment.userPhone && (
//                                 <div className="text-sm text-gray-500">{appointment.userPhone}</div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm text-gray-900">{new Date(appointment.date).toDateString()}</div>
//                           <div className="text-sm text-gray-500">{appointment.time}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                             appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                               appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                                 'bg-red-100 text-red-800'
//                             }`}>
//                             {appointment.status}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.isEmergency ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
//                             }`}>
//                             {appointment.isEmergency ? 'Emergency' : 'Regular'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex space-x-2">
//                             {appointment.status === 'pending' && (
//                               <>
//                                 <button
//                                   onClick={() => handleAppointmentStatusChange(appointment.id, 'confirmed')}
//                                   className="text-green-600 hover:text-green-900 mr-2"
//                                   title="Accept"
//                                 >
//                                   <CheckCircle className="w-5 h-5" />
//                                 </button>
//                                 <button
//                                   onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
//                                   className="text-red-600 hover:text-red-900"
//                                   title="Reject"
//                                 >
//                                   <XCircle className="w-5 h-5" />
//                                 </button>
//                               </>
//                             )}
//                             {appointment.status === 'confirmed' && !isPast && (
//                               <button
//                                 onClick={() => startVideoConsultation(appointment)}
//                                 className="text-blue-600 hover:text-blue-900"
//                                 title="Start Consultation"
//                               >
//                                 <Video className="w-5 h-5" />
//                               </button>
//                             )}
//                             {appointment.status === 'confirmed' && (
//                               <button
//                                 onClick={() => handleAppointmentStatusChange(appointment.id, 'completed')}
//                                 className="text-blue-600 hover:text-blue-900"
//                                 title="Mark Completed"
//                               >
//                                 <CheckCircle className="w-5 h-5" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
//               <p className="text-gray-600">
//                 {filterStatus === 'all'
//                   ? "You don't have any appointments yet."
//                   : filterStatus === 'emergency'
//                     ? "You don't have any emergency appointments."
//                     : `You don't have any ${filterStatus} appointments.`}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const ConsultationsManager = () => {
//     const [emergencyConsultations, setEmergencyConsultations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showDeclineModal, setShowDeclineModal] = useState(false);
//     const [selectedConsultation, setSelectedConsultation] = useState(null);
//     const [declineReason, setDeclineReason] = useState('');
//     const [filter, setFilter] = useState('all');

//     useEffect(() => {
//       // Fetch emergency consultation requests
//       const fetchEmergencyConsultations = async () => {
//         try {
//           setLoading(true);
//           const db = getDatabase();
//           const consultationsRef = ref(db, 'emergencyRequests');

//           onValue(consultationsRef, (snapshot) => {
//             const consultationsList = [];

//             if (snapshot.exists()) {
//               snapshot.forEach((childSnapshot) => {
//                 const consultation = childSnapshot.val();

//                 // Only include consultations for this vet
//                 if (
//                   consultation.vetId === userData.id ||
//                   (userData.email && consultation.vetEmail === userData.email) ||
//                   (userData.name && consultation.vetName === userData.name) ||
//                   // If no specific vet is assigned yet but we have emergency availability
//                   (consultation.status === 'pending' && !consultation.vetId && emergencyAvailable)
//                 ) {
//                   consultationsList.push({
//                     id: childSnapshot.key,
//                     ...consultation
//                   });
//                 }
//               });
//             }

//             // Sort by creation date (newest first)
//             consultationsList.sort((a, b) => {
//               return new Date(b.createdAt) - new Date(a.createdAt);
//             });

//             setEmergencyConsultations(consultationsList);
//             setLoading(false);
//           });
//         } catch (error) {
//           console.error("Error fetching emergency consultations:", error);
//           showNotification('error', 'Failed to load emergency consultation requests');
//           setLoading(false);
//         }
//       };

//       fetchEmergencyConsultations();
//     }, [userData.id, userData.email, userData.name, emergencyAvailable]);

//     const handleAcceptConsultation = async (consultationId) => {
//       try {
//         const db = getDatabase();
//         const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

//         // Get the consultation data
//         const snapshot = await get(consultationRef);
//         if (!snapshot.exists()) {
//           throw new Error("Consultation not found");
//         }

//         const consultation = snapshot.val();

//         // Update consultation status
//         await update(consultationRef, {
//           status: 'accepted',
//           vetId: userData.id,
//           vetName: userData.name,
//           vetEmail: userData.email,
//           acceptedAt: new Date().toISOString()
//         });

//         // Start video consultation
//         const emergencyAppointment = {
//           ...consultation,
//           id: consultationId,
//           isEmergency: true,
//           fromEmergencyRequest: true,
//           emergencyRequestId: consultationId,
//           date: new Date().toISOString().split('T')[0],
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           status: 'confirmed'
//         };

//         startVideoConsultation(emergencyAppointment);

//         // No need to update local state as onValue will trigger automatically
//         showNotification('success', 'Emergency consultation accepted');
//       } catch (error) {
//         console.error("Error accepting consultation:", error);
//         showNotification('error', 'Failed to accept consultation');
//       }
//     };

//     const handleDeclineConsultation = async () => {
//       if (!selectedConsultation) return;

//       try {
//         const db = getDatabase();
//         const consultationRef = ref(db, `emergencyRequests/${selectedConsultation.id}`);

//         // Update consultation status
//         await update(consultationRef, {
//           status: 'declined',
//           declineReason,
//           declinedAt: new Date().toISOString(),
//           vetId: userData.id,
//           vetName: userData.name,
//           vetEmail: userData.email
//         });

//         // No need to update local state as onValue will trigger automatically
//         showNotification('success', 'Emergency consultation declined');
//         setShowDeclineModal(false);
//         setSelectedConsultation(null);
//         setDeclineReason('');
//       } catch (error) {
//         console.error("Error declining consultation:", error);
//         showNotification('error', 'Failed to decline consultation');
//       }
//     };

//     const handleCompleteConsultation = async (consultationId) => {
//       try {
//         const db = getDatabase();
//         const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

//         // Update consultation status
//         await update(consultationRef, {
//           status: 'completed',
//           completedAt: new Date().toISOString()
//         });

//         // No need to update local state as onValue will trigger automatically
//         showNotification('success', 'Emergency consultation marked as completed');
//       } catch (error) {
//         console.error("Error completing consultation:", error);
//         showNotification('error', 'Failed to complete consultation');
//       }
//     };

//     const handleDeleteConsultation = async (consultationId) => {
//       try {
//         const db = getDatabase();
//         const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

//         // Delete consultation
//         await set(consultationRef, null);

//         // No need to update local state as onValue will trigger automatically
//         showNotification('success', 'Emergency consultation record removed');
//       } catch (error) {
//         console.error("Error deleting consultation:", error);
//         showNotification('error', 'Failed to delete consultation record');
//       }
//     };

//     const DeclineModal = () => (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg w-full max-w-md p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Decline Emergency Consultation</h3>
//           <p className="mb-4 text-gray-700">Patient: {selectedConsultation?.userName}</p>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
//             <textarea
//               value={declineReason}
//               onChange={(e) => setDeclineReason(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               rows={4}
//               placeholder="Provide a reason for declining this consultation..."
//             ></textarea>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => {
//                 setShowDeclineModal(false);
//                 setSelectedConsultation(null);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleDeclineConsultation}
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Decline
//             </button>
//           </div>
//         </div>
//       </div>
//     );

//     const formatDateTime = (dateTimeStr) => {
//       const date = new Date(dateTimeStr);
//       return date.toLocaleString();
//     };

//     const filteredConsultations = emergencyConsultations.filter(consultation => {
//       if (filter === 'all') return true;
//       return consultation.status === filter;
//     });

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-semibold text-gray-800">Emergency Consultations</h2>

//           <div className="flex items-center">
//             <div className={`mr-2 w-3 h-3 rounded-full ${emergencyAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
//             <span className="text-sm text-gray-700">
//               You are currently {emergencyAvailable ? 'available' : 'not available'} for emergency consultations
//             </span>
//             <button
//               onClick={toggleEmergencyAvailability}
//               className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${emergencyAvailable
//                 ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                 : 'bg-green-100 text-green-700 hover:bg-green-200'
//                 }`}
//             >
//               {emergencyAvailable ? 'Turn Off' : 'Turn On'}
//             </button>
//           </div>
//         </div>

//         {/* Filter tabs */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           <div className="flex border-b">
//             <button
//               onClick={() => setFilter('all')}
//               className={`px-4 py-2 font-medium ${filter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setFilter('pending')}
//               className={`px-4 py-2 font-medium ${filter === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               Pending
//             </button>
//             <button
//               onClick={() => setFilter('accepted')}
//               className={`px-4 py-2 font-medium ${filter === 'accepted' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               Accepted
//             </button>
//             <button
//               onClick={() => setFilter('completed')}
//               className={`px-4 py-2 font-medium ${filter === 'completed' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               Completed
//             </button>
//             <button
//               onClick={() => setFilter('declined')}
//               className={`px-4 py-2 font-medium ${filter === 'declined' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//             >
//               Declined
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : filteredConsultations.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Patient
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Emergency Details
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Requested
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredConsultations.map((consultation) => (
//                     <tr key={consultation.id} className={consultation.status === 'pending' ? 'bg-yellow-50' : ''}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">{consultation.userName}</div>
//                           <div className="text-sm text-gray-500">{consultation.userEmail}</div>
//                           {consultation.userPhone && (
//                             <div className="text-sm text-gray-500">{consultation.userPhone}</div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {consultation.petName || 'Not specified'}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {consultation.petType || 'Type not specified'} - {consultation.petBreed || 'Breed not specified'}
//                           </div>
//                           <div className="text-sm text-red-600">
//                             {consultation.emergencyReason || 'Emergency consultation'}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {formatDateTime(consultation.createdAt)}
//                         </div>
//                         {consultation.acceptedAt && (
//                           <div className="text-sm text-green-600">
//                             Accepted: {formatDateTime(consultation.acceptedAt)}
//                           </div>
//                         )}
//                         {consultation.completedAt && (
//                           <div className="text-sm text-blue-600">
//                             Completed: {formatDateTime(consultation.completedAt)}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           consultation.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                             consultation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                               'bg-red-100 text-red-800'
//                           }`}>
//                           {consultation.status}
//                         </span>

//                         {consultation.status === 'declined' && consultation.declineReason && (
//                           <div className="mt-1 text-xs text-gray-500">
//                             Reason: {consultation.declineReason}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           {consultation.status === 'pending' && (
//                             <>
//                               <button
//                                 onClick={() => handleAcceptConsultation(consultation.id)}
//                                 className="text-green-600 hover:text-green-900"
//                                 title="Accept"
//                               >
//                                 <CheckCircle className="w-5 h-5" />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedConsultation(consultation);
//                                   setShowDeclineModal(true);
//                                 }}
//                                 className="text-red-600 hover:text-red-900"
//                                 title="Decline"
//                               >
//                                 <XCircle className="w-5 h-5" />
//                               </button>
//                             </>
//                           )}

//                           {consultation.status === 'accepted' && (
//                             <>
//                               <button
//                                 onClick={() => handleCompleteConsultation(consultation.id)}
//                                 className="text-blue-600 hover:text-blue-900"
//                                 title="Mark Completed"
//                               >
//                                 <CheckCircle className="w-5 h-5" />
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   const emergencyAppointment = {
//                                     ...consultation,
//                                     isEmergency: true,
//                                     fromEmergencyRequest: true,
//                                     emergencyRequestId: consultation.id,
//                                     date: new Date().toISOString().split('T')[0],
//                                     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                                     status: 'confirmed'
//                                   };
//                                   startVideoConsultation(emergencyAppointment);
//                                 }}
//                                 className="text-blue-600 hover:text-blue-900"
//                                 title="Start/Resume Consultation"
//                               >
//                                 <Video className="w-5 h-5" />
//                               </button>
//                             </>
//                           )}

//                           {(consultation.status === 'completed' || consultation.status === 'declined') && (
//                             <button
//                               onClick={() => {
//                                 if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
//                                   handleDeleteConsultation(consultation.id);
//                                 }
//                               }}
//                               className="text-gray-600 hover:text-gray-900"
//                               title="Delete Record"
//                             >
//                               <XCircle className="w-5 h-5" />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//               <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No emergency consultations</h3>
//               <p className="text-gray-600">
//                 {emergencyAvailable
//                   ? filter === 'all'
//                     ? "You are available for emergency consultations. Requests will appear here."
//                     : `No ${filter} emergency consultations found.`
//                   : "You are currently not available for emergency consultations. Toggle availability to receive requests."}
//               </p>
//             </div>
//           )}
//         </div>

//         {showDeclineModal && selectedConsultation && <DeclineModal />}
//       </div>
//     );
//   };

//   const TimeSlotsManager = () => {
//     const [selectedSlots, setSelectedSlots] = useState([]);
//     const [saving, setSaving] = useState(false);
//     const [multipleSelectMode, setMultipleSelectMode] = useState(false);

//     // Days of the week
//     const days = [
//       { id: 'monday', label: 'Monday' },
//       { id: 'tuesday', label: 'Tuesday' },
//       { id: 'wednesday', label: 'Wednesday' },
//       { id: 'thursday', label: 'Thursday' },
//       { id: 'friday', label: 'Friday' },
//       { id: 'saturday', label: 'Saturday' },
//       { id: 'sunday', label: 'Sunday' }
//     ];

//     // Hours in 24-hour format
//     const hours = [9, 10, 11, 12, 14, 15, 16, 17];

//     const formatHour = (hour) => {
//       return hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
//     };

//     const toggleSlotSelection = (day, hour) => {
//       const slotKey = `${day}-${hour}`;
//       const isSelected = selectedSlots.includes(slotKey);

//       if (isSelected) {
//         setSelectedSlots(selectedSlots.filter(slot => slot !== slotKey));
//       } else {
//         setSelectedSlots([...selectedSlots, slotKey]);
//       }
//     };

//     const saveMultipleSlots = async () => {
//       if (selectedSlots.length === 0) {
//         showNotification('error', 'No slots selected');
//         return;
//       }

//       setSaving(true);

//       try {
//         // Create a deep copy of the timeSlots
//         const updatedSlots = JSON.parse(JSON.stringify(timeSlots));
//         let hasConflict = false;

//         // Update all selected slots
//         selectedSlots.forEach(slotKey => {
//           const [day, hourStr] = slotKey.split('-');
//           const hour = parseInt(hourStr);

//           // Check for conflicts with existing appointments
//           const formattedDay = formatDayForAppointment(day);
//           const formattedHour = formatHourForAppointment(hour);

//           const conflictingAppointments = appointments.filter(apt => {
//             const aptDate = new Date(apt.date);
//             const aptDay = aptDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//             return (
//               aptDay === day &&
//               apt.time === formattedHour &&
//               apt.status !== 'cancelled' &&
//               apt.status !== 'completed'
//             );
//           });

//           if (conflictingAppointments.length > 0) {
//             showNotification('error', `Cannot update ${day} at ${formatHour(hour)} - you have existing appointments in this slot`);
//             hasConflict = true;
//             return;
//           }

//           // Initialize the day object if it doesn't exist
//           if (!updatedSlots[day]) {
//             updatedSlots[day] = {};
//           }

//           // Set the availability
//           updatedSlots[day][hourStr] = true; // Make all selected slots available
//         });

//         // If there's a conflict, abort the save
//         if (hasConflict) {
//           setSaving(false);
//           return;
//         }

//         // Get Firebase database reference
//         const db = getDatabase();

//         // Determine the path where we need to save the data
//         let vetPath = '';
//         let vetId = '';

//         // Try to get the vet ID from userData
//         if (userData.id) {
//           vetId = userData.id;
//           vetPath = `veterinary/${vetId}`;
//         }
//         // If no ID, try to find by email
//         else if (userData.email) {
//           console.log("Finding vet by email:", userData.email);
//           const vetsRef = ref(db, 'veterinary');
//           const snapshot = await get(vetsRef);

//           if (snapshot.exists()) {
//             const vets = snapshot.val();
//             // Find the vet with matching email
//             for (const id in vets) {
//               if (vets[id].email === userData.email) {
//                 vetId = id;
//                 vetPath = `veterinary/${vetId}`;
//                 // Update userData with the found ID
//                 setUserData(prev => ({ ...prev, id: vetId }));
//                 sessionStorage.setItem('userData', JSON.stringify({ ...userData, id: vetId }));
//                 console.log("Found vet by email, ID:", vetId);
//                 break;
//               }
//             }
//           }
//         }

//         // If still no ID, try to find by name
//         if (!vetId && userData.name) {
//           console.log("Finding vet by name:", userData.name);
//           const vetsRef = ref(db, 'veterinary');
//           const snapshot = await get(vetsRef);

//           if (snapshot.exists()) {
//             const vets = snapshot.val();
//             // Find the vet with matching name
//             for (const id in vets) {
//               if (vets[id].name === userData.name) {
//                 vetId = id;
//                 vetPath = `veterinary/${vetId}`;
//                 // Update userData with the found ID
//                 setUserData(prev => ({ ...prev, id: vetId }));
//                 sessionStorage.setItem('userData', JSON.stringify({ ...userData, id: vetId }));
//                 console.log("Found vet by name, ID:", vetId);
//                 break;
//               }
//             }
//           }
//         }

//         // If we couldn't determine the vet ID by any method, show error
//         if (!vetPath) {
//           throw new Error('Could not identify vet account. Please log in again.');
//         }

//         console.log(`Saving time slots to path: ${vetPath}`);
//         const vetRef = ref(db, vetPath);

//         // First, fetch the current data to make sure we have the latest
//         const snapshot = await get(vetRef);
//         if (snapshot.exists()) {
//           const currentData = snapshot.val();
//           // Merge with any existing time slots
//           if (currentData.timeSlots) {
//             // Keep existing slots that aren't being updated
//             Object.keys(currentData.timeSlots).forEach(day => {
//               if (!updatedSlots[day]) {
//                 updatedSlots[day] = currentData.timeSlots[day];
//               } else {
//                 // For days that exist in both, merge the hours
//                 Object.keys(currentData.timeSlots[day]).forEach(hour => {
//                   if (updatedSlots[day][hour] === undefined) {
//                     updatedSlots[day][hour] = currentData.timeSlots[day][hour];
//                   }
//                 });
//               }
//             });
//           }
//         }

//         // Log what we're about to save
//         console.log('Updating time slots in Firebase:', updatedSlots);

//         // Now save the merged data
//         await update(vetRef, {
//           timeSlots: updatedSlots,
//           lastUpdated: new Date().toISOString() // Add timestamp for tracking
//         });

//         // Verify the data was saved
//         const verifySnapshot = await get(vetRef);
//         if (verifySnapshot.exists()) {
//           const verifyData = verifySnapshot.val();
//           console.log('Verification data after save:', verifyData.timeSlots);

//           // Update local state with verified data from Firebase
//           setTimeSlots(verifyData.timeSlots);
//           showNotification('success', `${selectedSlots.length} time slots updated successfully`);

//           // Clear selection
//           setSelectedSlots([]);
//         } else {
//           throw new Error('Failed to verify data was saved');
//         }
//       } catch (error) {
//         console.error("Error updating time slots:", error);
//         showNotification('error', 'Failed to update time slots: ' + error.message);
//       } finally {
//         setSaving(false);
//       }
//     };

//     return (
//       <div className="space-y-6">
//         <h2 className="text-2xl font-semibold text-gray-800">Manage Time Slots</h2>

//         <div className="bg-white rounded-xl shadow-sm border p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">Set Your Available Hours</h3>

//             <div className="flex items-center space-x-4">
//               <label className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={multipleSelectMode}
//                   onChange={() => {
//                     setMultipleSelectMode(!multipleSelectMode);
//                     setSelectedSlots([]);
//                   }}
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Multiple Selection Mode</span>
//               </label>

//               {multipleSelectMode && (
//                 <button
//                   onClick={saveMultipleSlots}
//                   disabled={saving || selectedSlots.length === 0}
//                   className={`px-4 py-2 rounded-md text-sm font-medium ${saving || selectedSlots.length === 0
//                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                     }`}
//                 >
//                   {saving ? 'Saving...' : `Save Selected (${selectedSlots.length})`}
//                 </button>
//               )}
//             </div>
//           </div>

//           <p className="text-gray-600 mb-6">
//             {multipleSelectMode
//               ? 'Click on multiple time slots to select them, then click "Save Selected".'
//               : 'Click on the time slots to toggle availability. Blue indicates available, gray indicates unavailable.'}
//           </p>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Day
//                   </th>
//                   {hours.map((hour) => (
//                     <th key={hour} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       {formatHour(hour)}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {days.map((day) => (
//                   <tr key={day.id}>
//                     <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
//                       {day.label}
//                     </td>
//                     {hours.map((hour) => {
//                       const isAvailable = timeSlots[day.id]?.[hour] || false;
//                       const isSelected = selectedSlots.includes(`${day.id}-${hour}`);

//                       let buttonClass = '';
//                       if (multipleSelectMode) {
//                         buttonClass = isSelected
//                           ? 'bg-blue-500 text-white hover:bg-blue-600'
//                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
//                       } else {
//                         buttonClass = isAvailable
//                           ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
//                           : 'bg-gray-100 text-gray-400 hover:bg-gray-200';
//                       }

//                       return (
//                         <td key={`${day.id}-${hour}`} className="px-2 py-4 text-center">
//                           <button
//                             onClick={() => multipleSelectMode
//                               ? toggleSlotSelection(day.id, hour)
//                               : updateTimeSlot(day.id, hour, !isAvailable)
//                             }
//                             disabled={saving}
//                             className={`w-full h-8 rounded-md transition-colors ${buttonClass} ${saving ? 'opacity-50 cursor-not-allowed' : ''
//                               }`}
//                           >
//                             {multipleSelectMode
//                               ? (isSelected ? 'Selected' : 'Select')
//                               : (isAvailable ? 'Available' : 'Unavailable')}
//                           </button>
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//             <p className="text-sm text-blue-700">
//               <strong>Note:</strong> Changes to your availability are saved automatically. Make sure to check for any conflicts with existing appointments.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const ProfilePage = () => (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
//             <input
//               type="text"
//               value={userData.name || ''}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//             <input
//               type="email"
//               value={userData.email || ''}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//             <input
//               type="tel"
//               value={userData.phone || 'Not provided'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
//             <input
//               type="text"
//               value={userData.specialization || 'Not specified'}
//               readOnly
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//             />
//           </div>
//         </div>
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
//           <input
//             type="number"
//             value={userData.experience || ''}
//             readOnly
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//           />
//         </div>

//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Consultation Settings</label>
//           <div className="p-4 bg-gray-50 rounded-lg">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="font-medium">Emergency Availability</p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   When enabled, you'll receive alerts for emergency consultation requests
//                 </p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => setSoundEnabled(!soundEnabled)}
//                   className="p-2 rounded-full hover:bg-gray-200"
//                   title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
//                 >
//                   {soundEnabled ? (
//                     <Volume2 className="w-5 h-5 text-blue-600" />
//                   ) : (
//                     <VolumeX className="w-5 h-5 text-gray-500" />
//                   )}
//                 </button>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={emergencyAvailable}
//                     onChange={toggleEmergencyAvailability}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//           <p className="text-sm text-blue-700">
//             <strong>Note:</strong> To update your profile information, please contact the administrator.
//           </p>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h3>
//         <div className="p-4 bg-green-50 rounded-lg flex items-center">
//           <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
//           <div>
//             <p className="font-medium text-green-800">Your documents have been verified</p>
//             <p className="text-sm text-green-700">Your license and credentials have been approved by our team.</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
//         <div className="space-y-4">
//           <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
//             <div>
//               <p className="font-medium">Emergency Alert Sound</p>
//               <p className="text-sm text-gray-600">Play sound when new emergency requests arrive</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={soundEnabled}
//                 onChange={() => setSoundEnabled(!soundEnabled)}
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>
//         </div>
//       </div>
//       <FeedbackSection />
//     </div>
//   );

//   // const VideoConsultation = () => (
//   //   <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//   //     <div className="bg-white rounded-xl w-full max-w-5xl h-full max-h-[80vh] flex flex-col overflow-hidden">
//   //       <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
//   //         <div className="flex items-center">
//   //           <Video className="w-5 h-5 mr-2" />
//   //           <h3 className="font-semibold">
//   //             {activeAppointment?.isEmergency ? 'Emergency' : ''} Consultation with {activeAppointment?.userName}
//   //           </h3>
//   //         </div>
//   //         <button
//   //           onClick={endVideoConsultation}
//   //           className="p-1 hover:bg-blue-700 rounded"
//   //         >
//   //           <XCircle className="w-5 h-5" />
//   //         </button>
//   //       </div>

//   //       <div className="flex-1 grid grid-cols-3 gap-4 p-4">
//   //         <div className="col-span-2 bg-gray-900 rounded-lg flex items-center justify-center">
//   //           <div className="text-center text-white">
//   //             <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
//   //             <p className="font-medium">Video call would be integrated here</p>
//   //             <p className="text-sm text-gray-400 mt-2">Using Jitsi, Zoom, or WebRTC</p>
//   //           </div>
//   //         </div>

//   //         <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
//   //           <h4 className="font-semibold text-gray-900 mb-3">Create Prescription</h4>

//   //           {activeAppointment?.isEmergency && (
//   //             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//   //               <p className="text-sm font-medium text-red-800 flex items-center">
//   //                 <AlertCircle className="w-4 h-4 mr-1" />
//   //                 Emergency Consultation
//   //               </p>
//   //               <p className="text-xs text-red-700 mt-1">
//   //                 Reason: {activeAppointment.emergencyReason || 'Emergency medical situation'}
//   //               </p>
//   //             </div>
//   //           )}

//   //           <div className="mb-4">
//   //             <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//   //             <textarea
//   //               id="prescription-notes"
//   //               defaultValue={prescription.notes}
//   //               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//   //               rows="4"
//   //               placeholder="Enter your description here..."
//   //             ></textarea>
//   //           </div>



//   //           <div className="mb-4">
//   //             <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>

//   //             {prescription.medicines.map((medicine, index) => (
//   //               <div key={index} className="flex items-center justify-between mb-2 p-2 bg-white rounded border">
//   //                 <div>
//   //                   <p className="font-medium text-sm">{medicine.name}</p>
//   //                   <p className="text-xs text-gray-500">{medicine.dosage} - {medicine.duration}</p>
//   //                 </div>
//   //                 <button
//   //                   onClick={() => removeMedicine(index)}
//   //                   className="text-red-600 hover:text-red-800"
//   //                 >
//   //                   <XCircle className="w-4 h-4" />
//   //                 </button>
//   //               </div>
//   //             ))}

//   //             <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
//   //               <div className="grid grid-cols-3 gap-2 mb-2">
//   //                 <input
//   //                   type="text"
//   //                   className="col-span-3 px-2 py-1 border border-gray-300 rounded"
//   //                   placeholder="Medicine name"
//   //                   id="medicine-name"
//   //                 />
//   //                 <input
//   //                   type="text"
//   //                   className="px-2 py-1 border border-gray-300 rounded"
//   //                   placeholder="Dosage"
//   //                   id="medicine-dosage"
//   //                 />
//   //                 <input
//   //                   type="text"
//   //                   className="px-2 py-1 border border-gray-300 rounded"
//   //                   placeholder="Duration"
//   //                   id="medicine-duration"
//   //                 />
//   //                 <button
//   //                   onClick={() => {
//   //                     const name = document.getElementById('medicine-name').value;
//   //                     const dosage = document.getElementById('medicine-dosage').value;
//   //                     const duration = document.getElementById('medicine-duration').value;
//   //                     addMedicineToList(name, dosage, duration);
//   //                     document.getElementById('medicine-name').value = '';
//   //                     document.getElementById('medicine-dosage').value = '';
//   //                     document.getElementById('medicine-duration').value = '';
//   //                   }}
//   //                   className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//   //                 >
//   //                   Add
//   //                 </button>
//   //               </div>
//   //             </div>
//   //           </div>

//   //           <button
//   //             onClick={submitPrescription}
//   //             disabled={!prescription.notes}
//   //             className={`w-full py-2 rounded-lg font-medium ${prescription.notes ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//   //               }`}
//   //           >
//   //             Save Prescription & Complete
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );

//   const VideoConsultation = () => (
//   <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//     <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">

//       {/* Header */}
//       <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
//         <div className="flex items-center">
//           <Video className="w-5 h-5 mr-2" />
//           <h3 className="font-semibold">
//             {activeAppointment?.isEmergency ? 'Emergency' : ''} Consultation with {activeAppointment?.userName}
//           </h3>
//         </div>
//         <button
//           onClick={endVideoConsultation}
//           className="p-1 hover:bg-blue-700 rounded"
//         >
//           <XCircle className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Scrollable body */}
//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="grid grid-cols-3 gap-4">

//           {/* Video Placeholder */}
//           <div className="col-span-2 bg-gray-900 rounded-lg flex items-center justify-center min-h-[300px]">
//             <div className="text-center text-white">
//               <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
//               <p className="font-medium">Video call would be integrated here</p>
//               <p className="text-sm text-gray-400 mt-2">Using Jitsi, Zoom, or WebRTC</p>
//             </div>
//           </div>

//           {/* Prescription Panel */}
//           <div className="bg-gray-50 rounded-lg p-4 max-h-[65vh] overflow-y-auto">
//             <h4 className="font-semibold text-gray-900 mb-3">Create Prescription</h4>

//             {activeAppointment?.isEmergency && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-sm font-medium text-red-800 flex items-center">
//                   <AlertCircle className="w-4 h-4 mr-1" />
//                   Emergency Consultation
//                 </p>
//                 <p className="text-xs text-red-700 mt-1">
//                   Reason: {activeAppointment.emergencyReason || 'Emergency medical situation'}
//                 </p>
//               </div>
//             )}

//             {/* Notes */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//               <textarea
//                 id="prescription-notes"
//                 defaultValue={prescription.notes}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 rows="4"
//                 placeholder="Enter your description here..."
//               ></textarea>
//             </div>

//             {/* Medicines List */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>

//               {prescription.medicines.map((medicine, index) => (
//                 <div key={index} className="flex items-center justify-between mb-2 p-2 bg-white rounded border">
//                   <div>
//                     <p className="font-medium text-sm">{medicine.name}</p>
//                     <p className="text-xs text-gray-500">{medicine.dosage} - {medicine.duration}</p>
//                   </div>
//                   <button
//                     onClick={() => removeMedicine(index)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     <XCircle className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}

//               {/* Add Medicine */}
//               <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
//                 <div className="grid grid-cols-3 gap-2 mb-2">
//                   <input
//                     type="text"
//                     className="col-span-3 px-2 py-1 border border-gray-300 rounded"
//                     placeholder="Medicine name"
//                     id="medicine-name"
//                   />
//                   <input
//                     type="text"
//                     className="px-2 py-1 border border-gray-300 rounded"
//                     placeholder="Dosage"
//                     id="medicine-dosage"
//                   />
//                   <input
//                     type="text"
//                     className="px-2 py-1 border border-gray-300 rounded"
//                     placeholder="Duration"
//                     id="medicine-duration"
//                   />
//                   <button
//                     onClick={() => {
//                       const name = document.getElementById('medicine-name').value;
//                       const dosage = document.getElementById('medicine-dosage').value;
//                       const duration = document.getElementById('medicine-duration').value;
//                       addMedicineToList(name, dosage, duration);
//                       document.getElementById('medicine-name').value = '';
//                       document.getElementById('medicine-dosage').value = '';
//                       document.getElementById('medicine-duration').value = '';
//                     }}
//                     className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Save Button */}
//             <button
//               onClick={submitPrescription}
//               disabled={!prescription.notes}
//               className={`w-full py-2 rounded-lg font-medium ${prescription.notes ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//             >
//               Save Prescription & Complete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

//   const PatientsManager = () => {
//     const [patients, setPatients] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filterType, setFilterType] = useState('all'); // all, new, returning
//     const [selectedPatient, setSelectedPatient] = useState(null);
//     const [followUpDate, setFollowUpDate] = useState('');
//     const [followUpNotes, setFollowUpNotes] = useState('');
//     const [showFollowUpModal, setShowFollowUpModal] = useState(false);

//     useEffect(() => {
//       // Fetch patients data
//       const fetchPatients = async () => {
//         try {
//           setLoading(true);
//           const db = getDatabase();
//           const patientsRef = ref(db, 'appointments');

//           const snapshot = await get(patientsRef);
//           const patientsList = [];
//           const uniquePatients = new Map();

//           if (snapshot.exists()) {
//             snapshot.forEach((childSnapshot) => {
//               const appointment = childSnapshot.val();

//               // Only include appointments for this vet
//               if (
//                 appointment.vetId === userData.id ||
//                 (userData.email && appointment.vetEmail === userData.email) ||
//                 (userData.name && appointment.vetName === userData.name)
//               ) {
//                 const userId = appointment.userId;
//                 const userName = appointment.userName;
//                 const userEmail = appointment.userEmail;
//                 const userPhone = appointment.userPhone || '';
//                 const date = appointment.date;
//                 const time = appointment.time;
//                 const status = appointment.status;
//                 const hasPrescription = appointment.hasPrescription || false;
//                 const isEmergency = appointment.isEmergency || false;

//                 // Create unique key for this patient
//                 const patientKey = `${userId}-${userName}`;

//                 if (!uniquePatients.has(patientKey)) {
//                   // First time seeing this patient
//                   uniquePatients.set(patientKey, {
//                     id: userId,
//                     name: userName,
//                     email: userEmail,
//                     phone: userPhone,
//                     isNew: true,
//                     hasEmergencyVisit: isEmergency,
//                     lastVisit: new Date(`${date} ${time}`),
//                     appointments: [
//                       {
//                         id: childSnapshot.key,
//                         date,
//                         time,
//                         status,
//                         hasPrescription,
//                         isEmergency
//                       }
//                     ],
//                     nextFollowUp: appointment.followUpDate ? new Date(appointment.followUpDate) : null,
//                     followUpNotes: appointment.followUpNotes || '',
//                     petDetails: appointment.petDetails || {
//                       name: 'Not specified',
//                       type: 'Not specified',
//                       breed: 'Not specified',
//                       age: 'Not specified'
//                     }
//                   });
//                 } else {
//                   // Existing patient - add this appointment
//                   const patient = uniquePatients.get(patientKey);
//                   patient.appointments.push({
//                     id: childSnapshot.key,
//                     date,
//                     time,
//                     status,
//                     hasPrescription,
//                     isEmergency
//                   });

//                   // Check if patient has had an emergency visit
//                   if (isEmergency) {
//                     patient.hasEmergencyVisit = true;
//                   }

//                   // Update last visit if this appointment is more recent
//                   const appointmentDate = new Date(`${date} ${time}`);
//                   if (appointmentDate > patient.lastVisit) {
//                     patient.lastVisit = appointmentDate;

//                     // Update next follow-up if available
//                     if (appointment.followUpDate) {
//                       patient.nextFollowUp = new Date(appointment.followUpDate);
//                       patient.followUpNotes = appointment.followUpNotes || '';
//                     }
//                   }

//                   // Not a new patient anymore if they have multiple appointments
//                   if (patient.appointments.length > 1) {
//                     patient.isNew = false;
//                   }

//                   // Update pet details if available
//                   if (appointment.petDetails) {
//                     patient.petDetails = appointment.petDetails;
//                   }
//                 }
//               }
//             });

//             // Convert map to array and sort by last visit (most recent first)
//             uniquePatients.forEach(patient => {
//               // Sort patient's appointments by date (newest first)
//               patient.appointments.sort((a, b) => {
//                 return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
//               });

//               patientsList.push(patient);
//             });

//             patientsList.sort((a, b) => b.lastVisit - a.lastVisit);
//             setPatients(patientsList);
//           }
//           setLoading(false);
//         } catch (error) {
//           console.error("Error fetching patients:", error);
//           showNotification('error', 'Failed to load patients data');
//           setLoading(false);
//         }
//       };

//       fetchPatients();
//     }, [userData.id, userData.email, userData.name]);

//     const handleScheduleFollowUp = async () => {
//       if (!selectedPatient || !followUpDate) {
//         showNotification('error', 'Please select a follow-up date');
//         return;
//       }

//       try {
//         const db = getDatabase();

//         // Update the latest appointment with follow-up information
//         const latestAppointmentId = selectedPatient.appointments[0].id;
//         const appointmentRef = ref(db, `appointments/${latestAppointmentId}`);

//         await update(appointmentRef, {
//           followUpDate,
//           followUpNotes,
//           updatedAt: new Date().toISOString()
//         });

//         // Update local state
//         setPatients(patients.map(patient => {
//           if (patient.id === selectedPatient.id) {
//             return {
//               ...patient,
//               nextFollowUp: new Date(followUpDate),
//               followUpNotes
//             };
//           }
//           return patient;
//         }));

//         showNotification('success', 'Follow-up scheduled successfully');
//         setShowFollowUpModal(false);
//         setSelectedPatient(null);
//         setFollowUpDate('');
//         setFollowUpNotes('');
//       } catch (error) {
//         console.error("Error scheduling follow-up:", error);
//         showNotification('error', 'Failed to schedule follow-up');
//       }
//     };

//     const filteredPatients = patients.filter(patient => {
//       if (filterType === 'all') return true;
//       if (filterType === 'new') return patient.isNew;
//       if (filterType === 'returning') return !patient.isNew;
//       if (filterType === 'emergency') return patient.hasEmergencyVisit;
//       return true;
//     });

//     const FollowUpModal = () => (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg w-full max-w-md p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Follow-Up</h3>
//           <p className="mb-4 text-gray-700">Patient: {selectedPatient?.name}</p>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Follow-Up Date</label>
//             <input
//               type="date"
//               value={followUpDate}
//               onChange={(e) => setFollowUpDate(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               min={new Date().toISOString().split('T')[0]}
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//             <textarea
//               value={followUpNotes}
//               onChange={(e) => setFollowUpNotes(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg"
//               rows={4}
//               placeholder="Add notes about the follow-up..."
//             ></textarea>
//           </div>

//           <div className="flex justify-end space-x-3">
//             <button
//               onClick={() => {
//                 setShowFollowUpModal(false);
//                 setSelectedPatient(null);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleScheduleFollowUp}
//               disabled={!followUpDate}
//               className={`px-4 py-2 rounded-lg ${followUpDate ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//             >
//               Schedule
//             </button>
//           </div>
//         </div>
//       </div>
//     );

//     const formatDate = (date) => {
//       return new Date(date).toLocaleDateString();
//     };

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h2 className="text-2xl font-semibold text-gray-800">Patient Records</h2>

//           <div className="flex space-x-2">
//             <button
//               onClick={() => setFilterType('all')}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === 'all'
//                 ? 'bg-blue-100 text-blue-700'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//             >
//               All Patients
//             </button>
//             <button
//               onClick={() => setFilterType('new')}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === 'new'
//                 ? 'bg-green-100 text-green-700'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//             >
//               New Patients
//             </button>
//             <button
//               onClick={() => setFilterType('returning')}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === 'returning'
//                 ? 'bg-purple-100 text-purple-700'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//             >
//               Returning Patients
//             </button>
//             <button
//               onClick={() => setFilterType('emergency')}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === 'emergency'
//                 ? 'bg-red-100 text-red-700'
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//             >
//               Emergency Patients
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : filteredPatients.length > 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Patient / Pet
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Last Visit
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Next Follow-Up
//                     </th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th> */}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredPatients.map((patient) => (
//                     <tr key={patient.id} className={
//                       patient.hasEmergencyVisit ? 'bg-red-50' :
//                         patient.isNew ? 'bg-green-50' : ''
//                     }>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900 flex items-center">
//                             {patient.name}
//                             {patient.isNew && (
//                               <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
//                                 New
//                               </span>
//                             )}
//                             {patient.hasEmergencyVisit && (
//                               <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
//                                 <AlertCircle className="w-3 h-3 inline mr-1" />
//                                 Emergency
//                               </span>
//                             )}
//                           </div>
//                           <div className="text-sm text-gray-500">{patient.email}</div>
//                           {patient.phone && <div className="text-sm text-gray-500">{patient.phone}</div>}
//                           <div className="mt-1 text-xs text-gray-600">
//                             Pet: {patient.petDetails.name} ({patient.petDetails.type} - {patient.petDetails.breed})
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">{formatDate(patient.lastVisit)}</div>
//                         <div className="text-sm text-gray-500">
//                           {patient.appointments[0].time}
//                         </div>
//                         {patient.appointments[0].isEmergency && (
//                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
//                             Emergency Visit
//                           </span>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col">
//                           <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.appointments[0].status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                             patient.appointments[0].status === 'confirmed' ? ' text-green-800' :
//                               patient.appointments[0].status === 'completed' ? 'bg-blue-100 text-blue-800' :
//                                 'bg-red-100 text-red-800'
//                             }`}>
//                             {patient.appointments[0].status}
//                           </span>

//                           {patient.appointments[0].hasPrescription && (
//                             <span className="mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
//                               Has Prescription
//                             </span>
//                           )}
//                         </div>
//                       </td>
//                       {/* <td className="px-6 py-4 whitespace-nowrap">
//                         {patient.nextFollowUp ? (
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {formatDate(patient.nextFollowUp)}
//                             </div>
//                             {patient.followUpNotes && (
//                               <div className="text-xs text-gray-500 max-w-xs truncate">
//                                 {patient.followUpNotes}
//                               </div>
//                             )}
//                           </div>
//                         ) : (
//                           <span className="text-sm text-gray-500">Not scheduled</span>
//                         )}
//                       </td> */}
//                       {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => {
//                             setSelectedPatient(patient);
//                             setShowFollowUpModal(true);
//                           }}
//                           className="text-blue-600 hover:text-blue-900 mr-3"
//                           title="Schedule Follow-Up"
//                         >
//                           <Calendar className="w-5 h-5" />
//                         </button>
//                         <button
//                           onClick={() => {
//                             // View patient details or medical history
//                           }}
//                           className="text-purple-600 hover:text-purple-900"
//                           title="View Medical History"
//                         >
//                           <FileText className="w-5 h-5" />
//                         </button>
//                       </td> */}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
//             <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
//             <p className="text-gray-600">
//               {filterType === 'all'
//                 ? "You don't have any patients yet."
//                 : filterType === 'new'
//                   ? "You don't have any new patients."
//                   : filterType === 'emergency'
//                     ? "You don't have any emergency patients."
//                     : "You don't have any returning patients."}
//             </p>
//           </div>
//         )}

//         {showFollowUpModal && selectedPatient && <FollowUpModal />}
//       </div>
//     );
//   };

//   const renderActivePage = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardOverview />;
//       case 'profile':
//         return <ProfilePage />;
//       case 'appointments':
//         return <AppointmentsManager />;
//       case 'timeslots':
//         return <TimeSlotsManager />;
//       case 'patients':
//         return <PatientsManager />;
//       case 'consultations':
//         return <ConsultationsManager />;
//       default:
//         return <DashboardOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Notification Toast */}
//       <NotificationToast />

//       {/* Emergency Alert Modal */}
//       <EmergencyAlertModal />

//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-lg">
//         <div className="p-6 border-b">
//           <h1 className="text-xl font-bold text-gray-800">Veterinary Portal</h1>
//           <p className="text-sm text-gray-600">{userData.name || 'Doctor'}</p>
//         </div>

//         <nav className="mt-6 gap-2 flex flex-col">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActiveTab(item.id)}
//                 className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
//                   }`}
//               >
//                 <Icon className="mr-3 h-5 w-5" />
//                 {item.label}

//                 {/* Add notification badge for consultations tab when there are emergency alerts */}
//                 {item.id === 'consultations' && emergencyAlerts.length > 0 && (
//                   <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                     {emergencyAlerts.length}
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
//               {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('-', ' ')}
//             </h2>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <button
//                   className="p-2 text-gray-600 hover:text-gray-800 relative"
//                   onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
//                 >
//                   <Bell className="h-6 w-6" />
//                   {unreadNotifications > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                       {unreadNotifications}
//                     </span>
//                   )}
//                 </button>
//                 <NotificationsPanel />
//               </div>

//               <button
//                 onClick={() => setSoundEnabled(!soundEnabled)}
//                 className="p-2 text-gray-600 hover:text-gray-800"
//                 title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
//               >
//                 {soundEnabled ? (
//                   <Volume2 className="h-6 w-6" />
//                 ) : (
//                   <VolumeX className="h-6 w-6" />
//                 )}
//               </button>

//               <div className="flex items-center space-x-2">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <span className="text-white font-semibold">
//                     {userData.name ? userData.name.charAt(0).toUpperCase() : 'D'}
//                   </span>
//                 </div>
//                 <span className="text-gray-700">{userData.name || 'Doctor'}</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {renderActivePage()}
//         </main>
//       </div>

//       {/* Video Consultation Modal */}
//       {videoConsultActive && activeAppointment && <VideoConsultation />}
//     </div>
//   );
// };

// export default VeterinaryDashboard;






import React, { useState, useEffect, useCallback , useRef} from 'react';
import {
  Calendar, Users, Activity, TrendingUp, Clock, User,
  Phone, Mail, MapPin, Settings, LogOut, Bell,
  FileText, Heart, Stethoscope, Award, Video,
  CheckCircle, XCircle, Clock4, PenTool, AlertCircle,
  VolumeX, Volume2
} from 'lucide-react';
import { getDatabase, ref, onValue, update, set, push, get, onChildAdded } from 'firebase/database';
import SimpleVideoCall from '../user/SimpleVideoCall';

const VeterinaryDashboard = () => {
  const [userData, setUserData] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emergencyAvailable, setEmergencyAvailable] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [notesText, setNotesText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [videoConsultActive, setVideoConsultActive] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const textareaRef = useRef(null);
  const cursorPositionRef = useRef(null);
  const [prescription, setPrescription] = useState({
    notes: '',
    medicines: []
  });
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    consultationsThisMonth: 0,
    emergencyConsultations: 0,
    rating: 0,
    feedbacks: []
  });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [currentEmergencyAlert, setCurrentEmergencyAlert] = useState(null);
  const [notificationSound] = useState(new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3'));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (soundEnabled) {
      notificationSound.play().catch(error => {
        console.error("Error playing sound:", error);
      });
    }
  }, [notificationSound, soundEnabled]);


  const startPrescriptionCreation = (appointment) => {
    setActiveAppointment({
      ...appointment,
      consultationEnded: true // Mark as ended since we're just creating a prescription
    });
    setPrescription({ notes: '', medicines: [] });
    setPrescriptionNotes(''); // Reset prescription notes
    setVideoConsultActive(true); // Open the VideoConsultation component in prescription mode
  };

  // Function to fetch feedback for the current vet
  const fetchFeedback = useCallback(async () => {
    try {
      setFeedbackLoading(true);
      const db = getDatabase();
      const feedbackRef = ref(db, 'feedback');

      onValue(feedbackRef, (snapshot) => {
        const vetFeedbacks = [];

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const feedback = childSnapshot.val();

            // Only include feedback for this vet
            if (
              feedback.vetId === userData.id ||
              (userData.email && feedback.vetEmail === userData.email) ||
              (userData.name && feedback.vetName === userData.name)
            ) {
              vetFeedbacks.push({
                id: childSnapshot.key,
                ...feedback
              });
            }
          });
        }

        // Sort by creation date (newest first)
        vetFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Calculate average rating
        const totalRating = vetFeedbacks.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = vetFeedbacks.length > 0 ? totalRating / vetFeedbacks.length : 0;

        setFeedbacks(vetFeedbacks);
        setStats(prevStats => ({
          ...prevStats,
          rating: averageRating.toFixed(1),
          feedbacks: vetFeedbacks
        }));
        setFeedbackLoading(false);
      });
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedbackLoading(false);
    }
  }, [userData.id, userData.email, userData.name]);


  // Handle new emergency connection alert
  const handleEmergencyAlert = useCallback((emergencyData) => {
    setEmergencyAlerts(prev => [emergencyData, ...prev]);
    setUnreadNotifications(prev => prev + 1);
    setCurrentEmergencyAlert(emergencyData);
    setShowEmergencyAlert(true);
    playNotificationSound();

    // Auto-hide alert after 20 seconds if not acted upon
    setTimeout(() => {
      setShowEmergencyAlert(false);
    }, 20000);
  }, [playNotificationSound]);

  // Listen for new emergency requests
  useEffect(() => {
    const db = getDatabase();
    const emergencyRequestsRef = ref(db, 'emergencyRequests');

    // This will fire when a new emergency request is added to the database
    const unsubscribe = onChildAdded(emergencyRequestsRef, (snapshot) => {
      const emergencyData = { id: snapshot.key, ...snapshot.val() };

      if (
        emergencyData.status === 'pending' &&
        emergencyAvailable &&
        (!emergencyData.vetId || emergencyData.vetId === userData.id ||
          (userData.email && emergencyData.vetEmail === userData.email) ||
          (userData.name && emergencyData.vetName === userData.name))
      ) {
        handleEmergencyAlert(emergencyData);
      }
    });
    fetchFeedback();
    return () => unsubscribe();
  }, [emergencyAvailable, userData.id, userData.email, userData.name, handleEmergencyAlert, fetchFeedback]);


  useEffect(() => {
    // Restore cursor position after render if we have a saved position
    if (textareaRef.current && cursorPositionRef.current !== null) {
      textareaRef.current.setSelectionRange(
        cursorPositionRef.current,
        cursorPositionRef.current
      );
      // Reset the saved position
      cursorPositionRef.current = null;
    }
  }, [prescriptionNotes]);


  useEffect(() => {
    // Get user data from session storage
    const storedUserData = sessionStorage.getItem('userData');
    const storedEmail = sessionStorage.getItem('userEmail');
    const storedToken = sessionStorage.getItem('vetToken');

    console.log("Initial session data:", {
      storedUserData: storedUserData ? 'present' : 'missing',
      storedEmail,
      storedToken: storedToken ? 'present' : 'missing'
    });

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log("Parsed user data:", parsedData);
        setUserData(parsedData);
      } catch (error) {
        console.error("Error parsing userData from session storage:", error);
      }
    } else if (storedEmail) {
      // If we have email but not userData, set email in userData
      setUserData(prev => ({ ...prev, email: storedEmail }));
      console.log("Using email from session storage:", storedEmail);
    }

    // Fetch veterinarian data and appointments from Firebase
    const fetchData = async () => {
      try {
        setLoading(true);
        const db = getDatabase();
        console.log("Database reference obtained");

        // WORKAROUND: If we don't have any user data, create a mock entry for testing
        // Remove this in production - this is just to bypass the ID error
        if (!storedUserData && !storedEmail && !userData.id && !userData.email) {
          console.log("No user identification found - using default fallback for testing");
          // This is just a temporary workaround to prevent the error
          setUserData({
            id: "default-vet-id",
            name: "Doctor",
            email: "vet@example.com",
            specialization: "General Practice"
          });

          // Create a mock entry in the database if it doesn't exist yet
          try {
            const vetRef = ref(db, `veterinary/default-vet-id`);
            const snapshot = await get(vetRef);
            if (!snapshot.exists()) {
              await set(vetRef, {
                name: "Doctor",
                email: "vet@example.com",
                specialization: "General Practice",
                experience: 5,
                emergencyAvailable: false,
                timeSlots: generateDefaultTimeSlots(),
                createdAt: new Date().toISOString()
              });
              console.log("Created default vet entry for testing");
            }
          } catch (err) {
            console.error("Error creating default vet entry:", err);
          }
        }

        // First, try to find the vet by ID, email, or name
        let vetId = null;
        let vetData = null;

        // Try all possible ways to identify the vet
        const identifyVet = async () => {
          // If we have an ID, use it directly
          if (userData.id) {
            vetId = userData.id;
            console.log("Using ID from userData:", vetId);
            return;
          }

          // Otherwise, search for the vet by email
          if (userData.email || storedEmail) {
            const emailToUse = userData.email || storedEmail;
            console.log("Searching for vet by email:", emailToUse);
            const vetsRef = ref(db, 'veterinary');
            const snapshot = await get(vetsRef);

            if (snapshot.exists()) {
              const vets = snapshot.val();
              // Find the vet with matching email
              for (const id in vets) {
                if (vets[id].email === emailToUse) {
                  vetId = id;
                  vetData = vets[id];
                  console.log("Found vet by email, ID:", vetId);
                  return;
                }
              }
            }
          }

          // If still no ID, try to find by name
          if (userData.name) {
            console.log("Searching for vet by name:", userData.name);
            const vetsRef = ref(db, 'veterinary');
            const snapshot = await get(vetsRef);

            if (snapshot.exists()) {
              const vets = snapshot.val();
              // Find the vet with matching name
              for (const id in vets) {
                if (vets[id].name === userData.name) {
                  vetId = id;
                  vetData = vets[id];
                  console.log("Found vet by name, ID:", vetId);
                  return;
                }
              }
            }
          }

          // If still no ID found, use default (for development/testing only)
          if (!vetId) {
            vetId = "default-vet-id";
            console.log("Using default vet ID as fallback");
          }
        };

        await identifyVet();

        // If we found a vet ID, fetch their data
        if (vetId) {
          console.log("Fetching data for vet ID:", vetId);
          const vetRef = ref(db, `veterinary/${vetId}`);

          // Update userData with the ID we found
          setUserData(prevData => {
            const updatedData = { ...prevData, id: vetId };
            // Store the updated data in session storage
            sessionStorage.setItem('userData', JSON.stringify(updatedData));
            console.log("Updated userData with ID:", updatedData);
            return updatedData;
          });

          onValue(vetRef, (snapshot) => {
            if (snapshot.exists()) {
              const fetchedVetData = snapshot.val();
              console.log("Fetched vet data:", fetchedVetData);

              // Update userData with the latest data
              setUserData(prevData => {
                const newData = { ...prevData, ...fetchedVetData, id: vetId };
                // Update session storage with the complete data
                sessionStorage.setItem('userData', JSON.stringify(newData));
                return newData;
              });

              // Set emergency status from DB
              setEmergencyAvailable(fetchedVetData.emergencyAvailable || false);

              // Set time slots from DB or use defaults
              if (fetchedVetData.timeSlots) {
                console.log("Setting time slots from DB:", fetchedVetData.timeSlots);
                setTimeSlots(fetchedVetData.timeSlots);
              } else {
                const defaultSlots = generateDefaultTimeSlots();
                console.log("Setting default time slots:", defaultSlots);
                setTimeSlots(defaultSlots);

                // Save default time slots to the database
                update(vetRef, { timeSlots: defaultSlots })
                  .then(() => console.log("Default time slots saved to DB"))
                  .catch(err => console.error("Error saving default time slots:", err));
              }
            } else {
              console.log("No vet data found, using defaults");
              const defaultSlots = generateDefaultTimeSlots();
              setTimeSlots(defaultSlots);

              // Create a default vet profile if it doesn't exist
              set(vetRef, {
                id: vetId,
                name: userData.name || "Doctor",
                email: userData.email || storedEmail || "vet@example.com",
                specialization: "General Practice",
                experience: 0,
                emergencyAvailable: false,
                timeSlots: defaultSlots,
                createdAt: new Date().toISOString()
              })
                .then(() => console.log("Created default vet profile"))
                .catch(err => console.error("Error creating default profile:", err));
            }
          });

          // Fetch all appointments for this veterinarian
          const appointmentsRef = ref(db, 'appointments');
          onValue(appointmentsRef, (snapshot) => {
            const appointmentsList = [];
            const uniquePatients = new Set();
            let todayCount = 0;
            let monthlyCount = 0;
            let emergencyCount = 0;

            const today = new Date();
            const thisMonth = today.getMonth();
            const thisYear = today.getFullYear();

            if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                const appointment = childSnapshot.val();

                // Include appointments for this vet by ID, email, or name
                if (
                  appointment.vetId === vetId ||
                  (userData.email && appointment.vetEmail === userData.email) ||
                  (storedEmail && appointment.vetEmail === storedEmail) ||
                  (userData.name && appointment.vetName === userData.name)
                ) {
                  // Add ID to appointment object
                  const appointmentWithId = {
                    id: childSnapshot.key,
                    ...appointment
                  };

                  appointmentsList.push(appointmentWithId);

                  // Count unique patients
                  uniquePatients.add(appointment.userId);

                  // Count today's appointments
                  const appointmentDate = new Date(appointment.date);
                  if (
                    appointmentDate.getDate() === today.getDate() &&
                    appointmentDate.getMonth() === today.getMonth() &&
                    appointmentDate.getFullYear() === today.getFullYear()
                  ) {
                    todayCount++;
                  }

                  // Count this month's consultations
                  if (
                    appointmentDate.getMonth() === thisMonth &&
                    appointmentDate.getFullYear() === thisYear &&
                    appointment.status !== 'pending' &&
                    appointment.status !== 'cancelled'
                  ) {
                    monthlyCount++;
                  }

                  // Count emergency consultations
                  if (appointment.isEmergency) {
                    emergencyCount++;
                  }
                }
              });
            }

            // Sort by date (newest first)
            appointmentsList.sort((a, b) => {
              const dateA = new Date(`${a.date} ${a.time}`);
              const dateB = new Date(`${b.date} ${b.time}`);
              return dateA - dateB;
            });

            console.log(`Found ${appointmentsList.length} appointments for this vet`);
            setAppointments(appointmentsList);

            // Update stats
            setStats(prevStats => ({
              ...prevStats,
              totalAppointments: appointmentsList.length,
              todayAppointments: todayCount,
              totalPatients: uniquePatients.size,
              consultationsThisMonth: monthlyCount,
              emergencyConsultations: emergencyCount
            }));

            setLoading(false);
          });

          // Fetch emergency requests and check for pending ones
          const emergencyRequestsRef = ref(db, 'emergencyRequests');
          onValue(emergencyRequestsRef, (snapshot) => {
            const emergencyList = [];

            if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                const emergency = childSnapshot.val();

                // Include emergency requests for this vet or unassigned ones if vet is available
                if (
                  emergency.status === 'pending' &&
                  (emergency.vetId === vetId ||
                    (userData.email && emergency.vetEmail === userData.email) ||
                    (userData.name && emergency.vetName === userData.name) ||
                    !emergency.vetId) // Unassigned requests
                ) {
                  emergencyList.push({
                    id: childSnapshot.key,
                    ...emergency
                  });
                }
              });
            }

            // Update emergency alerts list
            setEmergencyAlerts(emergencyList);
            setUnreadNotifications(emergencyList.length);
          });
        } else {
          console.error("Could not find vet ID by any method");
          showNotification('error', 'Could not identify your account. Please log in again.');
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        showNotification('error', 'Failed to load data. Please refresh the page.');
      }
    };

    fetchData();
  }, []);

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

  const toggleEmergencyAvailability = async () => {
    try {
      const newStatus = !emergencyAvailable;
      setEmergencyAvailable(newStatus);

      // Update in Firebase
      if (userData.id) {
        const db = getDatabase();
        const vetRef = ref(db, `veterinary/${userData.id}`);
        await update(vetRef, {
          emergencyAvailable: newStatus
        });
        showNotification('success', `Emergency availability ${newStatus ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      console.error("Error updating emergency status:", error);
      // Revert UI state on error
      setEmergencyAvailable(!emergencyAvailable);
      showNotification('error', 'Failed to update emergency status.');
    }
  };



  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      const db = getDatabase();
      const appointmentRef = ref(db, `appointments/${appointmentId}`);

      // Get current appointment data
      const snapshot = await get(appointmentRef);
      if (!snapshot.exists()) {
        throw new Error("Appointment not found");
      }

      const appointmentData = snapshot.val();

      // Update appointment status
      await update(appointmentRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      // UI will update automatically through the onValue listener
      showNotification('success', `Appointment ${newStatus === 'confirmed' ? 'accepted' : newStatus === 'cancelled' ? 'rejected' : 'updated'} successfully`);

      // Create updated appointment object with the new status
      const updatedAppointment = {
        ...appointmentData,
        id: appointmentId,
        status: newStatus
      };

      // Share via WhatsApp if phone number exists
      if (updatedAppointment.userPhone) {
        const whatsappUrl = createWhatsAppLink(updatedAppointment);
        if (whatsappUrl) {
          // Ask if user wants to share via WhatsApp
          if (window.confirm('Would you like to send appointment details via WhatsApp?')) {
            window.open(whatsappUrl, '_blank');
          }
        }
      }

    } catch (error) {
      console.error("Error updating appointment status:", error);
      showNotification('error', 'Failed to update appointment status.');
    }
  };


  const startVideoConsultation = (appointment) => {
    setActiveAppointment(appointment);
    setVideoConsultActive(true);

    // If this is from an emergency request, update the status in Firebase
    if (appointment.isEmergency) {
      try {
        const db = getDatabase();

        // Check if this came from emergencyRequests
        if (appointment.fromEmergencyRequest && appointment.emergencyRequestId) {
          const emergencyRef = ref(db, `emergencyRequests/${appointment.emergencyRequestId}`);
          update(emergencyRef, {
            status: 'active',
            startedAt: new Date().toISOString()
          });
        }

        // Update appointment status if needed
        if (appointment.id) {
          const appointmentRef = ref(db, `appointments/${appointment.id}`);
          update(appointmentRef, {
            status: 'confirmed',
            consultationStarted: true,
            consultationStartTime: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error updating emergency consultation status:", error);
      }
    }
  };

  // This is your existing endVideoConsultation function
  // const endVideoConsultation = () => {
  //   setVideoConsultActive(false);

  //   // Record consultation completion if it was an emergency
  //   if (activeAppointment && activeAppointment.isEmergency) {
  //     try {
  //       const db = getDatabase();

  //       // Update emergency request if it exists
  //       if (activeAppointment.fromEmergencyRequest && activeAppointment.emergencyRequestId) {
  //         const emergencyRef = ref(db, `emergencyRequests/${activeAppointment.emergencyRequestId}`);
  //         update(emergencyRef, {
  //           status: 'completed',
  //           endedAt: new Date().toISOString()
  //         });
  //       }

  //       // Update appointment
  //       if (activeAppointment.id) {
  //         const appointmentRef = ref(db, `appointments/${activeAppointment.id}`);
  //         update(appointmentRef, {
  //           status: 'completed',
  //           consultationEnded: true,
  //           consultationEndTime: new Date().toISOString()
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error completing emergency consultation:", error);
  //     }
  //   }

  //   setActiveAppointment(null);
  // };

  const endVideoConsultation = () => {
    setVideoConsultActive(false);

    try {
      const db = getDatabase();

      // Update appointment status regardless of whether it's an emergency or not
      if (activeAppointment && activeAppointment.id) {
        // For emergency appointments
        if (activeAppointment.isEmergency) {
          // Update emergency request if it exists
          if (activeAppointment.fromEmergencyRequest && activeAppointment.emergencyRequestId) {
            const emergencyRef = ref(db, `emergencyRequests/${activeAppointment.emergencyRequestId}`);
            update(emergencyRef, {
              status: 'completed',
              endedAt: new Date().toISOString()
            });
          }
        }

        // Update the appointment status for all appointments
        const appointmentRef = ref(db, `appointments/${activeAppointment.id}`);
        update(appointmentRef, {
          status: 'completed',
          consultationEnded: true,
          consultationEndTime: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error completing consultation:", error);
    }

    // Make sure to clear the active appointment to fully reset the state
    setActiveAppointment(null);
  };

  const handleEmergencyResponse = async (accept, emergencyData) => {
    try {
      const db = getDatabase();
      const emergencyRef = ref(db, `emergencyRequests/${emergencyData.id}`);

      if (accept) {
        // Accept the emergency consultation
        await update(emergencyRef, {
          status: 'accepted',
          vetId: userData.id,
          vetName: userData.name,
          vetEmail: userData.email,
          acceptedAt: new Date().toISOString()
        });

        // Start the video consultation
        const emergencyAppointment = {
          ...emergencyData,
          isEmergency: true,
          fromEmergencyRequest: true,
          emergencyRequestId: emergencyData.id,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'confirmed'
        };

        startVideoConsultation(emergencyAppointment);
        showNotification('success', 'Emergency consultation accepted');
      } else {
        // Decline the emergency consultation
        await update(emergencyRef, {
          status: 'declined',
          vetId: userData.id,
          vetName: userData.name,
          vetEmail: userData.email,
          declinedAt: new Date().toISOString(),
          declineReason: 'Vet is unavailable at this time'
        });

        showNotification('info', 'Emergency consultation declined');
      }

      // Hide the emergency alert
      setShowEmergencyAlert(false);
      setCurrentEmergencyAlert(null);

      // Reduce unread notifications count
      setUnreadNotifications(prev => Math.max(0, prev - 1));

      // Refresh emergency alerts list
      setEmergencyAlerts(prev => prev.filter(alert => alert.id !== emergencyData.id));
    } catch (error) {
      console.error("Error responding to emergency consultation:", error);
      showNotification('error', 'Failed to respond to emergency consultation');
    }
  };

  // const submitPrescription = async () => {
  //   const notesText = document.getElementById('prescription-notes').value;

  //   if (!activeAppointment || !notesText) {
  //     showNotification('error', 'Please add prescription details first');
  //     return;
  //   }

  //   try {
  //     const db = getDatabase();

  //     // Create prescription in DB
  //     const prescriptionsRef = ref(db, 'prescriptions');
  //     const newPrescriptionRef = push(prescriptionsRef);

  //     await set(newPrescriptionRef, {
  //       appointmentId: activeAppointment.id,
  //       userId: activeAppointment.userId,
  //       vetId: userData.id,
  //       vetName: userData.name,
  //       date: new Date().toISOString(),
  //       notes: notesText,
  //       medicines: prescription.medicines,
  //       status: 'active'
  //     });

  //     // Rest of your code...

  //     // Reset state
  //     setPrescription({ notes: '', medicines: [] });
  //     document.getElementById('prescription-notes').value = '';
  //     showNotification('success', 'Prescription saved successfully');
  //     endVideoConsultation();
  //   } catch (error) {
  //     console.error("Error saving prescription:", error);
  //     showNotification('error', 'Failed to save prescription. Please try again.');
  //   }
  // };

 const submitPrescription = async () => {
  if (!activeAppointment || prescription.medicines.length === 0) {
    showNotification('error', 'Please add at least one medicine to the prescription');
    return;
  }

  try {
    const db = getDatabase();

    // Create prescription in DB
    const prescriptionsRef = ref(db, 'prescriptions');
    const newPrescriptionRef = push(prescriptionsRef);

    await set(newPrescriptionRef, {
      appointmentId: activeAppointment.id,
      userId: activeAppointment.userId,
      vetId: userData.id,
      vetName: userData.name,
      date: new Date().toISOString(),
      notes: "", // Empty notes field
      medicines: prescription.medicines,
      status: 'active'
    });

    // Update appointment to indicate it has a prescription
    const appointmentRef = ref(db, `appointments/${activeAppointment.id}`);
    await update(appointmentRef, {
      hasPrescription: true,
      prescriptionId: newPrescriptionRef.key,
      updatedAt: new Date().toISOString()
    });

    // Reset state
    setPrescription({ notes: '', medicines: [] });
    showNotification('success', 'Prescription saved successfully');
    endVideoConsultation();
  } catch (error) {
    console.error("Error saving prescription:", error);
    showNotification('error', 'Failed to save prescription. Please try again.');
  }
};

  const addMedicineToList = (medicineName, dosage, duration) => {
    if (!medicineName) {
      showNotification('error', 'Medicine name is required');
      return;
    }

    setPrescription(prev => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: medicineName, dosage, duration }
      ]
    }));
  };

  const removeMedicine = (index) => {
    setPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = async (day, hour, available) => {
    // Check for conflicts with existing appointments
    if (!available) {
      const formattedDay = formatDayForAppointment(day);
      const formattedHour = formatHourForAppointment(hour);

      const conflictingAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const aptDay = aptDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        return (
          aptDay === day &&
          apt.time === formattedHour &&
          apt.status !== 'cancelled' &&
          apt.status !== 'completed'
        );
      });

      if (conflictingAppointments.length > 0) {
        showNotification('error', 'Cannot mark as unavailable - you have existing appointments in this slot');
        return;
      }
    }

    // Create a deep copy of the timeSlots
    const updatedSlots = JSON.parse(JSON.stringify(timeSlots));

    // Update the specific slot
    if (!updatedSlots[day]) {
      updatedSlots[day] = {};
    }
    updatedSlots[day][hour] = available;

    setTimeSlots(updatedSlots);

    // Save to Firebase
    try {
      if (userData.id) {
        const db = getDatabase();
        const vetRef = ref(db, `veterinary/${userData.id}`);
        await update(vetRef, {
          timeSlots: updatedSlots
        });
        showNotification('success', 'Time slot updated successfully');
      }
    } catch (error) {
      console.error("Error updating time slots:", error);
      // Revert UI state on error
      setTimeSlots(timeSlots);
      showNotification('error', 'Failed to update time slot');
    }
  };

  const formatDayForAppointment = (day) => {
    // Convert day string to date format
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = days.indexOf(day.toLowerCase());
    const today = new Date();
    const currentDayIndex = today.getDay();
    const diff = dayIndex - currentDayIndex;

    const targetDate = new Date();
    targetDate.setDate(today.getDate() + diff + (diff < 0 ? 7 : 0));

    return targetDate.toISOString().split('T')[0];
  };

  const formatHourForAppointment = (hour) => {
    // Convert hour number to formatted time string (e.g., "9:00 AM")
    const isPM = hour >= 12;
    const hour12 = hour === 12 ? 12 : hour % 12;
    return `${hour12}:00 ${isPM ? 'PM' : 'AM'}`;
  };

  const generateDefaultTimeSlots = () => {
    const slots = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const hours = [9, 10, 11, 12, 14, 15, 16, 17];

    days.forEach(day => {
      slots[day] = {};
      hours.forEach(hour => {
        // By default, make weekday slots available (Monday to Friday)
        const isWeekend = day === 'saturday' || day === 'sunday';
        slots[day][hour] = !isWeekend;
      });
    });

    return slots;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Heart },
    // { id: 'consultations', label: 'Consultations', icon: Stethoscope },
    { id: 'timeslots', label: 'Time Slots', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getTodayAppointments = () => {
    const today = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear() &&
        appointment.status !== 'cancelled'
      );
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-600';
      case 'confirmed':
        return 'bg-green-50 text-green-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600';
      case 'completed':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const NotificationToast = () => {
    if (!notification.show) return null;

    const bgColor = notification.type === 'success' ? 'bg-green-100 border-green-500' :
      notification.type === 'error' ? 'bg-red-100 border-red-500' :
        'bg-blue-100 border-blue-500';
    const textColor = notification.type === 'success' ? 'text-green-800' :
      notification.type === 'error' ? 'text-red-800' :
        'text-blue-800';

    return (
      <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-md border-l-4 ${bgColor} z-50`}>
        <p className={`font-medium ${textColor}`}>{notification.message}</p>
      </div>
    );
  };

  const EmergencyAlertModal = () => {
    if (!showEmergencyAlert || !currentEmergencyAlert) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6 animate-pulse-once">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-600">Emergency Consultation!</h3>
          </div>

          <div className="mb-6">
            <p className="font-medium mb-2">A patient is requesting an emergency consultation:</p>
            <div className="bg-red-50 p-3 rounded-lg">
              <p><span className="font-medium">Patient:</span> {currentEmergencyAlert.userName}</p>
              <p><span className="font-medium">Reason:</span> {currentEmergencyAlert.emergencyReason || 'Medical emergency'}</p>
              <p><span className="font-medium">Time:</span> {new Date(currentEmergencyAlert.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => handleEmergencyResponse(false, currentEmergencyAlert)}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => handleEmergencyResponse(true, currentEmergencyAlert)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Accept & Start Consultation
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationsPanel = () => {
    if (!showNotificationsPanel) return null;

    return (
      <div className="absolute top-16 right-4 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowNotificationsPanel(false)}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {emergencyAlerts.length > 0 ? (
          <div className="divide-y">
            {emergencyAlerts.map(alert => (
              <div key={alert.id} className="p-3 hover:bg-gray-50">
                <div className="flex items-center mb-1">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  <p className="font-medium text-sm">Emergency Request</p>
                  <span className="ml-auto text-xs text-gray-500">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  {alert.userName} needs emergency consultation
                </p>
                <div className="flex mt-2">
                  <button
                    onClick={() => handleEmergencyResponse(false, alert)}
                    className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2 hover:bg-gray-200"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleEmergencyResponse(true, alert)}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No notifications</p>
          </div>
        )}
      </div>
    );
  };

  const DashboardOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData.name || 'Doctor'}!
            </h1>
            <p className="text-gray-600 mt-1">
              {userData.specialization && `Specializing in ${userData.specialization}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's Date</p>
              <p className="font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Toggle */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <AlertCircle className={`w-8 h-8 ${emergencyAvailable ? 'text-green-600' : 'text-red-600'}`} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Emergency Availability</h3>
              <p className="text-gray-600">You are currently {emergencyAvailable ? 'available' : 'not available'} for emergency consultations</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
              title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={emergencyAvailable}
                onChange={toggleEmergencyAvailability}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
            <Heart className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Consults</p>
              <p className="text-2xl font-bold text-gray-900">{stats.emergencyConsultations}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          {emergencyAlerts.length > 0 && (
            <div className="absolute -right-1 -top-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                {emergencyAlerts.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Appointments</h3>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : getTodayAppointments().length > 0 ? (
          <div className="space-y-3">
            {getTodayAppointments().map((appointment) => (
              <div key={appointment.id} className={`flex items-center justify-between p-3 rounded-lg ${getStatusClass(appointment.status)}`}>
                <div>
                  <p className="font-medium text-gray-900">{appointment.userName}</p>
                  <p className="text-sm text-gray-600">{appointment.time}</p>
                  {appointment.isEmergency && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Emergency
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium capitalize">{appointment.status}</span>

                  {appointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAppointmentStatusChange(appointment.id, 'confirmed')}
                        className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                        title="Accept"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => startVideoConsultation(appointment)}
                      className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      title="Start Consultation"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No appointments scheduled for today
          </div>
        )}
      </div>

      {/* Emergency Requests Section */}
      {emergencyAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-600">Pending Emergency Requests</h3>
          </div>

          <div className="space-y-3">
            {emergencyAlerts.map(alert => (
              <div key={alert.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{alert.userName}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      Requested at {new Date(alert.createdAt).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      Reason: {alert.emergencyReason || 'Medical emergency'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEmergencyResponse(false, alert)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleEmergencyResponse(true, alert)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Accept
                    </button>
                  </div>

                  {appointments.userPhone && (
                    <button
                      onClick={() => {
                        const whatsappUrl = createWhatsAppLink(appointments);
                        if (whatsappUrl) {
                          window.open(whatsappUrl, '_blank');
                        }
                      }}
                      className="text-green-600 hover:text-green-900"
                      title="Share via WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Experience</p>
              <p className="font-medium">{userData.experience || 'Not specified'} years</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Stethoscope className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Specialization</p>
              <p className="font-medium">{userData.specialization || 'General Practice'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <p className="font-medium">{stats.rating || '4.5'}/5.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FeedbackSection = () => (
    <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Feedback</h3>

      {feedbackLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : feedbacks.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-3">
              <div className="text-2xl font-bold text-blue-600">{stats.rating}</div>
            </div>
            <div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(parseFloat(stats.rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">Based on {feedbacks.length} reviews</p>
            </div>
          </div>

          {feedbacks.slice(0, 5).map((feedback) => (
            <div key={feedback.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{feedback.userName}</p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{feedback.feedback}</p>
              <div className="text-xs text-gray-500 mt-2">
                Appointment: {new Date(feedback.appointmentDate).toLocaleDateString()} at {feedback.appointmentTime}
              </div>
            </div>
          ))}

          {feedbacks.length > 5 && (
            <div className="text-center pt-2">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={() => {
                  // You could implement a modal to show all feedback
                  showNotification('info', 'Showing 5 most recent reviews');
                }}
              >
                See all {feedbacks.length} reviews
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>You haven't received any feedback yet.</p>
        </div>
      )}
    </div>
  );

  const createWhatsAppLink = (appointment) => {
    if (!appointment || !appointment.userPhone) {
      showNotification('error', 'No phone number available for WhatsApp');
      return null;
    }

    // Format the phone number (remove any non-numeric characters)
    const phone = appointment.userPhone.replace(/\D/g, '');

    // Create message text
    const message = `
Hello ${appointment.userName},

Your appointment with Dr. ${userData.name} has been ${appointment.status}.

Details:
- Date: ${new Date(appointment.date).toLocaleDateString()}
- Time: ${appointment.time}
- Status: ${appointment.status}
${appointment.isEmergency ? '- Type: Emergency Consultation' : ''}

If you have any questions, please contact us.

Thank you,
Pet-Vet Platform
  `.trim();

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return whatsappUrl;
  };




  const AppointmentsManager = () => {
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredAppointments = appointments.filter(appointment => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'emergency') return appointment.isEmergency;
      return appointment.status === filterStatus;
    });

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Appointment Management</h2>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              All Appointments
            </button>
            <button
              onClick={() => setFilterStatus('emergency')}
              className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'emergency' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Emergency
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'pending' ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'confirmed' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus('cancelled')}
              className={`px-4 py-3 font-medium whitespace-nowrap ${filterStatus === 'cancelled' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Cancelled
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => {
                    const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
                    const isPast = appointmentDate < new Date();

                    return (
                      <tr key={appointment.id} className={isPast && appointment.status !== 'completed' ? 'bg-gray-50' : appointment.isEmergency ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{appointment.userName}</div>
                              <div className="text-sm text-gray-500">{appointment.userEmail}</div>
                              {appointment.userPhone && (
                                <div className="text-sm text-gray-500">{appointment.userPhone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(appointment.date).toDateString()}</div>
                          <div className="text-sm text-gray-500">{appointment.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.isEmergency ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {appointment.isEmergency ? 'Emergency' : 'Regular'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleAppointmentStatusChange(appointment.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-900 mr-2"
                                  title="Accept"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleAppointmentStatusChange(appointment.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && !isPast && (
                              <button
                                onClick={() => startVideoConsultation(appointment)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Start Consultation"
                              >
                                <Video className="w-5 h-5" />
                              </button>
                            )}
                            {appointment.status === 'confirmed' && (
                              <button
                                onClick={() => handleAppointmentStatusChange(appointment.id, 'completed')}
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark Completed"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                            {appointment.status === 'completed' && (
                              <button
                                onClick={() => startPrescriptionCreation(appointment)}
                                className="text-purple-600 hover:text-purple-900 ml-2"
                                title="Create Prescription"
                              >
                                <PenTool className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Appointments Found</h3>
              <p className="text-gray-600">
                {filterStatus === 'all'
                  ? "You don't have any appointments yet."
                  : filterStatus === 'emergency'
                    ? "You don't have any emergency appointments."
                    : `You don't have any ${filterStatus} appointments.`}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ConsultationsManager = () => {
    const [emergencyConsultations, setEmergencyConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [declineReason, setDeclineReason] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
      // Fetch emergency consultation requests
      const fetchEmergencyConsultations = async () => {
        try {
          setLoading(true);
          const db = getDatabase();
          const consultationsRef = ref(db, 'emergencyRequests');

          onValue(consultationsRef, (snapshot) => {
            const consultationsList = [];

            if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                const consultation = childSnapshot.val();

                // Only include consultations for this vet
                if (
                  consultation.vetId === userData.id ||
                  (userData.email && consultation.vetEmail === userData.email) ||
                  (userData.name && consultation.vetName === userData.name) ||
                  // If no specific vet is assigned yet but we have emergency availability
                  (consultation.status === 'pending' && !consultation.vetId && emergencyAvailable)
                ) {
                  consultationsList.push({
                    id: childSnapshot.key,
                    ...consultation
                  });
                }
              });
            }

            // Sort by creation date (newest first)
            consultationsList.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });

            setEmergencyConsultations(consultationsList);
            setLoading(false);
          });
        } catch (error) {
          console.error("Error fetching emergency consultations:", error);
          showNotification('error', 'Failed to load emergency consultation requests');
          setLoading(false);
        }
      };

      fetchEmergencyConsultations();
    }, [userData.id, userData.email, userData.name, emergencyAvailable]);

    const handleAcceptConsultation = async (consultationId) => {
      try {
        const db = getDatabase();
        const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

        // Get the consultation data
        const snapshot = await get(consultationRef);
        if (!snapshot.exists()) {
          throw new Error("Consultation not found");
        }

        const consultation = snapshot.val();

        // Update consultation status
        await update(consultationRef, {
          status: 'accepted',
          vetId: userData.id,
          vetName: userData.name,
          vetEmail: userData.email,
          acceptedAt: new Date().toISOString()
        });

        // Start video consultation
        const emergencyAppointment = {
          ...consultation,
          id: consultationId,
          isEmergency: true,
          fromEmergencyRequest: true,
          emergencyRequestId: consultationId,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'confirmed'
        };

        startVideoConsultation(emergencyAppointment);

        // No need to update local state as onValue will trigger automatically
        showNotification('success', 'Emergency consultation accepted');
      } catch (error) {
        console.error("Error accepting consultation:", error);
        showNotification('error', 'Failed to accept consultation');
      }
    };

    const handleDeclineConsultation = async () => {
      if (!selectedConsultation) return;

      try {
        const db = getDatabase();
        const consultationRef = ref(db, `emergencyRequests/${selectedConsultation.id}`);

        // Update consultation status
        await update(consultationRef, {
          status: 'declined',
          declineReason,
          declinedAt: new Date().toISOString(),
          vetId: userData.id,
          vetName: userData.name,
          vetEmail: userData.email
        });

        // No need to update local state as onValue will trigger automatically
        showNotification('success', 'Emergency consultation declined');
        setShowDeclineModal(false);
        setSelectedConsultation(null);
        setDeclineReason('');
      } catch (error) {
        console.error("Error declining consultation:", error);
        showNotification('error', 'Failed to decline consultation');
      }
    };

    const handleCompleteConsultation = async (consultationId) => {
      try {
        const db = getDatabase();
        const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

        // Update consultation status
        await update(consultationRef, {
          status: 'completed',
          completedAt: new Date().toISOString()
        });

        // No need to update local state as onValue will trigger automatically
        showNotification('success', 'Emergency consultation marked as completed');
      } catch (error) {
        console.error("Error completing consultation:", error);
        showNotification('error', 'Failed to complete consultation');
      }
    };

    const handleDeleteConsultation = async (consultationId) => {
      try {
        const db = getDatabase();
        const consultationRef = ref(db, `emergencyRequests/${consultationId}`);

        // Delete consultation
        await set(consultationRef, null);

        // No need to update local state as onValue will trigger automatically
        showNotification('success', 'Emergency consultation record removed');
      } catch (error) {
        console.error("Error deleting consultation:", error);
        showNotification('error', 'Failed to delete consultation record');
      }
    };

    const DeclineModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Decline Emergency Consultation</h3>
          <p className="mb-4 text-gray-700">Patient: {selectedConsultation?.userName}</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={4}
              placeholder="Provide a reason for declining this consultation..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeclineModal(false);
                setSelectedConsultation(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeclineConsultation}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );

    const formatDateTime = (dateTimeStr) => {
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    };

    const filteredConsultations = emergencyConsultations.filter(consultation => {
      if (filter === 'all') return true;
      return consultation.status === filter;
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Emergency Consultations</h2>

          <div className="flex items-center">
            <div className={`mr-2 w-3 h-3 rounded-full ${emergencyAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-700">
              You are currently {emergencyAvailable ? 'available' : 'not available'} for emergency consultations
            </span>
            <button
              onClick={toggleEmergencyAvailability}
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${emergencyAvailable
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
            >
              {emergencyAvailable ? 'Turn Off' : 'Turn On'}
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 font-medium ${filter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 font-medium ${filter === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('accepted')}
              className={`px-4 py-2 font-medium ${filter === 'accepted' ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 font-medium ${filter === 'completed' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('declined')}
              className={`px-4 py-2 font-medium ${filter === 'declined' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Declined
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredConsultations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emergency Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConsultations.map((consultation) => (
                    <tr key={consultation.id} className={consultation.status === 'pending' ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{consultation.userName}</div>
                          <div className="text-sm text-gray-500">{consultation.userEmail}</div>
                          {consultation.userPhone && (
                            <div className="text-sm text-gray-500">{consultation.userPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {consultation.petName || 'Not specified'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {consultation.petType || 'Type not specified'} - {consultation.petBreed || 'Breed not specified'}
                          </div>
                          <div className="text-sm text-red-600">
                            {consultation.emergencyReason || 'Emergency consultation'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDateTime(consultation.createdAt)}
                        </div>
                        {consultation.acceptedAt && (
                          <div className="text-sm text-green-600">
                            Accepted: {formatDateTime(consultation.acceptedAt)}
                          </div>
                        )}
                        {consultation.completedAt && (
                          <div className="text-sm text-blue-600">
                            Completed: {formatDateTime(consultation.completedAt)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          consultation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            consultation.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                          }`}>
                          {consultation.status}
                        </span>

                        {consultation.status === 'declined' && consultation.declineReason && (
                          <div className="mt-1 text-xs text-gray-500">
                            Reason: {consultation.declineReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {consultation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAcceptConsultation(consultation.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Accept"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedConsultation(consultation);
                                  setShowDeclineModal(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Decline"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}

                          {consultation.status === 'accepted' && (
                            <>
                              <button
                                onClick={() => handleCompleteConsultation(consultation.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark Completed"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  const emergencyAppointment = {
                                    ...consultation,
                                    isEmergency: true,
                                    fromEmergencyRequest: true,
                                    emergencyRequestId: consultation.id,
                                    date: new Date().toISOString().split('T')[0],
                                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    status: 'confirmed'
                                  };
                                  startVideoConsultation(emergencyAppointment);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Start/Resume Consultation"
                              >
                                <Video className="w-5 h-5" />
                              </button>
                            </>
                          )}

                          {(consultation.status === 'completed' || consultation.status === 'declined') && (
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
                                  handleDeleteConsultation(consultation.id);
                                }
                              }}
                              className="text-gray-600 hover:text-gray-900"
                              title="Delete Record"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No emergency consultations</h3>
              <p className="text-gray-600">
                {emergencyAvailable
                  ? filter === 'all'
                    ? "You are available for emergency consultations. Requests will appear here."
                    : `No ${filter} emergency consultations found.`
                  : "You are currently not available for emergency consultations. Toggle availability to receive requests."}
              </p>
            </div>
          )}
        </div>

        {showDeclineModal && selectedConsultation && <DeclineModal />}
      </div>
    );
  };

  const TimeSlotsManager = () => {
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [saving, setSaving] = useState(false);
    const [multipleSelectMode, setMultipleSelectMode] = useState(false);

    // Days of the week
    const days = [
      { id: 'monday', label: 'Monday' },
      { id: 'tuesday', label: 'Tuesday' },
      { id: 'wednesday', label: 'Wednesday' },
      { id: 'thursday', label: 'Thursday' },
      { id: 'friday', label: 'Friday' },
      { id: 'saturday', label: 'Saturday' },
      { id: 'sunday', label: 'Sunday' }
    ];

    // Hours in 24-hour format
    const hours = [9, 10, 11, 12, 14, 15, 16, 17];

    const formatHour = (hour) => {
      return hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
    };

    const toggleSlotSelection = (day, hour) => {
      const slotKey = `${day}-${hour}`;
      const isSelected = selectedSlots.includes(slotKey);

      if (isSelected) {
        setSelectedSlots(selectedSlots.filter(slot => slot !== slotKey));
      } else {
        setSelectedSlots([...selectedSlots, slotKey]);
      }
    };

    const saveMultipleSlots = async () => {
      if (selectedSlots.length === 0) {
        showNotification('error', 'No slots selected');
        return;
      }

      setSaving(true);

      try {
        // Create a deep copy of the timeSlots
        const updatedSlots = JSON.parse(JSON.stringify(timeSlots));
        let hasConflict = false;

        // Update all selected slots
        selectedSlots.forEach(slotKey => {
          const [day, hourStr] = slotKey.split('-');
          const hour = parseInt(hourStr);

          // Check for conflicts with existing appointments
          const formattedDay = formatDayForAppointment(day);
          const formattedHour = formatHourForAppointment(hour);

          const conflictingAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            const aptDay = aptDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            return (
              aptDay === day &&
              apt.time === formattedHour &&
              apt.status !== 'cancelled' &&
              apt.status !== 'completed'
            );
          });

          if (conflictingAppointments.length > 0) {
            showNotification('error', `Cannot update ${day} at ${formatHour(hour)} - you have existing appointments in this slot`);
            hasConflict = true;
            return;
          }

          // Initialize the day object if it doesn't exist
          if (!updatedSlots[day]) {
            updatedSlots[day] = {};
          }

          // Set the availability
          updatedSlots[day][hourStr] = true; // Make all selected slots available
        });

        // If there's a conflict, abort the save
        if (hasConflict) {
          setSaving(false);
          return;
        }

        // Get Firebase database reference
        const db = getDatabase();

        // Determine the path where we need to save the data
        let vetPath = '';
        let vetId = '';

        // Try to get the vet ID from userData
        if (userData.id) {
          vetId = userData.id;
          vetPath = `veterinary/${vetId}`;
        }
        // If no ID, try to find by email
        else if (userData.email) {
          console.log("Finding vet by email:", userData.email);
          const vetsRef = ref(db, 'veterinary');
          const snapshot = await get(vetsRef);

          if (snapshot.exists()) {
            const vets = snapshot.val();
            // Find the vet with matching email
            for (const id in vets) {
              if (vets[id].email === userData.email) {
                vetId = id;
                vetPath = `veterinary/${vetId}`;
                // Update userData with the found ID
                setUserData(prev => ({ ...prev, id: vetId }));
                sessionStorage.setItem('userData', JSON.stringify({ ...userData, id: vetId }));
                console.log("Found vet by email, ID:", vetId);
                break;
              }
            }
          }
        }

        // If still no ID, try to find by name
        if (!vetId && userData.name) {
          console.log("Finding vet by name:", userData.name);
          const vetsRef = ref(db, 'veterinary');
          const snapshot = await get(vetsRef);

          if (snapshot.exists()) {
            const vets = snapshot.val();
            // Find the vet with matching name
            for (const id in vets) {
              if (vets[id].name === userData.name) {
                vetId = id;
                vetPath = `veterinary/${vetId}`;
                // Update userData with the found ID
                setUserData(prev => ({ ...prev, id: vetId }));
                sessionStorage.setItem('userData', JSON.stringify({ ...userData, id: vetId }));
                console.log("Found vet by name, ID:", vetId);
                break;
              }
            }
          }
        }

        // If we couldn't determine the vet ID by any method, show error
        if (!vetPath) {
          throw new Error('Could not identify vet account. Please log in again.');
        }

        console.log(`Saving time slots to path: ${vetPath}`);
        const vetRef = ref(db, vetPath);

        // First, fetch the current data to make sure we have the latest
        const snapshot = await get(vetRef);
        if (snapshot.exists()) {
          const currentData = snapshot.val();
          // Merge with any existing time slots
          if (currentData.timeSlots) {
            // Keep existing slots that aren't being updated
            Object.keys(currentData.timeSlots).forEach(day => {
              if (!updatedSlots[day]) {
                updatedSlots[day] = currentData.timeSlots[day];
              } else {
                // For days that exist in both, merge the hours
                Object.keys(currentData.timeSlots[day]).forEach(hour => {
                  if (updatedSlots[day][hour] === undefined) {
                    updatedSlots[day][hour] = currentData.timeSlots[day][hour];
                  }
                });
              }
            });
          }
        }

        // Log what we're about to save
        console.log('Updating time slots in Firebase:', updatedSlots);

        // Now save the merged data
        await update(vetRef, {
          timeSlots: updatedSlots,
          lastUpdated: new Date().toISOString() // Add timestamp for tracking
        });

        // Verify the data was saved
        const verifySnapshot = await get(vetRef);
        if (verifySnapshot.exists()) {
          const verifyData = verifySnapshot.val();
          console.log('Verification data after save:', verifyData.timeSlots);

          // Update local state with verified data from Firebase
          setTimeSlots(verifyData.timeSlots);
          showNotification('success', `${selectedSlots.length} time slots updated successfully`);

          // Clear selection
          setSelectedSlots([]);
        } else {
          throw new Error('Failed to verify data was saved');
        }
      } catch (error) {
        console.error("Error updating time slots:", error);
        showNotification('error', 'Failed to update time slots: ' + error.message);
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Time Slots</h2>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Set Your Available Hours</h3>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={multipleSelectMode}
                  onChange={() => {
                    setMultipleSelectMode(!multipleSelectMode);
                    setSelectedSlots([]);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Multiple Selection Mode</span>
              </label>

              {multipleSelectMode && (
                <button
                  onClick={saveMultipleSlots}
                  disabled={saving || selectedSlots.length === 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${saving || selectedSlots.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {saving ? 'Saving...' : `Save Selected (${selectedSlots.length})`}
                </button>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {multipleSelectMode
              ? 'Click on multiple time slots to select them, then click "Save Selected".'
              : 'Click on the time slots to toggle availability. Blue indicates available, gray indicates unavailable.'}
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  {hours.map((hour) => (
                    <th key={hour} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {formatHour(hour)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {days.map((day) => (
                  <tr key={day.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {day.label}
                    </td>
                    {hours.map((hour) => {
                      const isAvailable = timeSlots[day.id]?.[hour] || false;
                      const isSelected = selectedSlots.includes(`${day.id}-${hour}`);

                      let buttonClass = '';
                      if (multipleSelectMode) {
                        buttonClass = isSelected
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                      } else {
                        buttonClass = isAvailable
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200';
                      }

                      return (
                        <td key={`${day.id}-${hour}`} className="px-2 py-4 text-center">
                          <button
                            onClick={() => multipleSelectMode
                              ? toggleSlotSelection(day.id, hour)
                              : updateTimeSlot(day.id, hour, !isAvailable)
                            }
                            disabled={saving}
                            className={`w-full h-8 rounded-md transition-colors ${buttonClass} ${saving ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          >
                            {multipleSelectMode
                              ? (isSelected ? 'Selected' : 'Select')
                              : (isAvailable ? 'Available' : 'Unavailable')}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Changes to your availability are saved automatically. Make sure to check for any conflicts with existing appointments.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ProfilePage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={userData.name || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={userData.email || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={userData.phone || 'Not provided'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <input
              type="text"
              value={userData.specialization || 'Not specified'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
          <input
            type="number"
            value={userData.experience || ''}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Consultation Settings</label>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Emergency Availability</p>
                <p className="text-sm text-gray-600 mt-1">
                  When enabled, you'll receive alerts for emergency consultation requests
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-full hover:bg-gray-200"
                  title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={emergencyAvailable}
                    onChange={toggleEmergencyAvailability}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> To update your profile information, please contact the administrator.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h3>
        <div className="p-4 bg-green-50 rounded-lg flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
          <div>
            <p className="font-medium text-green-800">Your documents have been verified</p>
            <p className="text-sm text-green-700">Your license and credentials have been approved by our team.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Emergency Alert Sound</p>
              <p className="text-sm text-gray-600">Play sound when new emergency requests arrive</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={soundEnabled}
                onChange={() => setSoundEnabled(!soundEnabled)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      <FeedbackSection />
    </div>
  );
  const InvisibleVideoCall = ({ appointmentId, userId, userName, onEndCall }) => {
    // This component will handle the WebRTC connection but be visually hidden
    return (
      <div style={{ display: 'none' }}>
        <SimpleVideoCall
          appointmentId={appointmentId}
          userId={userId}
          userName={userName}
          onEndCall={onEndCall}
        />
      </div>
    );
  };
  // Replace the current VideoConsultation component in VetDashboard.js with this one
const VideoConsultation = () => {
  // Generate consistent room ID from appointment ID
  const appointmentId = activeAppointment?.id || 'default-room';
  
  // Create a unique user ID for the doctor
  const doctorId = userData.id || `vet_${Math.floor(Math.random() * 1000000)}`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl h-full max-h-[80vh] flex flex-col overflow-hidden">
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <div className="flex items-center">
            <Video className="w-5 h-5 mr-2" />
            <h3 className="font-semibold">
              {!activeAppointment?.consultationEnded ? 
                `${activeAppointment?.isEmergency ? 'Emergency' : ''} Consultation with ${activeAppointment?.userName}` : 
                `Create Prescription for ${activeAppointment?.userName}`}
            </h3>
          </div>
          <button
            onClick={endVideoConsultation}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-4 p-4">
          <div className="col-span-2 bg-gray-900 rounded-lg overflow-hidden">
            {/* SimpleVideoCall component integration */}
            {!activeAppointment?.consultationEnded && (
              <SimpleVideoCall
                appointmentId={appointmentId}
                userId={doctorId}
                userName={userData?.name || 'Doctor'}
                onEndCall={endVideoConsultation}
              />
            )}
            {activeAppointment?.consultationEnded && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Consultation completed</p>
                  <p className="text-sm text-gray-400 mt-2">Please add medicines to the prescription</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
            <h4 className="font-semibold text-gray-900 mb-3">Create Prescription</h4>

            {activeAppointment?.isEmergency && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-800 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Emergency Consultation
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Reason: {activeAppointment.emergencyReason || 'Emergency medical situation'}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>

              {prescription.medicines.map((medicine, index) => (
                <div key={index} className="flex items-center justify-between mb-2 p-2 bg-white rounded border">
                  <div>
                    <p className="font-medium text-sm">{medicine.name}</p>
                    <p className="text-xs text-gray-500">{medicine.dosage} - {medicine.duration}</p>
                  </div>
                  <button
                    onClick={() => removeMedicine(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    className="col-span-3 px-2 py-1 border border-gray-300 rounded"
                    placeholder="Medicine name"
                    id="medicine-name"
                  />
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 rounded"
                    placeholder="Dosage"
                    id="medicine-dosage"
                  />
                  <input
                    type="text"
                    className="px-2 py-1 border border-gray-300 rounded"
                    placeholder="Duration"
                    id="medicine-duration"
                  />
                  <button
                    onClick={() => {
                      const name = document.getElementById('medicine-name').value;
                      const dosage = document.getElementById('medicine-dosage').value;
                      const duration = document.getElementById('medicine-duration').value;
                      addMedicineToList(name, dosage, duration);
                      document.getElementById('medicine-name').value = '';
                      document.getElementById('medicine-dosage').value = '';
                      document.getElementById('medicine-duration').value = '';
                    }}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={submitPrescription}
              disabled={prescription.medicines.length === 0}
              className={`w-full py-2 rounded-lg font-medium ${prescription.medicines.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Save Prescription & Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


  const PatientsManager = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all'); // all, new, returning
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpNotes, setFollowUpNotes] = useState('');
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);

    useEffect(() => {
      // Fetch patients data
      const fetchPatients = async () => {
        try {
          setLoading(true);
          const db = getDatabase();
          const patientsRef = ref(db, 'appointments');

          const snapshot = await get(patientsRef);
          const patientsList = [];
          const uniquePatients = new Map();

          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const appointment = childSnapshot.val();

              // Only include appointments for this vet
              if (
                appointment.vetId === userData.id ||
                (userData.email && appointment.vetEmail === userData.email) ||
                (userData.name && appointment.vetName === userData.name)
              ) {
                const userId = appointment.userId;
                const userName = appointment.userName;
                const userEmail = appointment.userEmail;
                const userPhone = appointment.userPhone || '';
                const date = appointment.date;
                const time = appointment.time;
                const status = appointment.status;
                const hasPrescription = appointment.hasPrescription || false;
                const isEmergency = appointment.isEmergency || false;

                // Create unique key for this patient
                const patientKey = `${userId}-${userName}`;

                if (!uniquePatients.has(patientKey)) {
                  // First time seeing this patient
                  uniquePatients.set(patientKey, {
                    id: userId,
                    name: userName,
                    email: userEmail,
                    phone: userPhone,
                    isNew: true,
                    hasEmergencyVisit: isEmergency,
                    lastVisit: new Date(`${date} ${time}`),
                    appointments: [
                      {
                        id: childSnapshot.key,
                        date,
                        time,
                        status,
                        hasPrescription,
                        isEmergency
                      }
                    ],
                    nextFollowUp: appointment.followUpDate ? new Date(appointment.followUpDate) : null,
                    followUpNotes: appointment.followUpNotes || '',
                    petDetails: appointment.petDetails || {
                      name: 'Not specified',
                      type: 'Not specified',
                      breed: 'Not specified',
                      age: 'Not specified'
                    }
                  });
                } else {
                  // Existing patient - add this appointment
                  const patient = uniquePatients.get(patientKey);
                  patient.appointments.push({
                    id: childSnapshot.key,
                    date,
                    time,
                    status,
                    hasPrescription,
                    isEmergency
                  });

                  // Check if patient has had an emergency visit
                  if (isEmergency) {
                    patient.hasEmergencyVisit = true;
                  }

                  // Update last visit if this appointment is more recent
                  const appointmentDate = new Date(`${date} ${time}`);
                  if (appointmentDate > patient.lastVisit) {
                    patient.lastVisit = appointmentDate;

                    // Update next follow-up if available
                    if (appointment.followUpDate) {
                      patient.nextFollowUp = new Date(appointment.followUpDate);
                      patient.followUpNotes = appointment.followUpNotes || '';
                    }
                  }

                  // Not a new patient anymore if they have multiple appointments
                  if (patient.appointments.length > 1) {
                    patient.isNew = false;
                  }

                  // Update pet details if available
                  if (appointment.petDetails) {
                    patient.petDetails = appointment.petDetails;
                  }
                }
              }
            });

            // Convert map to array and sort by last visit (most recent first)
            uniquePatients.forEach(patient => {
              // Sort patient's appointments by date (newest first)
              patient.appointments.sort((a, b) => {
                return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
              });

              patientsList.push(patient);
            });

            patientsList.sort((a, b) => b.lastVisit - a.lastVisit);
            setPatients(patientsList);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching patients:", error);
          showNotification('error', 'Failed to load patients data');
          setLoading(false);
        }
      };

      fetchPatients();
    }, [userData.id, userData.email, userData.name]);

    const handleScheduleFollowUp = async () => {
      if (!selectedPatient || !followUpDate) {
        showNotification('error', 'Please select a follow-up date');
        return;
      }

      try {
        const db = getDatabase();

        // Update the latest appointment with follow-up information
        const latestAppointmentId = selectedPatient.appointments[0].id;
        const appointmentRef = ref(db, `appointments/${latestAppointmentId}`);

        await update(appointmentRef, {
          followUpDate,
          followUpNotes,
          updatedAt: new Date().toISOString()
        });

        // Update local state
        setPatients(patients.map(patient => {
          if (patient.id === selectedPatient.id) {
            return {
              ...patient,
              nextFollowUp: new Date(followUpDate),
              followUpNotes
            };
          }
          return patient;
        }));

        showNotification('success', 'Follow-up scheduled successfully');
        setShowFollowUpModal(false);
        setSelectedPatient(null);
        setFollowUpDate('');
        setFollowUpNotes('');
      } catch (error) {
        console.error("Error scheduling follow-up:", error);
        showNotification('error', 'Failed to schedule follow-up');
      }
    };

    const filteredPatients = patients.filter(patient => {
      if (filterType === 'all') return true;
      if (filterType === 'new') return patient.isNew;
      if (filterType === 'returning') return !patient.isNew;
      if (filterType === 'emergency') return patient.hasEmergencyVisit;
      return true;
    });

    const FollowUpModal = () => (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Follow-Up</h3>
          <p className="mb-4 text-gray-700">Patient: {selectedPatient?.name}</p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Follow-Up Date</label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={4}
              placeholder="Add notes about the follow-up..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowFollowUpModal(false);
                setSelectedPatient(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleFollowUp}
              disabled={!followUpDate}
              className={`px-4 py-2 rounded-lg ${followUpDate ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Schedule
            </button>
          </div>
        </div>
      </div>
    );

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Patient Records</h2>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All Patients
            </button>
            <button
              onClick={() => setFilterType('new')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === 'new'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              New Patients
            </button>
            <button
              onClick={() => setFilterType('returning')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === 'returning'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Returning Patients
            </button>
            <button
              onClick={() => setFilterType('emergency')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === 'emergency'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Emergency Patients
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient / Pet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Visit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Follow-Up
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className={
                      patient.hasEmergencyVisit ? 'bg-red-50' :
                        patient.isNew ? 'bg-green-50' : ''
                    }>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {patient.name}
                            {patient.isNew && (
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                                New
                              </span>
                            )}
                            {patient.hasEmergencyVisit && (
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3 inline mr-1" />
                                Emergency
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                          {patient.phone && <div className="text-sm text-gray-500">{patient.phone}</div>}
                          <div className="mt-1 text-xs text-gray-600">
                            Pet: {patient.petDetails.name} ({patient.petDetails.type} - {patient.petDetails.breed})
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(patient.lastVisit)}</div>
                        <div className="text-sm text-gray-500">
                          {patient.appointments[0].time}
                        </div>
                        {patient.appointments[0].isEmergency && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Emergency Visit
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.appointments[0].status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            patient.appointments[0].status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              patient.appointments[0].status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {patient.appointments[0].status}
                          </span>

                          {patient.appointments[0].hasPrescription && (
                            <span className="mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              Has Prescription
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.nextFollowUp ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(patient.nextFollowUp)}
                            </div>
                            {patient.followUpNotes && (
                              <div className="text-xs text-gray-500 max-w-xs truncate">
                                {patient.followUpNotes}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowFollowUpModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Schedule Follow-Up"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            // View patient details or medical history
                          }}
                          className="text-purple-600 hover:text-purple-900"
                          title="View Medical History"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600">
              {filterType === 'all'
                ? "You don't have any patients yet."
                : filterType === 'new'
                  ? "You don't have any new patients."
                  : filterType === 'emergency'
                    ? "You don't have any emergency patients."
                    : "You don't have any returning patients."}
            </p>
          </div>
        )}

        {showFollowUpModal && selectedPatient && <FollowUpModal />}
      </div>
    );
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'profile':
        return <ProfilePage />;
      case 'appointments':
        return <AppointmentsManager />;
      case 'timeslots':
        return <TimeSlotsManager />;
      case 'patients':
        return <PatientsManager />;
      case 'consultations':
        return <ConsultationsManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Notification Toast */}
      <NotificationToast />

      {/* Emergency Alert Modal */}
      <EmergencyAlertModal />

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Veterinary Portal</h1>
          <p className="text-sm text-gray-600">{userData.name || 'Doctor'}</p>
        </div>

        <nav className="mt-6 gap-2 flex flex-col">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
                  }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}

                {/* Add notification badge for consultations tab when there are emergency alerts */}
                {item.id === 'consultations' && emergencyAlerts.length > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {emergencyAlerts.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  className="p-2 text-gray-600 hover:text-gray-800 relative"
                  onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                >
                  <Bell className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                <NotificationsPanel />
              </div>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 text-gray-600 hover:text-gray-800"
                title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
              >
                {soundEnabled ? (
                  <Volume2 className="h-6 w-6" />
                ) : (
                  <VolumeX className="h-6 w-6" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'D'}
                  </span>
                </div>
                <span className="text-gray-700">{userData.name || 'Doctor'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Video Consultation Modal */}
      {videoConsultActive && activeAppointment && <VideoConsultation />}
    </div>
  );
};

export default VeterinaryDashboard;