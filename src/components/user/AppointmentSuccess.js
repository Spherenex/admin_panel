// components/user/AppointmentSuccess.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AppointmentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentId, appointment } = location.state || {};

  if (!appointment) {
    // If no appointment data, redirect to dashboard
    navigate('/user/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
        <div className="bg-green-100 p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800">Booking Successful!</h2>
          <p className="text-green-600">Your appointment has been scheduled.</p>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Appointment ID:</span>
              <span className="font-medium text-gray-900">{appointmentId}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Veterinarian:</span>
              <span className="font-medium text-gray-900">{appointment.vetName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-900">{new Date(appointment.date).toDateString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium text-gray-900">{appointment.time}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Status:</span>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full uppercase">
                {appointment.status}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Payment Status:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full uppercase">
                {appointment.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium text-gray-900">₹{appointment.paymentAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your appointment is now pending confirmation from the veterinarian.
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You will receive a confirmation email with all details soon.
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Please arrive 10 minutes before your scheduled appointment time.
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => navigate('/user/dashboard')}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/user/appointments')}
              className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition duration-300"
            >
              View All Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSuccess;