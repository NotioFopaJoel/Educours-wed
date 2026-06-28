import axiosClient from './axiosClient';

export const studentApi = {
  getDashboard: () => axiosClient.get('/students/dashboard'),
  getEnrollments: () => axiosClient.get('/students/enrollments'),
  getEnrollmentDetail: (id: string) => axiosClient.get(`/students/enrollments/${id}`),
  updateProgress: (id: string, lessonId: string) =>
    axiosClient.put(`/students/enrollments/${id}/progress`, { lessonId }),
  getQuizResults: () => axiosClient.get('/students/quiz-results'),
  getTransactions: () => axiosClient.get('/students/transactions'),
};
