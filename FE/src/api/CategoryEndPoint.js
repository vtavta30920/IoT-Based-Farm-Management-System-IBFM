import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const getAllCategories = async () => {
  const response = await axios.get('https://localhost:7067/api/v1/category/get-all');
  return response.data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['v1/category/get-all'],
    queryFn: getAllCategories,
  });
};

export const createCategory = async (categoryName) => {
  const response = await axios.post(
    'https://localhost:7067/api/v1/category/create',
    JSON.stringify(categoryName),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['v1/category/get-all']);
    },
    onError: (error) => {
      if (error.response) {
        console.error('Create category failed:', error.response.data, error.response.status, error.response.config.url);
      } else {
        console.error('Create category failed:', error.message);
      }
    },
  });
};