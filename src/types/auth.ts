export interface User {
  id: string;
  email?: string;
  name?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
  };
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
