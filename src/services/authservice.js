// services/authService.js
import { ref, get, set, remove, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase/config';

/**
 * Service for handling authentication with Firebase Realtime Database
 */
const authService = {
  /**
   * Login a user with email and password
   * @param {string} email User email
   * @param {string} password User password
   * @param {string} role User role (admin, user, supplier, veterinary)
   * @returns {Promise<Object>} User data with session ID
   */
  login: async (email, password, role) => {
    let usersRef;
    
    // Determine which collection to query based on role
    switch (role) {
      case 'admin':
        usersRef = ref(database, 'admins');
        break;
      case 'supplier':
        usersRef = ref(database, 'suppliers');
        break;
      case 'veterinary':
        usersRef = ref(database, 'veterinaries');
        break;
      default:
        usersRef = ref(database, 'users');
        break;
    }
    
    // Query users by email
    const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
    const snapshot = await get(userQuery);
    
    if (!snapshot.exists()) {
      throw new Error('Account not found');
    }
    
    // Get user data
    const userData = Object.values(snapshot.val())[0];
    const userId = Object.keys(snapshot.val())[0];
    
    // Check password
    if (userData.password !== password) {
      throw new Error('Invalid password');
    }
    
    // For supplier and veterinary accounts, check approval status
    if ((role === 'supplier' || role === 'veterinary') && userData.status !== 'approved') {
      throw new Error('Your account is pending approval. Please contact the administrator.');
    }
    
    // Update last login
    await set(ref(database, `${role === 'admin' ? 'admins' : role === 'supplier' ? 'suppliers' : role === 'veterinary' ? 'veterinaries' : 'users'}/${userId}/lastLogin`), new Date().toISOString());
    
    // Create session
    const sessionId = await authService.createSession({
      ...userData,
      uid: userId,
      role
    });
    
    return {
      ...userData,
      uid: userId,
      sessionId
    };
  },
  
  /**
   * Create a new session for the user
   * @param {Object} userData User data
   * @returns {Promise<string>} Session ID
   */
  createSession: async (userData) => {
    // Generate session ID
    const sessionId = `session_${Date.now()}`;
    
    // Create session data
    const sessionData = {
      ...userData,
      sessionId,
      lastActivity: new Date().toISOString(),
      active: true
    };
    
    // Store session in database
    await set(ref(database, `sessions/${sessionId}`), sessionData);
    
    // Store session ID in localStorage for reference
    localStorage.setItem('sessionId', sessionId);
    
    return sessionId;
  },
  
  /**
   * Check if user is authenticated
   * @returns {Promise<Object|null>} User data if authenticated, null otherwise
   */
  checkAuth: async () => {
    // Get session ID from localStorage
    const sessionId = localStorage.getItem('sessionId');
    
    if (!sessionId) {
      return null;
    }
    
    // Get session data from Firebase
    const sessionRef = ref(database, `sessions/${sessionId}`);
    const snapshot = await get(sessionRef);
    
    if (snapshot.exists()) {
      const sessionData = snapshot.val();
      
      if (sessionData.active) {
        // Update last activity
        await set(ref(database, `sessions/${sessionId}/lastActivity`), new Date().toISOString());
        
        return sessionData;
      }
    }
    
    // Session not found or not active
    localStorage.removeItem('sessionId');
    return null;
  },
  
  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  logout: async () => {
    const sessionId = localStorage.getItem('sessionId');
    
    if (sessionId) {
      try {
        // Mark session as inactive in database
        await set(ref(database, `sessions/${sessionId}/active`), false);
      } catch (error) {
        console.error("Error logging out:", error);
      }
      
      // Remove session from localStorage
      localStorage.removeItem('sessionId');
    }
  }
};

export default authService;