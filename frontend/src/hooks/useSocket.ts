import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { isAuthenticated, user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('accessToken');
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('notification', (notification) => {
      addNotification(notification);
    });

    socketRef.current.on('new-message', (data) => {
      console.log('New message received:', data);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [isAuthenticated, user]);

  const getSocket = () => socketRef.current;

  return { getSocket };
};
