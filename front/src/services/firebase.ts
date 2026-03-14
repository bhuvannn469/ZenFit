import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {  apiKey: "***ROTATED_AND_REMOVED***",
  authDomain: "***ROTATED_AND_REMOVED***",
  projectId: "***ROTATED_AND_REMOVED***",
  storageBucket: "***ROTATED_AND_REMOVED***",
  messagingSenderId: "***ROTATED_AND_REMOVED***",
  appId: "1:***ROTATED_AND_REMOVED***:web:***ROTATED_AND_REMOVED***",
  measurementId: "***ROTATED_AND_REMOVED***"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);    
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
