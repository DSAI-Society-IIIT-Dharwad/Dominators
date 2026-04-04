import { LoginCredentials, SignupCredentials } from '../types/auth';
import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();

  return {
    ...context,
    login: async (credentials: LoginCredentials) => {
      try {
        context.setLoading(true);
        const user = await context.signIn(credentials);
        context.setUser(user);
        return user;
      } catch (error) {
        throw error;
      } finally {
        context.setLoading(false);
      }
    },
    signup: async (credentials: SignupCredentials) => {
      try {
        context.setLoading(true);
        const user = await context.signUp(credentials);
        context.setUser(user);
        return user;
      } catch (error) {
        throw error;
      } finally {
        context.setLoading(false);
      }
    },
    logout: async () => {
      try {
        context.setLoading(true);
        await context.signOut();
        context.setUser(null);
        context.setSession(null);
      } catch (error) {
        throw error;
      } finally {
        context.setLoading(false);
      }
    }
  };
};
