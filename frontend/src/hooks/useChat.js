import { axiosInstance } from '@/utils/axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { useAuth } from './useAuth';

export const useChat = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  setSelectedUser: async (user) => {
    set({ selectedUser: user });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/messages/users');
      set({ users: res.data.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.data });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data.data] });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) return;

    const { socket } = useAuth.getState();
    socket.on('newMessage', (message) => {
      if (message.senderId !== selectedUser._id) {
        set({ users: get().users.map((user) => (user._id === message.receiverId ? { ...user, unreadMessages: user.unreadMessages + 1 } : user)) });
        return;
      }

      set({ messages: [...get().messages, message] });
    });
  },

  unsubscribeFromMessages: () => {
    const { socket } = useAuth.getState();
    socket.off('newMessage');
  },

  readAllMessages: async (userId) => {
    try {
      const res = await axiosInstance.post(`/messages/read-all/${userId}`);

      set({ messages: res.data.data });
    } catch (error) {
      console.error('Error in readAllMessages controller: ', error.message);
    }
  },
}));
