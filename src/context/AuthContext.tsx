import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, SignupCredentials } from '../types/auth';
import { firebaseAuth } from '../lib/firebaseAuth';
import { auth } from '../lib/firebase';

interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<User>;
  signUp: (credentials: SignupCredentials) => Promise<User>;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setSession: (session: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null); // Firebase doesn't use the same session object as Supabase but we can keep it null or store the token
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth changes
    const unsubscribe = firebaseAuth.onAuthStateChange((authUser) => {
      setUser(authUser);
      setSession(auth.currentUser); // Storing the currentUser object as a 'session' for compatibility
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn: firebaseAuth.signIn,
    signUp: firebaseAuth.signUp,
    signOut: firebaseAuth.signOut,
    setLoading: setIsLoading,
    setUser,
    setSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
