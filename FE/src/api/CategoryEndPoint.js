import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Thêm interceptor để tự động thêm token vào header nếu có
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const deleteCategory = async (categoryId) => {
  const response = await axios.delete(
    `https://localhost:7067/api/v1/category/${categoryId}`
  );
  return response.data;
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['v1/category/get-all']);
    },
    onError: (error) => {
      if (error.response) {
        console.error('Delete category failed:', error.response.data, error.response.status, error.response.config.url);
      } else {
        console.error('Delete category failed:', error.message);
      }
    },
  });
};