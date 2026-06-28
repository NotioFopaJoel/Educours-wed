import axiosClient from './axiosClient';

export const quizApi = {
  getMyQuizzes: () => axiosClient.get('/quizzes/my'),
  getQuizById: (id: string) => axiosClient.get(`/quizzes/${id}`),
  submitQuiz: (quizId: string, answers: number[]) =>
    axiosClient.post(`/quizzes/${quizId}/submit`, { answers }),
  getMyResults: () => axiosClient.get('/quizzes/my/results'),
  getCourseResults: (courseId: string) =>
    axiosClient.get(`/quizzes/course/${courseId}/results`),
};
