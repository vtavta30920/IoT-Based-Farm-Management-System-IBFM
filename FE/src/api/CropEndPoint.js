import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; 

export const getAllCrops = async () => {
  const response = await axios.get(`https://localhost:7067/api/v1/crop/get-all`);
  return response.data;
};

export const useGetAllCrops = () => {
  return useQuery({
    queryKey: ["getAllCrops"],
    queryFn: getAllCrops,
  });
};
