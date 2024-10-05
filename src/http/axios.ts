import axios from 'axios';

// Instância 1 - Configuração para o primeiro endpoint
export const userApi = axios.create({
  baseURL: process.env.USERS_API_PATH,
});

// Instância 2 - Configuração para o segundo endpoint
export const apiInstance2 = axios.create({
  baseURL: 'https://api.segundo-endpoint.com',
  timeout: 2000,
  headers: { Authorization: 'Bearer your-token-here' },
});
