// ConsultationRoom.jsx
import React, { useState, useEffect } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, Monitor, 
  MessageSquare, FileText, Camera, Volume2, VolumeX, Settings,
  User, Clock, Heart, Thermometer, Activity, Pill, Upload,
  Send, Paperclip, Download, Maximize, Minimize, RotateCcw,
  Share, Save, AlertCircle, CheckCircle, X, Plus, Edit
} from 'lucide-react';

const ConsultationRoom = () => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [callDuration, setCallDuration] = useState(0);

  const [currentPatient] = useState({
    id: 1,
    petName: "Buddy",
    petType: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    ownerName: "John Smith",
    ownerPhone: "+1-555-0123",
    appointmentTime: "10:30 AM",
    appointmentType: "Check-up",
    lastVisit: "2025-04-15",
    medicalHistory: ["Allergic to penicillin", "Previous surgery on left leg"],
    currentMedications: ["Joint supplement", "Flea prevention"]
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "owner",
      message: "Hi Dr. Smith, Buddy has been limping slightly on his front paw",
      timestamp: "10:32 AM",
      type: "text"
    },
    {
      id: 2,
      sender: "vet",
      message: "I see. When did you first notice the limping?",
      timestamp: "10:32 AM",
      type: "text"
    },
    {
      id: 3,
      sender: "owner",
      message: "About 2 days ago, after our walk in the park",
      timestamp: "10:33 AM",
      type: "text"
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [vitals, setVitals] = useState({
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    weight: '',
    bloodPressure: ''
  });

  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState([]);
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isCallActive) {
        setCallDuration(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isCallActive]);

  const startCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: "vet",
        message: newMessage,
        timestamp: currentTime.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: "text"
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addPrescriptionItem = () => {
    setPrescription([...prescription, {
      id: Date.now(),
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }]);
  };

  const updatePrescriptionItem = (id, field, value) => {
    setPrescription(prescription.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removePrescriptionItem = (id) => {
    setPrescription(prescription.filter(item => item.id !== id));
  };

  const saveConsultation = () => {
    const consultationData = {
      patient: currentPatient,
      duration: callDuration,
      notes: consultationNotes,
      vitals,
      diagnosis,
      prescription,
      recommendations,
      timestamp: currentTime
    };
    console.log('Saving consultation:', consultationData);
    alert('Consultation saved successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Consultation Room</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-600">
              <span>Patient: {currentPatient.petName} ({currentPatient.breed})</span>
              <span>•</span>
              <span>Owner: {currentPatient.ownerName}</span>
              <span>•</span>
              <span>{currentPatient.appointmentTime}</span>
              {isCallActive && (
                <>
                  <span>•</span>
                  <span className="text-green-600 font-medium">
                    Call Duration: {formatDuration(callDuration)}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`p-2 rounded-lg ${showChat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-lg ${showNotes ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowVitals(!showVitals)}
                className={`p-2 rounded-lg ${showVitals ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Activity className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Call Area */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-lg aspect-video relative overflow-hidden">
            {/* Main Video */}
            <div className="w-full h-full flex items-center justify-center">
              {isCallActive ? (
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4 mx-auto">
                    {currentPatient.ownerName.charAt(0)}
                  </div>
                  <p className="text-lg font-medium">{currentPatient.ownerName}</p>
                  <p className="text-sm text-gray-300">Connected</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg text-gray-300">Call not started</p>
                </div>
              )}
            </div>

            {/* Picture-in-Picture (Vet's view) */}
            <div className="absolute top-4 right-4 w-40 h-28 bg-gray-800 rounded-lg border-2 border-white overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center text-white">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-lg font-bold">
                      DS
                    </div>
                    <p className="text-xs mt-1">You</p>
                  </div>
                ) : (
                  <VideoOff className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>

            {/* Call Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'}`}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className={`p-3 rounded-full ${isAudioOn ? 'bg-gray-600 text-white' : 'bg-red-600 text-white'}`}
                >
                  {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}
                >
                  <Monitor className="w-5 h-5" />
                </button>

                {!isCallActive ? (
                  <button
                    onClick={startCall}
                    className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={endCall}
                    className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                )}

                <button className="p-3 rounded-full bg-gray-600 text-white">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Pet Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {currentPatient.petName}</p>
                  <p><strong>Type:</strong> {currentPatient.petType}</p>
                  <p><strong>Breed:</strong> {currentPatient.breed}</p>
                  <p><strong>Age:</strong> {currentPatient.age}</p>
                  <p><strong>Last Visit:</strong> {currentPatient.lastVisit}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Owner Details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {currentPatient.ownerName}</p>
                  <p><strong>Phone:</strong> {currentPatient.ownerPhone}</p>
                  <p><strong>Appointment:</strong> {currentPatient.appointmentType}</p>
                </div>
              </div>
            </div>
            
            {currentPatient.medicalHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Medical History</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <ul className="text-sm text-yellow-800 list-disc list-inside">
                    {currentPatient.medicalHistory.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentPatient.currentMedications.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Current Medications</h4>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <ul className="text-sm text-blue-800 list-disc list-inside">
                    {currentPatient.currentMedications.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Chat */}
          {showChat && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Chat</h3>
              </div>
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'vet' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.sender === 'vet'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'vet' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vitals */}
          {showVitals && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Vital Signs</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                  <input
                    type="number"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({...vitals, temperature: e.target.value})}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
                  <input
                    type="number"
                    value={vitals.respiratoryRate}
                    onChange={(e) => setVitals({...vitals, respiratoryRate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={vitals.weight}
                    onChange={(e) => setVitals({...vitals, weight: e.target.value})}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {showNotes && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Consultation Notes</h3>
              </div>
              <div className="p-4">
                <textarea
                  rows={6}
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Enter consultation notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Consultation Summary */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Consultation Summary</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
              <textarea
                rows={3}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Prescription */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Prescription</label>
                <button
                  onClick={addPrescriptionItem}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Medication
                </button>
              </div>
              <div className="space-y-3">
                {prescription.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Medication name"
                        value={item.medication}
                        onChange={(e) => updatePrescriptionItem(item.id, 'medication', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={item.dosage}
                        onChange={(e) => updatePrescriptionItem(item.id, 'dosage', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={item.frequency}
                        onChange={(e) => updatePrescriptionItem(item.id, 'frequency', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={item.duration}
                        onChange={(e) => updatePrescriptionItem(item.id, 'duration', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Special instructions..."
                      value={item.instructions}
                      onChange={(e) => updatePrescriptionItem(item.id, 'instructions', e.target.value)}
                      className="w-full mt-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removePrescriptionItem(item.id)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
              <textarea
                rows={3}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                placeholder="Enter care recommendations..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Save as Draft
              </button>
              <button
                onClick={saveConsultation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Complete Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationRoom;