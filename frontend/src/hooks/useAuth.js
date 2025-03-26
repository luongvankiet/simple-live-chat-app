import { axiosInstance } from '@/utils/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { create } from 'zustand';

// @ts-ignore
const BASEURL = import.meta.env.MODE === 'development' ? `${import.meta.env.VITE_APP_API_URL}/api` : '/api';

export const useAuth = create((set, get) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      set({ authUser: res.data.data });
      get().connectSocket();
    } catch (error) {
      console.error('Error in checking auth:', error?.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/register', data);
      toast.success('Account created successfully');
      set({ authUser: res.data.data });

      // connect socket
      get().connectSocket();
    } catch (error) {
      console.error('Error in registering user:', error?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      toast.success('Login successfully');
      set({ authUser: res.data.data });

      // connect socket
      get().connectSocket();
    } catch (error) {
      console.error('Error in logging in user:', error?.message);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });

      get().disconnectSocket();
    } catch (error) {
      console.error('Error in logging out user:', error?.message);
      toast.error(error?.response?.data?.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });

    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: res.data.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error in updating profile:', error);
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    // @ts-ignore
    const socketServer = io(BASEURL, {
      query: { userId: authUser._id },
    });
    socketServer.connect();

    set({ socket: socketServer });

    socketServer.on('getOnlineUsers', (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (!socket?.connected) return;
    socket.disconnect();
  },
}));
