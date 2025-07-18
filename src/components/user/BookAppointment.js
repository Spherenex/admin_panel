// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, User, Phone, Video, Star, ShoppingCart, Heart, AlertTriangle, CheckCircle, Package, CreditCard } from 'lucide-react';

// // BookAppointments Component
// const BookAppointments = () => {
//   const [selectedVet, setSelectedVet] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [paymentStatus, setPaymentStatus] = useState('idle');

//   // Mock veterinarians data
//   const veterinarians = [
//     {
//       id: 1,
//       name: "Dr. Sarah Johnson",
//       specialization: "Small Animal Medicine",
//       experience: 8,
//       rating: 4.8,
//       consultationFee: 500,
//       available: true,
//       image: "/api/placeholder/100/100",
//       availableSlots: ["09:00", "10:30", "14:00", "15:30"]
//     },
//     {
//       id: 2,
//       name: "Dr. Michael Chen",
//       specialization: "Exotic Animals",
//       experience: 12,
//       rating: 4.9,
//       consultationFee: 750,
//       available: true,
//       image: "/api/placeholder/100/100",
//       availableSlots: ["11:00", "13:00", "16:00", "17:30"]
//     }
//   ];

//   const handleBookAppointment = async () => {
//     if (!selectedVet || !selectedSlot) return;
    
//     setPaymentStatus('processing');
    
//     // Simulate Razorpay payment
//     setTimeout(() => {
//       const newAppointment = {
//         id: Date.now(),
//         vetId: selectedVet.id,
//         vetName: selectedVet.name,
//         slot: selectedSlot,
//         date: new Date().toISOString().split('T')[0],
//         status: 'pending',
//         consultationFee: selectedVet.consultationFee
//       };
      
//       setAppointments([...appointments, newAppointment]);
//       setPaymentStatus('success');
//       setSelectedVet(null);
//       setSelectedSlot(null);
//     }, 2000);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Book Appointment</h2>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Available Veterinarians */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-xl font-semibold mb-4">Available Veterinarians</h3>
//           <div className="space-y-4">
//             {veterinarians.map(vet => (
//               <div 
//                 key={vet.id}
//                 className={`p-4 border rounded-lg cursor-pointer transition-all ${
//                   selectedVet?.id === vet.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
//                 }`}
//                 onClick={() => setSelectedVet(vet)}
//               >
//                 <div className="flex items-center gap-4">
//                   <img src={vet.image} alt={vet.name} className="w-16 h-16 rounded-full object-cover" />
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-gray-800">{vet.name}</h4>
//                     <p className="text-sm text-gray-600">{vet.specialization}</p>
//                     <div className="flex items-center gap-2 mt-1">
//                       <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                       <span className="text-sm text-gray-600">{vet.rating} • {vet.experience} years exp</span>
//                     </div>
//                     <p className="text-sm font-medium text-green-600 mt-1">₹{vet.consultationFee}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Time Slots & Booking */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-xl font-semibold mb-4">Select Time Slot</h3>
          
//           {selectedVet ? (
//             <div className="space-y-4">
//               <div className="p-3 bg-blue-50 rounded-lg">
//                 <p className="font-medium">Selected: {selectedVet.name}</p>
//                 <p className="text-sm text-gray-600">{selectedVet.specialization}</p>
//               </div>
              
//               <div className="grid grid-cols-2 gap-2">
//                 {selectedVet.availableSlots.map(slot => (
//                   <button
//                     key={slot}
//                     onClick={() => setSelectedSlot(slot)}
//                     className={`p-3 rounded-lg border transition-all ${
//                       selectedSlot === slot ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <Clock className="w-4 h-4 mx-auto mb-1" />
//                     {slot}
//                   </button>
//                 ))}
//               </div>
              
//               {selectedSlot && (
//                 <button
//                   onClick={handleBookAppointment}
//                   disabled={paymentStatus === 'processing'}
//                   className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {paymentStatus === 'processing' ? (
//                     <>Processing Payment...</>
//                   ) : (
//                     <>
//                       <CreditCard className="w-4 h-4" />
//                       Pay ₹{selectedVet.consultationFee} & Book
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-center py-8">Please select a veterinarian first</p>
//           )}
//         </div>
//       </div>

//       {/* My Appointments */}
//       <div className="mt-8 bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-xl font-semibold mb-4">My Appointments</h3>
//         {appointments.length > 0 ? (
//           <div className="space-y-3">
//             {appointments.map(appointment => (
//               <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
//                 <div>
//                   <p className="font-medium">{appointment.vetName}</p>
//                   <p className="text-sm text-gray-600">{appointment.date} at {appointment.slot}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className={`px-3 py-1 rounded-full text-sm ${
//                     appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
//                     'bg-red-100 text-red-800'
//                   }`}>
//                     {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//                   </span>
//                   {appointment.status === 'approved' && (
//                     <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
//                       <Video className="w-4 h-4" />
//                       Join Call
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-8">No appointments booked yet</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookAppointments;




// components/user/BookAppointment.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDatabase, ref, get, set, push, onValue } from 'firebase/database';

const BookAppointment = () => {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  
  const [veterinarian, setVeterinarian] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [step, setStep] = useState(1); // 1: Select Date, 2: Select Time, 3: Confirm, 4: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM'
  ];

  // Fetch veterinarian data
  useEffect(() => {
    const fetchVeterinarian = async () => {
      try {
        setLoading(true);
        const db = getDatabase();
        const vetRef = ref(db, `veterinary/${vetId}`);
        
        onValue(vetRef, (snapshot) => {
          if (snapshot.exists()) {
            setVeterinarian({
              id: snapshot.key,
              ...snapshot.val()
            });
          } else {
            setError('Veterinarian not found');
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching veterinarian:", error);
        setError('Failed to load veterinarian information');
        setLoading(false);
      }
    };
    
    if (vetId) {
      fetchVeterinarian();
    }
  }, [vetId]);

  // Fetch booked appointments for availability check
  useEffect(() => {
    if (selectedDate) {
      const fetchBookedSlots = async () => {
        try {
          const db = getDatabase();
          const appointmentsRef = ref(db, 'appointments');
          const formattedDate = formatDate(selectedDate);
          
          onValue(appointmentsRef, (snapshot) => {
            const bookedTimes = [];
            snapshot.forEach((childSnapshot) => {
              const appointment = childSnapshot.val();
              if (appointment.vetId === vetId && appointment.date === formattedDate) {
                bookedTimes.push(appointment.time);
              }
            });
            
            // Filter out booked times
            const available = timeSlots.filter(time => !bookedTimes.includes(time));
            setAvailableSlots(available);
          });
        } catch (error) {
          console.error("Error fetching booked slots:", error);
        }
      };
      
      fetchBookedSlots();
    }
  }, [selectedDate, vetId]);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateSelect = (date) => {
    // Only allow future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date >= today) {
      setSelectedDate(date);
      setSelectedTime(null);
      setStep(2);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirm = () => {
    setStep(4);
  };

  const handlePayment = async () => {
    if (!currentUser || !selectedDate || !selectedTime || !veterinarian) {
      setError('Missing required information');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save appointment to Firebase
      const db = getDatabase();
      const appointmentsRef = ref(db, 'appointments');
      const newAppointmentRef = push(appointmentsRef);
      
      await set(newAppointmentRef, {
        userId: currentUser.uid,
        userName: userData?.name || currentUser.email,
        userEmail: currentUser.email,
        userPhone: userData?.phone || '',
        vetId: veterinarian.id,
        vetName: veterinarian.name,
        vetEmail: veterinarian.email,
        date: formatDate(selectedDate),
        time: selectedTime,
        status: 'pending',
        amount: 800,
        createdAt: new Date().toISOString(),
        reason: '',
        notes: ''
      });
      
      setPaymentSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const calendarDays = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-12 border-t border-l p-1 bg-gray-100"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isPast = date < today;
      const isSelected = selectedDate && 
                         date.getDate() === selectedDate.getDate() && 
                         date.getMonth() === selectedDate.getMonth() && 
                         date.getFullYear() === selectedDate.getFullYear();
      
      calendarDays.push(
        <div 
          key={`day-${day}`}
          onClick={() => !isPast && handleDateSelect(date)}
          className={`h-12 border-t border-l p-1 ${
            isPast ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 
            isSelected ? 'bg-blue-100 border-2 border-blue-500 cursor-pointer' : 
            'hover:bg-blue-50 cursor-pointer'
          }`}
        >
          <div className="text-right font-medium">{day}</div>
        </div>
      );
    }
    
    return calendarDays;
  };

  const renderTimeSlots = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {availableSlots.map((time) => (
          <div
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={`p-3 border rounded-lg text-center ${
              selectedTime === time 
                ? 'bg-blue-100 border-blue-500 text-blue-800' 
                : 'hover:bg-gray-50 cursor-pointer'
            }`}
          >
            {time}
          </div>
        ))}
        {availableSlots.length === 0 && (
          <div className="col-span-4 text-center py-8 text-gray-500">
            No available slots for this date. Please select another date.
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Pet-Vet Platform</h1>
            </div>
            <button
              onClick={() => navigate('/user/dashboard')}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-100' : 'border-gray-400'}`}>
                1
              </div>
              <div className="text-xs mt-1">Date</div>
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-100' : 'border-gray-400'}`}>
                2
              </div>
              <div className="text-xs mt-1">Time</div>
            </div>
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-100' : 'border-gray-400'}`}>
                3
              </div>
              <div className="text-xs mt-1">Confirm</div>
            </div>
            <div className={`flex-1 h-1 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${step >= 4 ? 'border-blue-600 bg-blue-100' : 'border-gray-400'}`}>
                4
              </div>
              <div className="text-xs mt-1">Payment</div>
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Veterinarian Info */}
          <div className="bg-blue-600 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
            {veterinarian && (
              <div className="flex items-center">
                <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                  {veterinarian.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{veterinarian.name}</h3>
                  <p className="text-blue-100">{veterinarian.specialization}</p>
                </div>
              </div>
            )}
          </div>

          {/* Step 1: Select Date */}
          {step === 1 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
              
              <div className="mb-4 flex justify-between items-center">
                <button
                  onClick={handlePreviousMonth}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h4 className="text-lg font-medium">
                  {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <button
                  onClick={handleNextMonth}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-7 border-r border-b">
                {/* Calendar header */}
                {daysOfWeek.map((day) => (
                  <div key={day} className="h-10 bg-gray-100 flex items-center justify-center font-medium border-t border-l">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {renderCalendar()}
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                * Select a date to view available time slots
              </p>
            </div>
          )}

          {/* Step 2: Select Time */}
          {step === 2 && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Time for {selectedDate?.toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Change Date
                </button>
              </div>
              
              {renderTimeSlots()}
              
              <p className="text-sm text-gray-500 mt-4">
                * Select a time slot to continue
              </p>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Appointment</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDate?.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTime}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Veterinarian</label>
                    <p className="mt-1 text-sm text-gray-900">{veterinarian?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <p className="mt-1 text-sm text-gray-900">{veterinarian?.specialization}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">₹800</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && !paymentSuccess && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount to Pay</label>
                  <div className="text-3xl font-bold text-gray-900 mb-1">₹800</div>
                  <p className="text-sm text-gray-500">Consultation fee for Dr. {veterinarian?.name}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <p className="text-sm text-gray-700 mb-4">
                    By clicking "Pay Now", you agree to our terms of service and privacy policy.
                  </p>
                  
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full py-3 rounded-lg text-white font-medium ${
                      isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition duration-300 flex items-center justify-center`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={() => setStep(3)}
                  disabled={isProcessing}
                  className={`text-blue-600 hover:text-blue-800 font-medium ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Payment Success */}
          {paymentSuccess && (
            <div className="p-6 text-center">
              <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your appointment has been scheduled successfully. You will receive a confirmation soon.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedDate?.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTime}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Veterinarian</label>
                    <p className="mt-1 text-sm text-gray-900">{veterinarian?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm font-medium text-yellow-600">Pending</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard in a few seconds...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookAppointment;
