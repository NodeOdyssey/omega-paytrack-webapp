import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { api } from '../configs/api';
import { User } from '../types/auth';

type AuthStoreState = {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  redirectUrl: string;
  error: string | null;
};

type AuthStoreActions = {
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User; redirectUrl: string; accessToken: string }>;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  devtools((set) => ({
    isLoggedIn: false,
    user: null,
    accessToken: null,
    isLoading: false,
    redirectUrl: '/app/auth/login',
    error: null,

    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${api.baseUrl}${api.login}`, {
          email,
          password,
        });
        if (!response.data.success) {
          throw new Error(response.data.message);
        } else {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('profilePhoto', response.data.user.profilePhoto);
          localStorage.setItem('userRole', response.data.user.role);
          toast.success('Login successful');
          set({
            isLoggedIn: true,
            user: response.data.user,
            accessToken: response.data.accessToken,
            isLoading: false,
            redirectUrl: '/app/home',
            error: null,
          });
          return {
            user: response.data.user,
            accessToken: response.data.accessToken,
            redirectUrl: '/app/home',
          };
        }
      } catch (error) {
        set({
          isLoading: false,
          isLoggedIn: false,
          user: null,
          accessToken: null,
        });
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message || 'Login Failed');
        } else {
          toast.error('Login Failed');
        }
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('profilePhoto');
      localStorage.removeItem('userRole');
      set({ isLoggedIn: false, user: null, accessToken: null });
    },
  }))
);

export default useAuthStore;
