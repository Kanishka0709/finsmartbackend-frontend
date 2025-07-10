import axiosInstance from './axiosConfig';

export const getExpenses = () => axiosInstance.get('/expenses');
export const getExpenseById = (id) => axiosInstance.get(`/expenses/${id}`);
export const addExpense = (expense) => axiosInstance.post('/expenses', expense);
export const updateExpense = (id, expense) => axiosInstance.put(`/expenses/${id}`, expense);
export const deleteExpense = (id) => axiosInstance.delete(`/expenses/${id}`);


