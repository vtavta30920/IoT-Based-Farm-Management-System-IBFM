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