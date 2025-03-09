import axios from 'axios';

const apiKey = process.env.RAPIDAPI_KEY;
const api = axios.create({
  baseURL: 'https://axesso-walmart-data-service.p.rapidapi.com',
  headers: {
    'x-rapidapi-key': apiKey, 
    'x-rapidapi-host': 'axesso-walmart-data-service.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
});

export default api;
