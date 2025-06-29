import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getExpenses = async () => {
  const res = await API.get('/expenses');
  return res.data;
};

export const createExpense = async (data) => {
  const res = await API.post('/expenses', data);
  return res.data;
};

export const deleteExpense = async (id) => {
  const res = await API.delete(`/expenses/${id}`);
  return res.data;
};

export default API;
