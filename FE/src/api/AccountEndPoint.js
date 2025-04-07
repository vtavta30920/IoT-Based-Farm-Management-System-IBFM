import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchGetAllAccount = async (pageIndex, pageSize) => {
  const { data } = await axios.get(`https://localhost:7067/api/v1/account/get-all?pageSize=${pageSize}&pageIndex=${pageIndex}`);
  return data;
};

export const useGetAllAccount = (pageIndex, pageSize) => {
  return useQuery({
    queryKey: ['v1/account/get-all', { pageIndex, pageSize }],
    queryFn: () => fetchGetAllAccount(pageIndex, pageSize),
    staleTime: Infinity
  });
};

// Hàm fetch API get-by-email
export const getUserByEmail = async (email) => {
  const response = await axios.get(`https://localhost:7067/api/v1/account/get-by-email?email=${email}`);
  return response.data;
};

// Hook React Query để gọi API get-by-email
export const useGetAccountByEmail = (email) => {
  return useQuery({
    queryKey: ['v1/account/get-by-email', email],
    queryFn: () => getUserByEmail(email), // <-- sửa lại tên hàm cho đúng
    enabled: !!email,
    staleTime: Infinity
  });
};
