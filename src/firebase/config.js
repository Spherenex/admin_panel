

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


// Your Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyA9nu_vtGgDos64AarR88Z7CfTWksHN_3I",
  authDomain: "cyber-security-89312.firebaseapp.com",
  databaseURL: "https://cyber-security-89312-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cyber-security-89312",
  storageBucket: "cyber-security-89312.firebasestorage.app",
  messagingSenderId: "556823345671",
  appId: "1:556823345671:web:de3bd455f1bcf56e3748a2",
  measurementId: "G-SD5H9V3163"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;