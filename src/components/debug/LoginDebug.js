// components/debug/LoginDebug.js - Temporary component for debugging
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../../firebase/config';

const LoginDebug = () => {
  const { currentUser, userRole, userData } = useAuth();
  const [debugInfo, setDebugInfo] = useState(null);
  const [testEmail, setTestEmail] = useState('');

  const checkUserInDatabase = async (uid) => {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      
      const adminRef = ref(database, `admins/${uid}`);
      const adminSnapshot = await get(adminRef);
      
      return {
        userExists: snapshot.exists(),
        userData: snapshot.exists() ? snapshot.val() : null,
        adminExists: adminSnapshot.exists(),
        adminData: adminSnapshot.exists() ? adminSnapshot.val() : null
      };
    } catch (error) {
      return { error: error.message };
    }
  };

  const runDebugCheck = async () => {
    if (!currentUser) {
      setDebugInfo({ error: 'No user logged in' });
      return;
    }

    const dbCheck = await checkUserInDatabase(currentUser.uid);
    
    setDebugInfo({
      auth: {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        emailVerified: currentUser.emailVerified
      },
      context: {
        userRole,
        userData
      },
      database: dbCheck,
      timestamp: new Date().toISOString()
    });
  };

  const testEmailCheck = () => {
    const ADMIN_EMAILS = [
      'admin@veterinary.com',
      'admin@petplatform.com',
      // Add your actual admin emails here
    ];
    
    const isAdmin = ADMIN_EMAILS.includes(testEmail.toLowerCase());
    alert(`Email "${testEmail}" is ${isAdmin ? 'an ADMIN' : 'NOT an admin'} email`);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <h3 className="text-lg font-bold mb-3">Login Debug Panel</h3>
      
      <div className="space-y-3">
        <button
          onClick={runDebugCheck}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Current User Status
        </button>
        
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Test email for admin check"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={testEmailCheck}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Test
          </button>
        </div>
        
        {debugInfo && (
          <div className="bg-gray-100 p-3 rounded text-xs max-h-60 overflow-y-auto">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
        
        <div className="text-xs text-gray-600">
          <p><strong>Quick Status:</strong></p>
          <p>Logged in: {currentUser ? '✅' : '❌'}</p>
          <p>Role detected: {userRole || 'None'}</p>
          <p>User data: {userData ? '✅' : '❌'}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginDebug;