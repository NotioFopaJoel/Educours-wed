import axiosClient from './axiosClient';

export const courseApi = {
  getAll: (params?: any) => axiosClient.get('/courses', { params }),
  getOne: (id: string) => axiosClient.get(`/courses/${id}`),
  create: (data: any) => axiosClient.post('/courses', data),
  update: (id: string, data: any) => axiosClient.put(`/courses/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/courses/${id}`),
  assignTeacher: (id: string, teacherId: string) =>
    axiosClient.post(`/courses/${id}/assign-teacher`, { teacherId }),
  removeTeacher: (courseId: string, teacherId: string) =>
    axiosClient.delete(`/courses/${courseId}/teachers/${teacherId}`),
  enroll: (courseId: string) => axiosClient.post(`/courses/${courseId}/enroll`),
  addChapter: (courseId: string, data: any) =>
    axiosClient.post(`/courses/${courseId}/chapters`, data),
  updateChapter: (chapterId: string, data: any) =>
    axiosClient.put(`/courses/chapters/${chapterId}`, data),
  deleteChapter: (chapterId: string) =>
    axiosClient.delete(`/courses/chapters/${chapterId}`),
  addLesson: (chapterId: string, data: any) =>
    axiosClient.post(`/courses/chapters/${chapterId}/lessons`, data),
  updateLesson: (lessonId: string, data: any) =>
    axiosClient.put(`/courses/lessons/${lessonId}`, data),
  deleteLesson: (lessonId: string) =>
    axiosClient.delete(`/courses/lessons/${lessonId}`),
};
