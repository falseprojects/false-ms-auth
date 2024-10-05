import axios from 'axios';

export const userApi = axios.create({
  baseURL: process.env.USERS_API_PATH,
});
