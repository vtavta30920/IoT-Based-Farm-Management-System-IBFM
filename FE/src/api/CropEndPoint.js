import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; 

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

export const getAllCrops = async () => {
  const response = await axios.get(`https://localhost:7067/api/v1/crop/get-all-active`);
  return response.data;
};

export const useGetAllCrops = () => {
  return useQuery({
    queryKey: ["getAllCrops"],
    queryFn: getAllCrops,
  });
};

// Đổi trạng thái crop
export const changeCropStatus = async (cropId) => {
  if (!cropId) throw new Error("cropId is required");
  const response = await axios.put(
    `https://localhost:7067/api/v1/crop/chang-status?cropId=${cropId}`
  );
  return response.data;
};

export const useChangeCropStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeCropStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllCrops"]);
    },
    onError: (error) => {
      if (error.response) {
        console.error('Change crop status failed:', error.response.data, error.response.status, error.response.config.url);
      } else {
        console.error('Change crop status failed:', error.message);
      }
    },
  });
};

export const createCrop = async (cropData) => {
  const response = await axios.post(
    'https://localhost:7067/api/v1/crop/create',
    cropData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const useCreateCrop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCrop,
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllCrops"]);
    },
    onError: (error) => {
      if (error.response) {
        console.error('Create crop failed:', error.response.data, error.response.status, error.response.config.url);
      } else {
        console.error('Create crop failed:', error.message);
      }
    },
  });
};

export const updateCrop = async (cropId, updateData) => {
  const response = await axios.put(
    `https://localhost:7067/api/v1/crop/update/${cropId}`,
    updateData // Truyền body JSON chứa cropName, description, quantity, plantingDate
  );
  return response.data;
};

export const useUpdateCrop = () => {
  return useMutation({
    mutationFn: ({ cropId, updateData }) => updateCrop(cropId, updateData),
    onSuccess: (data) => {
      console.log('Update crop success:', data);
      // Có thể show toast hoặc invalidate query tại đây
    },
    onError: (error) => {
      console.error('Update crop failed:', error);
    },
  });
};