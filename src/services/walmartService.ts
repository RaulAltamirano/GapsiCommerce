// src/services/walmartService.js
import api from './api';

const walmartService = {
  async searchProducts(keyword: string, page = 1) {
    try {
      const response = await api.get('/wlm/walmart-search-by-keyword', {
        params: {
          keyword: keyword,
          page: page,
        },
      });
      return response.data; 
    } catch (error) {
      console.error('Error searching products', error);
      throw error;
    }
  },
};

export default walmartService;