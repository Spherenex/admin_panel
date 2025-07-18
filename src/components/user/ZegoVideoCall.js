// src/components/user/ZegoVideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

const ZegoVideoCall = ({ appointmentId, userId, userName, onEndCall }) => {
  const [status, setStatus] = useState('initializing');
  const [errorDetails, setErrorDetails] = useState('');
  
  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  // Controls
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Log function for debugging
  const logEvent = (message, data) => {
    console.log(`ZegoCloud [${new Date().toISOString()}]: ${message}`, data || '');
  };

  useEffect(() => {
    // Store references
    let zg = null;
    let localStream = null;
    let remoteStream = null;
    
    // Create a unique, safe room ID
    const safeRoomId = `room_${String(appointmentId || Math.floor(Math.random() * 1000000)).replace(/[^a-zA-Z0-9]/g, '')}`;
    
    // Create a unique, safe user ID
    const safeUserId = `user_${String(userId || Math.floor(Math.random() * 1000000)).replace(/[^a-zA-Z0-9]/g, '')}`;
    
    // Create a safe user name - explicitly handle potential undefined case
    const safeUserName = userName ? String(userName).substring(0, 30) : 'User';
    
    // Log the cleaned values
    logEvent('Using cleaned values:', { safeRoomId, safeUserId, safeUserName });
    
    const init = async () => {
      try {
        logEvent('Initializing ZegoCloud...');
        
        // Step 1: Create ZegoExpressEngine instance with BOTH appID and appSign
        const appID = 1746541351; // Number type
        
        // CRITICAL FIX: Ensure appSign is a non-empty string and properly formatted
        // This needs to be a valid token string for server authentication
        const appSign = '4578d64900d15f347329b806ec101f96'; // String type
        
        if (!appSign || typeof appSign !== 'string' || appSign.length === 0) {
          throw new Error('Invalid appSign: must be a non-empty string');
        }
        
        logEvent('Creating ZegoExpressEngine with:', {
          appID: appID,
          appIDType: typeof appID,
          appSignType: typeof appSign,
          appSignLength: appSign.length
        });
        
        // The primary issue is here - we need to use a proper server authorization
        // Let's try a more simplified approach without any bells and whistles
        zg = new ZegoExpressEngine(appID, appSign);
        
        logEvent('ZegoExpressEngine created successfully');
        
        // Step 2: Setup event handlers
        zg.on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
          logEvent(`Room state update: ${state}`, { roomID, errorCode, extendedData });
          
          if (state === 'DISCONNECTED') {
            setStatus('disconnected');
            setErrorDetails(`Disconnected from room: ${errorCode}`);
          } else if (state === 'CONNECTING') {
            setStatus('connecting');
          } else if (state === 'CONNECTED') {
            setStatus('connected');
          }
        });
        
        zg.on('roomUserUpdate', async (roomID, updateType, userList) => {
          logEvent(`Room user update: ${updateType}`, { roomID, userList });
          
          if (updateType === 'ADD') {
            // When users join, check for streams
            try {
              const streamList = await zg.getStreamList(roomID);
              logEvent('Stream list', streamList);
              
              for (const stream of streamList) {
                if (stream.user?.userID !== safeUserId) {
                  logEvent(`Found remote stream: ${stream.streamID}`);
                  
                  try {
                    remoteStream = await zg.startPlayingStream(stream.streamID);
                    
                    if (remoteVideoRef.current) {
                      remoteVideoRef.current.srcObject = remoteStream;
                      setStatus('streaming');
                    }
                  } catch (streamError) {
                    logEvent('Failed to play remote stream', streamError);
                  }
                }
              }
            } catch (streamListError) {
              logEvent('Failed to get stream list', streamListError);
            }
          }
        });
        
        // Step 3: Use a temporary token for this test (not using token) for simplicity
        // This avoids the token renewal issue
        try {
          logEvent('Joining room without token', { 
            roomID: safeRoomId,
            user: { userID: safeUserId, userName: safeUserName }
          });
          
          await zg.loginRoom(
            safeRoomId, 
            { userID: safeUserId, userName: safeUserName },
            // Skip token - use a more basic approach for testing
            { userUpdate: true }
          );
          
          logEvent('Successfully joined room');
          setStatus('joined');
        } catch (roomError) {
          logEvent('Failed to join room:', roomError);
          setErrorDetails(`Room join error: ${roomError.message}`);
          setStatus('error');
          return;
        }
        
        // Step 4: Create local stream
        logEvent('Creating local stream');
        
        localStream = await zg.createStream({
          camera: {
            audio: true,
            video: true
          }
        });
        
        logEvent('Local stream created');
        
        // Set to video element
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
          
          // Ensure autoplay works
          localVideoRef.current.play().catch(playError => {
            logEvent('Failed to play local video', playError);
            // Try with muted to bypass autoplay restrictions
            localVideoRef.current.muted = true;
            localVideoRef.current.play();
          });
        }
        
        // Step 5: Publish stream
        const streamID = `stream_${safeUserId}_${Date.now()}`;
        logEvent('Publishing stream', { streamID });
        
        await zg.startPublishingStream(streamID, localStream);
        logEvent('Stream published successfully');
        
        setStatus('waiting');
      } catch (error) {
        logEvent('ZegoCloud initialization failed', error);
        setErrorDetails(error.message || 'Unknown error');
        setStatus('error');
      }
    };
    
    // Run initialization
    init();
    
    // Cleanup
    return () => {
      try {
        logEvent('Cleaning up ZegoCloud resources');
        
        if (zg) {
          if (localStream) {
            try {
              zg.stopPublishingStream();
              zg.destroyStream(localStream);
              logEvent('Local stream stopped and destroyed');
            } catch (e) {
              logEvent('Error stopping local stream', e);
            }
          }
          
          if (remoteStream) {
            try {
              zg.stopPlayingStream();
              logEvent('Remote stream stopped');
            } catch (e) {
              logEvent('Error stopping remote stream', e);
            }
          }
          
          try {
            zg.logoutRoom(safeRoomId);
            logEvent('Logged out of room');
          } catch (e) {
            logEvent('Error logging out of room', e);
          }
        }
      } catch (cleanupError) {
        logEvent('Error during cleanup', cleanupError);
      }
    };
  }, [appointmentId, userId, userName]);
  
  // Toggle microphone
  const toggleMicrophone = () => {
    // Simple implementation using MediaStream API directly
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
      if (audioTracks.length > 0) {
        const newMicState = !isMicMuted;
        audioTracks[0].enabled = !newMicState;
        setIsMicMuted(newMicState);
      }
    }
  };
  
  // Toggle camera
  const toggleCamera = () => {
    // Simple implementation using MediaStream API directly
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
      if (videoTracks.length > 0) {
        const newVideoState = !isVideoOff;
        videoTracks[0].enabled = !newVideoState;
        setIsVideoOff(newVideoState);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
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
              Status: {status}
            </span>
            <button
              onClick={onEndCall}
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
                <p className="text-gray-600 text-center">{errorDetails || 'Failed to connect to video call'}</p>
                <div className="mt-4 text-center">
                  <button 
                    onClick={onEndCall}
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
            
            {(status === 'waiting' || status === 'joined' || status === 'connected') && (
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
            onClick={onEndCall}
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

export default ZegoVideoCall;