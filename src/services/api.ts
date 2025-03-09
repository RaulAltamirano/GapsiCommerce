// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://axesso-walmart-data-service.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': 'fce0e15738msh6a87c0c9db9505cp14b74fjsn54bc768f3bc7',
    'x-rapidapi-host': 'axesso-walmart-data-service.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
});

export default api;