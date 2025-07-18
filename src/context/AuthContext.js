


// // context/AuthContext.js
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
// import { database } from '../firebase/config';
// import { useNavigate } from 'react-router-dom';

// // Create context
// const AuthContext = createContext();

// // List of admin emails - Add your admin emails here
// const ADMIN_EMAILS = [
//   'admin@platform.com',
//   'admin@veterinary.com',
//   'admin@petplatform.com',
//   // Add more admin emails as needed
// ];

// // Create provider component
// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Function to check if email is admin
//   const isAdminEmail = (email) => {
//     return ADMIN_EMAILS.includes(email.toLowerCase());
//   };

//   // Enhanced register function for different user types
//   const register = async (email, password, userData, role = 'user') => {
//     try {
//       setError(null);
//       setLoading(true);
      
//       // Check if trying to register with admin email
//       if (isAdminEmail(email)) {
//         throw new Error('Admin accounts cannot be registered through this form. Please contact the system administrator.');
//       }
      
//       // Check if email already exists in any collection
//       const collections = ['users', 'supplier', 'veterinary', 'admins'];
      
//       for (const collection of collections) {
//         const collectionRef = ref(database, collection);
//         const emailQuery = query(collectionRef, orderByChild('email'), equalTo(email));
//         const snapshot = await get(emailQuery);
        
//         if (snapshot.exists()) {
//           throw new Error('Email already in use. Please use a different email.');
//         }
//       }
      
//       // Generate user ID
//       const userId = `${role}_${Date.now()}`;
      
//       // Set approval status based on role
//       const status = (role === 'supplier' || role === 'veterinary') ? 'pending' : 'approved';
      
//       // Store user data in Realtime Database
//       const userDataToStore = {
//         uid: userId,
//         name: userData.name,
//         email: email,
//         password: password,
//         role: role,
//         phone: userData.phone || '',
//         address: userData.address || '',
//         specialization: userData.specialization || '',
//         experience: userData.experience || '',
//         createdAt: new Date().toISOString(),
//         lastLogin: new Date().toISOString(),
//         status: status,
//         isActive: true
//       };
      
//       // Save to users collection
//       await set(ref(database, `users/${userId}`), userDataToStore);
      
//       // Store role-specific data
//       if (role === 'supplier') {
//         await set(ref(database, `supplier/${userId}`), {
//           ...userDataToStore,
//           businessName: userData.businessName || '',
//           businessType: userData.businessType || '',
//           approvedBy: null,
//           approvedAt: null
//         });
//       } else if (role === 'veterinary') {
//         await set(ref(database, `veterinary/${userId}`), {
//           ...userDataToStore,
//           qualification: userData.qualification || '',
//           license: userData.license || '',
//           approvedBy: null,
//           approvedAt: null
//         });
//       }
      
//       // If user is approved, create a session
//       if (status === 'approved') {
//         // Create a session
//         const sessionId = `session_${Date.now()}`;
//         const sessionData = {
//           ...userDataToStore,
//           sessionId,
//           lastActivity: new Date().toISOString(),
//           active: true
//         };
        
//         await set(ref(database, `sessions/${sessionId}`), sessionData);
//         localStorage.setItem('sessionId', sessionId);
        
//         setCurrentUser(userDataToStore);
//         setUserRole(role);
//         setUserData(userDataToStore);
//       }
      
//       return { success: true, user: userDataToStore, role, status };
//     } catch (error) {
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login function - Updated to handle different collection paths and special Firebase entries
//   const login = async (email, password) => {
//     try {
//       setError(null);
//       setLoading(true);
      
//       console.log(`Login attempt with email: ${email}`);
      
//       // Admin login
//       if (isAdminEmail(email)) {
//         console.log("Admin login attempt detected");
//         if (email === 'admin@platform.com' && password === 'admin123') {
//           // Create admin data
//           const adminId = `admin_${Date.now()}`;
//           const adminData = {
//             uid: adminId,
//             email,
//             password,
//             role: 'admin',
//             name: 'Administrator',
//             lastLogin: new Date().toISOString(),
//             isActive: true
//           };
          
//           // Store admin in database if it doesn't exist
//           const adminsRef = ref(database, 'admins');
//           const adminQuery = query(adminsRef, orderByChild('email'), equalTo(email));
//           const snapshot = await get(adminQuery);
          
//           if (!snapshot.exists()) {
//             await set(ref(database, `admins/${adminId}`), adminData);
//           }
          
//           // Create session
//           const sessionId = `session_${Date.now()}`;
//           const sessionData = {
//             ...adminData,
//             sessionId,
//             lastActivity: new Date().toISOString(),
//             active: true
//           };
          
//           await set(ref(database, `sessions/${sessionId}`), sessionData);
//           localStorage.setItem('sessionId', sessionId);
          
//           console.log("Admin login successful, setting state:", adminData);
//           setCurrentUser(adminData);
//           setUserRole('admin');
//           setUserData(adminData);
          
//           return { success: true, user: adminData, role: 'admin' };
//         } else {
//           throw new Error('Invalid admin credentials');
//         }
//       }
      
//       // Try to find user in collections
//       const collections = ['users', 'supplier', 'veterinary'];
//       let user = null;
//       let collection = '';
      
//       // First try normal user collection lookup
//       for (const coll of collections) {
//         console.log(`Searching in collection: ${coll}`);
//         const collRef = ref(database, coll);
//         const userQuery = query(collRef, orderByChild('email'), equalTo(email));
//         const snapshot = await get(userQuery);
        
//         if (snapshot.exists()) {
//           user = Object.values(snapshot.val())[0];
//           user.uid = Object.keys(snapshot.val())[0];
//           collection = coll;
//           console.log(`User found in ${coll} collection:`, user);
//           break;
//         }
//       }
      
//       // If not found in normal collections, check Firebase user entries from AddVeterinarian
//       if (!user) {
//         console.log("User not found in standard collections, checking specific paths");
//         // Check specific paths for entries created by Firebase Auth
//         const veterinaryRef = ref(database, 'veterinary');
//         const snapshot = await get(veterinaryRef);
        
//         if (snapshot.exists()) {
//           const veterinaryData = snapshot.val();
          
//           // Look through all entries
//           for (const key in veterinaryData) {
//             if (veterinaryData[key].email === email) {
//               user = veterinaryData[key];
//               user.uid = key;
//               collection = 'veterinary';
              
//               // Add role explicitly if not present
//               if (!user.role) {
//                 user.role = 'veterinary';
//               }
              
//               console.log("Found veterinary user in direct path:", user);
//               break;
//             }
//           }
//         }
//       }
      
//       if (!user) {
//         console.log("No user found with email:", email);
//         throw new Error('No account found with this email. Please check your email or register.');
//       }
      
//       // Check password
//       if (user.password && user.password !== password) {
//         console.log("Password mismatch");
//         throw new Error('Invalid password. Please try again.');
//       }
      
//       // Check if account is active
//       if (user.isActive === false) {
//         console.log("Account is deactivated");
//         throw new Error('Your account has been deactivated. Please contact the administrator.');
//       }
      
//       // Check approval status for supplier and veterinary
//       if ((user.role === 'supplier' || user.role === 'veterinary') && user.status === 'pending') {
//         // Auto-approve for testing purposes
//         user.status = 'approved';
//         await set(ref(database, `${collection}/${user.uid}/status`), 'approved');
        
//         // Add notification or log the auto-approval
//         console.log(`Auto-approved ${user.role} account for testing:`, user.email);
//       }
      
//       // Update last login
//       await set(ref(database, `${collection}/${user.uid}/lastLogin`), new Date().toISOString());
      
//       // Create session
//       const sessionId = `session_${Date.now()}`;
//       const sessionData = {
//         ...user,
//         sessionId,
//         lastActivity: new Date().toISOString(),
//         active: true
//       };
      
//       await set(ref(database, `sessions/${sessionId}`), sessionData);
//       localStorage.setItem('sessionId', sessionId);
      
//       // Store user data in sessionStorage for VeterinaryDashboard
//       sessionStorage.setItem('userData', JSON.stringify(user));
//       sessionStorage.setItem('userEmail', user.email);
      
//       console.log("Login successful, setting state:", user);
//       setCurrentUser(user);
//       setUserRole(user.role);
//       setUserData(user);
      
//       return { success: true, user, role: user.role };
//     } catch (error) {
//       console.error("Login error:", error.message);
//       setError(error.message);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout function
//   // Modified logout function for AuthContext.js
// // Replace the existing logout function in your AuthContext.js with this version:

// const logout = async () => {
//   try {
//     setError(null);
    
//     // Get session ID
//     const sessionId = localStorage.getItem('sessionId');
    
//     if (sessionId) {
//       // Mark session as inactive
//       await set(ref(database, `sessions/${sessionId}/active`), false);
//     }
    
//     // Clear localStorage and sessionStorage
//     localStorage.removeItem('sessionId');
//     localStorage.clear();
//     sessionStorage.clear();
    
//     // Reset state
//     setCurrentUser(null);
//     setUserRole(null);
//     setUserData(null);
    
//     // This ensures the function completes successfully before redirection
//     const result = { success: true };
    
//     // Redirect to home page after a short delay to ensure state is cleared
//     setTimeout(() => {
//       window.location.replace('/');
//     }, 100);
    
//     return result;
//   } catch (error) {
//     setError(error.message);
//     throw error;
//   }
// };

//   // Check if user is logged in based on session ID
//   useEffect(() => {
//     const checkLoggedInUser = async () => {
//       try {
//         const sessionId = localStorage.getItem('sessionId');
        
//         if (!sessionId) {
//           setLoading(false);
//           return;
//         }
        
//         // Get session from Firebase
//         const sessionRef = ref(database, `sessions/${sessionId}`);
//         const snapshot = await get(sessionRef);
        
//         if (snapshot.exists()) {
//           const session = snapshot.val();
          
//           // Check if session is active
//           if (session.active) {
//             // Session is valid, set user data
//             console.log("Found active session, restoring user state:", session);
//             setCurrentUser(session);
//             setUserRole(session.role);
//             setUserData(session);
            
//             // Store in sessionStorage for components that use it
//             sessionStorage.setItem('userData', JSON.stringify(session));
//             sessionStorage.setItem('userEmail', session.email);
            
//             // Update last activity
//             await set(ref(database, `sessions/${sessionId}/lastActivity`), new Date().toISOString());
//           } else {
//             // Session is inactive, clear localStorage
//             console.log("Session is inactive, clearing storage");
//             localStorage.removeItem('sessionId');
//             sessionStorage.clear();
//           }
//         } else {
//           // Session not found, clear localStorage
//           console.log("Session not found, clearing storage");
//           localStorage.removeItem('sessionId');
//           sessionStorage.clear();
//         }
//       } catch (error) {
//         console.error("Error checking logged in user:", error);
//         localStorage.removeItem('sessionId');
//         sessionStorage.clear();
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     checkLoggedInUser();
//   }, []);

//   // Redirect based on role using useCallback to avoid recreating function
//   const redirectBasedOnRole = useCallback((role) => {
//     // Make sure role is lowercase for consistency
//     const normalizedRole = role ? role.toLowerCase() : '';
//     console.log('Redirecting based on role:', normalizedRole);
    
//     // Get redirection path based on role
//     let redirectPath = '/';
    
//     switch (normalizedRole) {
//       case 'admin':
//         redirectPath = '/admin/AdminDashboard';
//         break;
//       case 'supplier':
//         redirectPath = '/supplier/supplierDashboard';
//         break;
//       case 'veterinary':
//         redirectPath = '/veterinary/vetDashboard';
//         break;
//       case 'user':
//         redirectPath = '/dashboard';
//         break;
//       default:
//         redirectPath = '/';
//     }
    
//     // Navigate to the appropriate dashboard
//     console.log(`Redirecting to: ${redirectPath}`);
//     window.location.href = redirectPath;
//   }, []);

//   // Helper functions
//   const hasRole = (role) => {
//     return userRole === role;
//   };

//   const isAdmin = () => {
//     return userRole === 'admin';
//   };

//   const isSupplier = () => {
//     return userRole === 'supplier';
//   };

//   const isVeterinary = () => {
//     return userRole === 'veterinary';
//   };

//   const isUser = () => {
//     return userRole === 'user';
//   };

//   const value = {
//     currentUser,
//     userRole,
//     userData,
//     loading,
//     error,
//     register,
//     login,
//     logout,
//     hasRole,
//     isAdmin,
//     isSupplier,
//     isVeterinary,
//     isUser,
//     isAdminEmail,
//     redirectBasedOnRole
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// // Custom hook for using auth
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// export default AuthProvider;





// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

// List of admin emails - Add your admin emails here
const ADMIN_EMAILS = [
  'admin@platform.com',
  'admin@veterinary.com',
  'admin@petplatform.com',
  // Add more admin emails as needed
];

// Create provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to check if email is admin
  const isAdminEmail = (email) => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  // Enhanced register function for different user types
  const register = async (email, password, userData, role = 'user') => {
    try {
      setError(null);
      setLoading(true);
      
      // Check if trying to register with admin email
      if (isAdminEmail(email)) {
        throw new Error('Admin accounts cannot be registered through this form. Please contact the system administrator.');
      }
      
      // Check if email already exists in any collection
      const collections = ['users', 'supplier', 'veterinary', 'admins'];
      
      for (const collection of collections) {
        const collectionRef = ref(database, collection);
        const emailQuery = query(collectionRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(emailQuery);
        
        if (snapshot.exists()) {
          throw new Error('Email already in use. Please use a different email.');
        }
      }
      
      // Generate user ID
      const userId = `${role}_${Date.now()}`;
      
      // Set approval status based on role
      const status = (role === 'supplier' || role === 'veterinary') ? 'pending' : 'approved';
      
      // Store user data in Realtime Database
      const userDataToStore = {
        uid: userId,
        name: userData.name,
        email: email,
        password: password,
        role: role,
        phone: userData.phone || '',
        address: userData.address || '',
        specialization: userData.specialization || '',
        experience: userData.experience || '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: status,
        isActive: true
      };
      
      // Save to users collection
      await set(ref(database, `users/${userId}`), userDataToStore);
      
      // Store role-specific data
      if (role === 'supplier') {
        await set(ref(database, `supplier/${userId}`), {
          ...userDataToStore,
          businessName: userData.businessName || '',
          businessType: userData.businessType || '',
          approvedBy: null,
          approvedAt: null
        });
      } else if (role === 'veterinary') {
        await set(ref(database, `veterinary/${userId}`), {
          ...userDataToStore,
          qualification: userData.qualification || '',
          license: userData.license || '',
          approvedBy: null,
          approvedAt: null
        });
      }
      
      // If user is approved, create a session
      if (status === 'approved') {
        // Create a session
        const sessionId = `session_${Date.now()}`;
        const sessionData = {
          ...userDataToStore,
          sessionId,
          lastActivity: new Date().toISOString(),
          active: true
        };
        
        await set(ref(database, `sessions/${sessionId}`), sessionData);
        localStorage.setItem('sessionId', sessionId);
        
        setCurrentUser(userDataToStore);
        setUserRole(role);
        setUserData(userDataToStore);
      }
      
      return { success: true, user: userDataToStore, role, status };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login function - Updated to handle different collection paths and special Firebase entries
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log(`Login attempt with email: ${email}`);
      
      // Admin login
      if (isAdminEmail(email)) {
        console.log("Admin login attempt detected");
        if (email === 'admin@platform.com' && password === 'admin123') {
          // Create admin data
          const adminId = `admin_${Date.now()}`;
          const adminData = {
            uid: adminId,
            email,
            password,
            role: 'admin',
            name: 'Administrator',
            lastLogin: new Date().toISOString(),
            isActive: true
          };
          
          // Store admin in database if it doesn't exist
          const adminsRef = ref(database, 'admins');
          const adminQuery = query(adminsRef, orderByChild('email'), equalTo(email));
          const snapshot = await get(adminQuery);
          
          if (!snapshot.exists()) {
            await set(ref(database, `admins/${adminId}`), adminData);
          }
          
          // Create session
          const sessionId = `session_${Date.now()}`;
          const sessionData = {
            ...adminData,
            sessionId,
            lastActivity: new Date().toISOString(),
            active: true
          };
          
          await set(ref(database, `sessions/${sessionId}`), sessionData);
          localStorage.setItem('sessionId', sessionId);
          
          console.log("Admin login successful, setting state:", adminData);
          setCurrentUser(adminData);
          setUserRole('admin');
          setUserData(adminData);
          
          return { success: true, user: adminData, role: 'admin' };
        } else {
          throw new Error('Invalid admin credentials');
        }
      }
      
      // Try to find user in collections
      const collections = ['users', 'supplier', 'veterinary'];
      let user = null;
      let collection = '';
      
      // First try normal user collection lookup
      for (const coll of collections) {
        console.log(`Searching in collection: ${coll}`);
        const collRef = ref(database, coll);
        const userQuery = query(collRef, orderByChild('email'), equalTo(email));
        const snapshot = await get(userQuery);
        
        if (snapshot.exists()) {
          user = Object.values(snapshot.val())[0];
          user.uid = Object.keys(snapshot.val())[0];
          collection = coll;
          console.log(`User found in ${coll} collection:`, user);
          break;
        }
      }
      
      // If not found in normal collections, check Firebase user entries from AddVeterinarian
      if (!user) {
        console.log("User not found in standard collections, checking specific paths");
        // Check specific paths for entries created by Firebase Auth
        const veterinaryRef = ref(database, 'veterinary');
        const snapshot = await get(veterinaryRef);
        
        if (snapshot.exists()) {
          const veterinaryData = snapshot.val();
          
          // Look through all entries
          for (const key in veterinaryData) {
            if (veterinaryData[key].email === email) {
              user = veterinaryData[key];
              user.uid = key;
              collection = 'veterinary';
              
              // Add role explicitly if not present
              if (!user.role) {
                user.role = 'veterinary';
              }
              
              console.log("Found veterinary user in direct path:", user);
              break;
            }
          }
        }
      }
      
      if (!user) {
        console.log("No user found with email:", email);
        throw new Error('No account found with this email. Please check your email or register.');
      }
      
      // Check password
      if (user.password && user.password !== password) {
        console.log("Password mismatch");
        throw new Error('Invalid password. Please try again.');
      }
      
      // Check if account is active
      if (user.isActive === false) {
        console.log("Account is deactivated");
        throw new Error('Your account has been deactivated. Please contact the administrator.');
      }
      
      // Check approval status for supplier and veterinary
      if ((user.role === 'supplier' || user.role === 'veterinary') && user.status === 'pending') {
        // Auto-approve for testing purposes
        user.status = 'approved';
        await set(ref(database, `${collection}/${user.uid}/status`), 'approved');
        
        // Add notification or log the auto-approval
        console.log(`Auto-approved ${user.role} account for testing:`, user.email);
      }
      
      // Update last login
      await set(ref(database, `${collection}/${user.uid}/lastLogin`), new Date().toISOString());
      
      // Create session
      const sessionId = `session_${Date.now()}`;
      const sessionData = {
        ...user,
        sessionId,
        lastActivity: new Date().toISOString(),
        active: true
      };
      
      await set(ref(database, `sessions/${sessionId}`), sessionData);
      localStorage.setItem('sessionId', sessionId);
      
      // Store user data in sessionStorage for VeterinaryDashboard
      sessionStorage.setItem('userData', JSON.stringify(user));
      sessionStorage.setItem('userEmail', user.email);
      
      console.log("Login successful, setting state:", user);
      setCurrentUser(user);
      setUserRole(user.role);
      setUserData(user);
      
      return { success: true, user, role: user.role };
    } catch (error) {
      console.error("Login error:", error.message);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Improved logout function with proper cleanup and logging
  const logout = async () => {
    try {
      setError(null);
      
      console.log("AuthContext: Logout process started");
      
      // Set a logout flag to prevent automatic redirects during logout
      sessionStorage.setItem('loggingOut', 'true');
      
      // Get session ID
      const sessionId = localStorage.getItem('sessionId');
      
      if (sessionId) {
        // Mark session as inactive in Firebase
        console.log("AuthContext: Marking session inactive in Firebase");
        await set(ref(database, `sessions/${sessionId}/active`), false);
      }
      
      // Clear localStorage and sessionStorage
      console.log("AuthContext: Clearing storage");
      localStorage.removeItem('sessionId');
      localStorage.clear();
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('userEmail');
      // Don't clear loggingOut flag yet
      
      // Reset state
      console.log("AuthContext: Resetting state");
      setCurrentUser(null);
      setUserRole(null);
      setUserData(null);
      
      console.log("AuthContext: Logout process completed");
      
      // Return success - the component will handle navigation
      return { success: true };
    } catch (error) {
      console.error("AuthContext: Logout error:", error);
      setError(error.message);
      // Clear the logging out flag if there's an error
      sessionStorage.removeItem('loggingOut');
      throw error;
    }
  };

  // UPDATED: Check if user is logged in based on session ID
  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        // Check if logout is in progress - if so, don't restore session
        if (sessionStorage.getItem('loggingOut') === 'true') {
          console.log("Logout in progress, skipping session restore");
          // Don't remove the flag here - it should be removed after navigation completes
          setLoading(false);
          return;
        }
        
        const sessionId = localStorage.getItem('sessionId');
        
        if (!sessionId) {
          setLoading(false);
          return;
        }
        
        // Get session from Firebase
        const sessionRef = ref(database, `sessions/${sessionId}`);
        const snapshot = await get(sessionRef);
        
        if (snapshot.exists()) {
          const session = snapshot.val();
          
          // Check if session is active
          if (session.active) {
            // Session is valid, set user data
            console.log("Found active session, restoring user state:", session);
            setCurrentUser(session);
            setUserRole(session.role);
            setUserData(session);
            
            // Store in sessionStorage for components that use it
            sessionStorage.setItem('userData', JSON.stringify(session));
            sessionStorage.setItem('userEmail', session.email);
            
            // Update last activity
            await set(ref(database, `sessions/${sessionId}/lastActivity`), new Date().toISOString());
          } else {
            // Session is inactive, clear localStorage
            console.log("Session is inactive, clearing storage");
            localStorage.removeItem('sessionId');
            sessionStorage.clear();
          }
        } else {
          // Session not found, clear localStorage
          console.log("Session not found, clearing storage");
          localStorage.removeItem('sessionId');
          sessionStorage.clear();
        }
      } catch (error) {
        console.error("Error checking logged in user:", error);
        localStorage.removeItem('sessionId');
        sessionStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedInUser();
  }, []);

  // UPDATED: Redirect based on role using useCallback to avoid recreating function
  const redirectBasedOnRole = useCallback((role) => {
    // Skip redirect if logging out
    if (sessionStorage.getItem('loggingOut') === 'true') {
      console.log('Logout in progress, skipping role-based redirect');
      return;
    }
    
    // Make sure role is lowercase for consistency
    const normalizedRole = role ? role.toLowerCase() : '';
    console.log('Redirecting based on role:', normalizedRole);
    
    // Get redirection path based on role
    let redirectPath = '/';
    
    switch (normalizedRole) {
      case 'admin':
        redirectPath = '/admin/AdminDashboard';
        break;
      case 'supplier':
        redirectPath = '/supplier/supplierDashboard';
        break;
      case 'veterinary':
        redirectPath = '/veterinary/vetDashboard';
        break;
      case 'user':
        redirectPath = '/dashboard';
        break;
      default:
        redirectPath = '/';
    }
    
    // Navigate to the appropriate dashboard
    console.log(`Redirecting to: ${redirectPath}`);
    window.location.href = redirectPath;
  }, []);

  // Helper functions
  const hasRole = (role) => {
    return userRole === role;
  };

  const isAdmin = () => {
    return userRole === 'admin';
  };

  const isSupplier = () => {
    return userRole === 'supplier';
  };

  const isVeterinary = () => {
    return userRole === 'veterinary';
  };

  const isUser = () => {
    return userRole === 'user';
  };

  const value = {
    currentUser,
    userRole,
    userData,
    loading,
    error,
    register,
    login,
    logout,
    hasRole,
    isAdmin,
    isSupplier,
    isVeterinary,
    isUser,
    isAdminEmail,
    redirectBasedOnRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;