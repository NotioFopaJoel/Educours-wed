import { create } from 'zustand';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  language: string;
  theme: 'light' | 'dark';
  fontSize: 'normal' | 'large' | 'xlarge';
  avatar: string;
  hasCompletedOnboarding: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (data) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...currentUser, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
  },
}));
