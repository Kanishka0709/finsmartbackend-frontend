import axiosInstance from './axiosConfig';

export const getInvestments = () => axiosInstance.get('/investments');
export const getInvestmentById = (id) => axiosInstance.get(`/investments/${id}`);
export const addInvestment = (investment) => axiosInstance.post('/investments', investment);
export const updateInvestment = (id, investment) => axiosInstance.put(`/investments/${id}`, investment);
export const deleteInvestment = (id) => axiosInstance.delete(`/investments/${id}`);


