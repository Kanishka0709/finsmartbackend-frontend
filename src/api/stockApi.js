// src/api/stockApi.js
import axios from './axiosConfig'; // or use axios directly

const BASE_URL = 'http://localhost:8099/stocks';

export const getAllStocks = () => axios.get(BASE_URL);
export const createStock = (stockData) => axios.post(BASE_URL, stockData);
export const deleteStock = (id) => axios.delete(`${BASE_URL}/${id}`);
export const updateStock = (id, stockData) => axios.put(`${BASE_URL}/${id}`, stockData);


