import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; 

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
