import apiClient from './axios';

export const reviewApi = {
  submitReview: async (data) => {
    const response = await apiClient.post('/api/v1/reviews', {
      rating: data.rating,
      review: data.review,
    });
    return response.data;
  },
};
