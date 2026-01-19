import { useQuery, useMutation } from '@tanstack/react-query';
import { reviewApi } from '../api/reviewApi';
import { adminApi } from '../api/adminApi';

// User review submission
export function useSubmitReview() {
  return useMutation({
    mutationFn: reviewApi.submitReview,
  });
}

// Admin reviews list
export function useAdminReviews(params) {
  return useQuery({
    queryKey: ['adminReviews', params],
    queryFn: () => adminApi.getReviews(params),
    refetchInterval: 5000, // Poll every 5 seconds
    keepPreviousData: true,
  });
}

// Admin analytics
export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: adminApi.getAnalytics,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}
