import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./firebase";
import { User, LoginCredentials, SignupCredentials } from "../types/auth";

const mapFirebaseUser = (user: FirebaseUser | null): User | null => {
  if (!user) return null;
  return {
    id: user.uid,
    email: user.email || undefined,
    name: user.displayName || undefined,
    user_metadata: {
      name: user.displayName || undefined,
      full_name: user.displayName || undefined,
    }
  };
};

export const firebaseAuth = {
  signIn: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      return mapFirebaseUser(user)!;
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password sign-in is not enabled in the Firebase Console. Please enable it in Authentication > Sign-in method.');
      }
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      throw error;
    }
  },

  signUp: async (credentials: SignupCredentials): Promise<User> => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      await updateProfile(user, {
        displayName: credentials.name
      });

      return mapFirebaseUser(user)!;
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Registration is currently disabled. Please enable the "Email/Password" provider in your Firebase Console.');
      }
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please use at least 6 characters.');
      }
      throw error;
    }
  },

  signOut: async (): Promise<void> => {
    await signOut(auth);
  },

  getCurrentUser: (): User | null => {
    return mapFirebaseUser(auth.currentUser);
  },

  onAuthStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (user) => {
      callback(mapFirebaseUser(user));
    });
  }
};
