import axiosClient from './axiosClient';

export const teacherApi = {
  getDashboard: () => axiosClient.get('/teachers/dashboard'),
  getCourses: () => axiosClient.get('/teachers/courses'),
  getStudents: () => axiosClient.get('/teachers/students'),
  getRevenue: () => axiosClient.get('/teachers/revenue'),
};
