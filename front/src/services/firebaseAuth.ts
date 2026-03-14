import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const authService = {
  // Register with email and password
  register: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw error;
    }
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw error;
    }
  },

  // Login with Google
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
      return true;
    } catch (error: any) {
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: any) {
      throw error;
    }
  }
};
