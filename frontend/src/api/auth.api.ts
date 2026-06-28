import axiosClient from './axiosClient';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    axiosClient.post('/auth/login', data),

  registerStudent: (data: any) =>
    axiosClient.post('/auth/register/student', data),

  registerTeacher: (data: any) =>
    axiosClient.post('/auth/register/teacher', data),

  verifyEmail: (data: { email: string; code: string }) =>
    axiosClient.post('/auth/verify-email', data),

  forgotPassword: (data: { email: string }) =>
    axiosClient.post('/auth/forgot-password', data),

  resetPassword: (data: { email: string; code: string; password: string }) =>
    axiosClient.post('/auth/reset-password', data),

  refreshToken: (refreshToken: string) =>
    axiosClient.post('/auth/refresh-token', { refreshToken }),

  getProfile: () => axiosClient.get('/auth/profile'),

  updateProfile: (data: any) => axiosClient.put('/auth/profile', data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    axiosClient.put('/auth/password', data),

  completeOnboarding: () => axiosClient.put('/auth/complete-onboarding'),
};
