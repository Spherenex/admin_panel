import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Video, Star, ShoppingCart, Heart, AlertTriangle, CheckCircle, Package, CreditCard } from 'lucide-react';


// EmergencyConsults Component
const EmergencyConsults = () => {
  const [emergencyVets, setEmergencyVets] = useState([]);
  const [callStatus, setCallStatus] = useState('idle');
  const [currentCall, setCurrentCall] = useState(null);

  // Mock emergency veterinarians
  const availableEmergencyVets = [
    {
      id: 1,
      name: "Dr. Emergency Smith",
      specialization: "Emergency Care",
      rating: 4.7,
      emergencyFee: 1000,
      available: true,
      responseTime: "2-3 min"
    },
    {
      id: 2,
      name: "Dr. Quick Response",
      specialization: "Critical Care",
      rating: 4.9,
      emergencyFee: 1200,
      available: true,
      responseTime: "1-2 min"
    }
  ];

  const handleEmergencyCall = async (vet) => {
    setCallStatus('connecting');
    setCurrentCall(vet);
    
    // Simulate payment and call connection
    setTimeout(() => {
      setCallStatus('connected');
    }, 3000);
  };

  const endCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setCurrentCall(null);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-800">Emergency Consultations</h2>
        <p className="text-gray-600 mt-2">Connect with veterinarians instantly for urgent pet care</p>
      </div>

      {callStatus === 'idle' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Available Emergency Vets</h3>
          <div className="space-y-4">
            {availableEmergencyVets.map(vet => (
              <div key={vet.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800">{vet.name}</h4>
                    <p className="text-sm text-gray-600">{vet.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{vet.rating}</span>
                      <span className="text-sm text-green-600 ml-2">Response: {vet.responseTime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">₹{vet.emergencyFee}</p>
                    <button
                      onClick={() => handleEmergencyCall(vet)}
                      className="mt-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Emergency Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {callStatus === 'connecting' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse">
            <Phone className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connecting to {currentCall?.name}</h3>
            <p className="text-gray-600">Processing payment and connecting...</p>
          </div>
        </div>
      )}

      {callStatus === 'connected' && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Video className="w-16 h-16 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Connected to {currentCall?.name}</h3>
            <p className="text-gray-600">Emergency consultation in progress</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button 
              onClick={endCall}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {callStatus === 'ended' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-4">Call Ended</h3>
          <p className="text-gray-600 mb-4">Please provide feedback for the emergency consultation</p>
          <div className="flex justify-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className="w-6 h-6 text-yellow-500 fill-current cursor-pointer" />
            ))}
          </div>
          <textarea 
            className="w-full p-3 border rounded-lg mb-4" 
            placeholder="Share your experience..."
            rows="3"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
};
export default EmergencyConsults;