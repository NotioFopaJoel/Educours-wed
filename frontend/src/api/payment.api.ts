import axiosClient from './axiosClient';

export const paymentApi = {
  initiate: (data: { courseId: string; phoneNumber: string; service: 'MTN' | 'ORANGE' }) =>
    axiosClient.post('/payments/initiate', data),
  verify: (transactionId: string) =>
    axiosClient.get(`/payments/verify/${transactionId}`),
};
