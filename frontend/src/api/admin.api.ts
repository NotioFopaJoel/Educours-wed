import axiosClient from './axiosClient';

export const adminApi = {
  getDashboard: () => axiosClient.get('/admin/dashboard'),
  getUsers: (params: any) => axiosClient.get('/admin/users', { params }),
  getUserDetail: (id: string) => axiosClient.get(`/admin/users/${id}`),
  toggleUserStatus: (id: string) => axiosClient.patch(`/admin/users/${id}/toggle-status`),
  approveTeacher: (id: string) => axiosClient.patch(`/admin/teachers/${id}/approve`),
  suspendTeacher: (id: string) => axiosClient.patch(`/admin/teachers/${id}/suspend`),
  getTransactions: (params: any) => axiosClient.get('/admin/transactions', { params }),
  broadcast: (data: { title: string; message: string; targetRole?: string }) =>
    axiosClient.post('/admin/broadcast', data),
  getSettings: () => axiosClient.get('/admin/settings'),
  updateSettings: (data: any) => axiosClient.put('/admin/settings', data),
};
