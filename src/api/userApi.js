import axiosInstance from './axiosConfig';

export const getUsers = () => axiosInstance.get('/users');
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);
export const addUser = (user) => axiosInstance.post('/users', user);
export const updateUser = (id, user) => axiosInstance.put(`/users/${id}`, user);
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);


