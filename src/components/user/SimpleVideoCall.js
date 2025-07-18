// src/components/user/SimpleVideoCall.js
import React, { useEffect, useRef, useState } from 'react';

// Configuration for ICE servers (STUN/TURN)
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
    // Add TURN servers for production environment
  ]
};

const SimpleVideoCall = ({ appointmentId, userId, userName, onEndCall }) => {
  // State
  const [status, setStatus] = useState('initializing');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  
  // Constants
  const roomId = `room_${appointmentId || Math.floor(Math.random() * 100000)}`;
  const signalServerUrl = 'ws://localhost:3001'; // Replace with your signaling server
  const socketRef = useRef(null);

  // Logging helper
  const logEvent = (message, data) => {
    console.log(`WebRTC [${new Date().toISOString()}]:`, message, data || '');
  };

  // Setup WebRTC connection
  useEffect(() => {
    // Function to set up local media
    const setupLocalMedia = async () => {
      try {
        logEvent('Requesting local media access');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        setStatus('media_acquired');
        return stream;
      } catch (error) {
        logEvent('Error accessing local media:', error);
        setErrorMessage(`Media access error: ${error.message || 'Could not access camera/microphone'}`);
        setStatus('error');
        throw error;
      }
    };
    
    // Function to create a new peer connection
    const createPeerConnection = () => {
      try {
        logEvent('Creating RTCPeerConnection');
        const peerConnection = new RTCPeerConnection(ICE_SERVERS);
        
        // Add local tracks to the connection
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStreamRef.current);
            logEvent(`Added local track: ${track.kind}`);
          });
        }
        
        // Set up ICE candidate handling
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            logEvent('New ICE candidate', event.candidate);
            
            // Send the ICE candidate to the remote peer via signaling
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
              socketRef.current.send(JSON.stringify({
                type: 'ice-candidate',
                candidate: event.candidate,
                roomId,
                userId
              }));
            }
          }
        };
        
        // Handle ICE connection state changes
        peerConnection.oniceconnectionstatechange = () => {
          logEvent('ICE connection state changed:', peerConnection.iceConnectionState);
          
          if (peerConnection.iceConnectionState === 'connected' || 
              peerConnection.iceConnectionState === 'completed') {
            setIsConnectionEstablished(true);
            setStatus('connected');
          } else if (peerConnection.iceConnectionState === 'failed' || 
                     peerConnection.iceConnectionState === 'disconnected') {
            setStatus('connection_lost');
          }
        };
        
        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
          logEvent('Connection state changed:', peerConnection.connectionState);
        };
        
        // Handle remote tracks
        peerConnection.ontrack = (event) => {
          logEvent('Remote track received', event.track);
          
          if (remoteVideoRef.current && event.streams && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setStatus('streaming');
          }
        };
        
        // Create a data channel for signaling
        const dataChannel = peerConnection.createDataChannel('chat');
        
        dataChannel.onopen = () => {
          logEvent('Data channel opened');
        };
        
        dataChannel.onmessage = (event) => {
          logEvent('Data channel message received', event.data);
          // Handle messages as needed
        };
        
        dataChannelRef.current = dataChannel;
        return peerConnection;
      } catch (error) {
        logEvent('Error creating peer connection:', error);
        setErrorMessage(`WebRTC error: ${error.message || 'Failed to create connection'}`);
        setStatus('error');
        throw error;
      }
    };
    
    // Function to connect to signaling server
    const connectToSignalingServer = () => {
      try {
        logEvent('Connecting to signaling server:', signalServerUrl);
        const socket = new WebSocket(signalServerUrl);
        
        socket.onopen = () => {
          logEvent('Connected to signaling server');
          
          // Join the room
          socket.send(JSON.stringify({
            type: 'join',
            roomId,
            userId,
            userName: userName || 'User'
          }));
          
          setStatus('signaling_connected');
        };
        
        socket.onclose = (event) => {
          logEvent('Disconnected from signaling server', event);
          
          if (status !== 'connected' && status !== 'streaming') {
            setErrorMessage('Signaling server connection closed');
            setStatus('error');
          }
        };
        
        socket.onerror = (error) => {
          logEvent('Signaling server error:', error);
          setErrorMessage('Signaling server error');
          setStatus('error');
        };
        
        socket.onmessage = async (event) => {
          try {
            const message = JSON.parse(event.data);
            logEvent('Signaling message received', message);
            
            switch (message.type) {
              case 'user-joined':
                // Another user joined the room, create an offer
                if (message.userId !== userId) {
                  logEvent('Remote user joined:', message.userName);
                  
                  // Create the offer
                  const offer = await peerConnectionRef.current.createOffer();
                  await peerConnectionRef.current.setLocalDescription(offer);
                  
                  // Send the offer to the remote peer
                  socket.send(JSON.stringify({
                    type: 'offer',
                    offer: peerConnectionRef.current.localDescription,
                    roomId,
                    userId,
                    targetUserId: message.userId
                  }));
                }
                break;
                
              case 'offer':
                // Received an offer from the remote peer
                if (message.targetUserId === userId) {
                  logEvent('Received offer from:', message.userId);
                  
                  // Set the remote description
                  await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.offer));
                  
                  // Create an answer
                  const answer = await peerConnectionRef.current.createAnswer();
                  await peerConnectionRef.current.setLocalDescription(answer);
                  
                  // Send the answer to the remote peer
                  socket.send(JSON.stringify({
                    type: 'answer',
                    answer: peerConnectionRef.current.localDescription,
                    roomId,
                    userId,
                    targetUserId: message.userId
                  }));
                }
                break;
                
              case 'answer':
                // Received an answer from the remote peer
                if (message.targetUserId === userId) {
                  logEvent('Received answer from:', message.userId);
                  
                  // Set the remote description
                  await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
                }
                break;
                
              case 'ice-candidate':
                // Received an ICE candidate from the remote peer
                if (message.targetUserId === userId) {
                  logEvent('Received ICE candidate from:', message.userId);
                  
                  // Add the ICE candidate
                  await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
                }
                break;
                
              case 'user-left':
                // Another user left the room
                if (message.userId !== userId) {
                  logEvent('Remote user left:', message.userName);
                  
                  // Handle peer disconnection if needed
                  if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                  }
                  
                  setStatus('waiting');
                }
                break;
                
              default:
                logEvent('Unknown message type:', message.type);
            }
          } catch (error) {
            logEvent('Error handling signaling message:', error);
          }
        };
        
        return socket;
      } catch (error) {
        logEvent('Error connecting to signaling server:', error);
        setErrorMessage(`Signaling error: ${error.message || 'Could not connect to signaling server'}`);
        setStatus('error');
        throw error;
      }
    };
    
    // Main initialization function
    const initialize = async () => {
      try {
        logEvent('Initializing WebRTC connection');
        
        // Set up local media
        await setupLocalMedia();
        
        // Create peer connection
        const peerConnection = createPeerConnection();
        peerConnectionRef.current = peerConnection;
        
        // Connect to signaling server
        const socket = connectToSignalingServer();
        socketRef.current = socket;
        
        setStatus('waiting');
      } catch (error) {
        logEvent('Initialization error:', error);
        setErrorMessage(`Setup error: ${error.message || 'Failed to initialize video call'}`);
        setStatus('error');
      }
    };
    
    // Start initialization
    initialize();
    
    // Cleanup function
    return () => {
      logEvent('Cleaning up WebRTC resources');
      
      // Close the signaling connection
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      // Close the peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      
      // Stop local media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [appointmentId, userId, userName, roomId]);
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      
      if (audioTracks.length > 0) {
        const newState = !isMicMuted;
        audioTracks[0].enabled = !newState;
        setIsMicMuted(newState);
      }
    }
  };
  
  // Toggle camera
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      
      if (videoTracks.length > 0) {
        const newState = !isVideoOff;
        videoTracks[0].enabled = !newState;
        setIsVideoOff(newState);
      }
    }
  };
  
  // Handle call end
  const handleEndCall = () => {
    // Send a message to the signaling server
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'leave',
        roomId,
        userId,
        userName: userName || 'User'
      }));
    }
    
    // Call the parent's callback
    onEndCall();
  };
  
  return (
    <div className="fixed  bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="font-semibold">Video Consultation</h3>
          </div>
          <div className="flex items-center">
            <span className="mr-3 text-sm px-2 py-1 bg-blue-700 rounded">
              Status: {status.replace(/_/g, ' ')}
            </span>
            <button
              onClick={handleEndCall}
              className="p-1 hover:bg-blue-700 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video area */}
        <div className="flex-1 bg-gray-900 p-4 relative">
          {/* Error message */}
          {status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-90 z-10">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                <div className="text-red-600 mb-4 text-center">
                  <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Connection Error</h3>
                <p className="text-gray-600 text-center">{errorMessage || 'Failed to connect to video call'}</p>
                <div className="mt-4 text-center">
                  <button 
                    onClick={handleEndCall}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Main video (remote) */}
          <div className="w-full h-full rounded-lg overflow-hidden bg-black">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {(status === 'waiting' || status === 'signaling_connected') && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl">Waiting for other participant to join...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* PiP (local) */}
          <div className="absolute bottom-6 right-6 w-1/4 h-1/4 rounded-lg overflow-hidden border-2 border-white shadow-lg bg-black">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-800 flex justify-center space-x-4">
          <button 
            onClick={toggleMicrophone} 
            className={`p-3 ${isMicMuted ? 'bg-red-600' : 'bg-gray-700'} rounded-full hover:bg-gray-600`}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            onClick={toggleCamera}
            className={`p-3 ${isVideoOff ? 'bg-red-600' : 'bg-gray-700'} rounded-full hover:bg-gray-600`}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button 
            onClick={handleEndCall}
            className="p-3 bg-red-600 rounded-full hover:bg-red-700"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleVideoCall;