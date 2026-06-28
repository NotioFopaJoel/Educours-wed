import axiosClient from './axiosClient';

export const chatbotApi = {
  createSession: () => axiosClient.post('/chatbot/session'),
  sendMessage: (data: { message: string; sessionId: string; courseId?: string }) =>
    axiosClient.post('/chatbot/message', data),
  getHistory: (sessionId: string) =>
    axiosClient.get(`/chatbot/history/${sessionId}`),
  getSessions: () => axiosClient.get('/chatbot/sessions'),
  deleteSession: (sessionId: string) =>
    axiosClient.delete(`/chatbot/sessions/${sessionId}`),
};
