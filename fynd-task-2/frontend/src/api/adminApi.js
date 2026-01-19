import apiClient from './axios';

export const adminApi = {
  getReviews: async ({ rating, limit = 50, offset = 0, search = '' }) => {
    const params = new URLSearchParams();
    if (rating) params.append('rating', rating);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);
    if (search) params.append('search', search);
    
    const response = await apiClient.get(`/api/v1/admin/reviews?${params.toString()}`);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await apiClient.get('/api/v1/admin/analytics');
    return response.data;
  },
};
