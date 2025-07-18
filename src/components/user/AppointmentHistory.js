// components/user/AppointmentHistory.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

const AppointmentHistory = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled, completed

  // Fetch user's appointments
  useEffect(() => {
    if (currentUser) {
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
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(appointment => appointment.status === filter);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isPastAppointment = (dateStr, timeStr) => {
    const appointmentDate = new Date(`${dateStr} ${timeStr}`);
    return appointmentDate < new Date();
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Appointment History</h2>
          <p className="text-gray-600">View and manage your pet care appointments</p>
        </div>

        {/* Appointment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            onClick={() => setFilter('all')}
            className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${filter === 'all' ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">All</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
          </div>

          <div 
            onClick={() => setFilter('pending')}
            className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${filter === 'pending' ? 'ring-2 ring-yellow-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center mb-2">
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Pending</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {appointments.filter(app => app.status === 'pending').length}
            </p>
          </div>

          <div 
            onClick={() => setFilter('confirmed')}
            className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${filter === 'confirmed' ? 'ring-2 ring-green-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center mb-2">
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Confirmed</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {appointments.filter(app => app.status === 'confirmed').length}
            </p>
          </div>

          <div 
            onClick={() => setFilter('cancelled')}
            className={`bg-white p-6 rounded-lg shadow-md cursor-pointer ${filter === 'cancelled' ? 'ring-2 ring-red-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 ml-3">Cancelled</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {appointments.filter(app => app.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b p-6">
            <h3 className="text-xl font-semibold text-gray-900">My Appointments</h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const isPast = isPastAppointment(appointment.date, appointment.time);
                return (
                  <div key={appointment.id} className={`p-6 ${isPast ? 'bg-gray-50' : ''}`}>
                    <div className="md:flex md:justify-between md:items-center">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 ${
                            appointment.status === 'pending' ? 'bg-yellow-100' :
                            appointment.status === 'confirmed' ? 'bg-green-100' :
                            appointment.status === 'cancelled' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            <svg className={`w-5 h-5 ${
                              appointment.status === 'pending' ? 'text-yellow-600' :
                              appointment.status === 'confirmed' ? 'text-green-600' :
                              appointment.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              Appointment with Dr. {appointment.vetName}
                            </h4>
                            <div className="flex flex-wrap items-center mt-1">
                              <span className="text-sm text-gray-600 mr-3">
                                {new Date(appointment.date).toDateString()}
                              </span>
                              <span className="text-sm text-gray-600 mr-3">
                                {appointment.time}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* <div className="flex items-center space-x-4">
                        {appointment.status === 'pending' && !isPast && (
                          <button
                            onClick={() => navigate(`/user/reschedule/${appointment.id}`)}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            Reschedule
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/user/appointment/${appointment.id}`)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition duration-300"
                        >
                          View Details
                        </button>
                      </div> */}
                    </div>
                    
                    {/* Additional appointment info */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="text-xs font-medium text-gray-500 uppercase">Amount</h5>
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
              <p className="text-gray-500 mb-4">
                {filter === 'all' 
                  ? 'You don\'t have any appointments scheduled yet.' 
                  : `You don't have any ${filter} appointments.`}
              </p>
              <button
                onClick={() => navigate('/user/book')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Book New Appointment
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppointmentHistory;