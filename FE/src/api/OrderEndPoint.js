import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; // đường dẫn context

// Hàm API order list theo current user
const GetCurrentUserOrders = async (pageIndex, pageSize, token) => {
  const { data } = await axios.get(
    `https://localhost:7067/api/v1/Order/order-list-by-current-account?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const useGetCurrentUserOrder = (pageIndex, pageSize) => {
  const { token } = useContext(UserContext);

  return useQuery({
    queryKey: ['v1/Order/order-list-by-current-account', { pageIndex, pageSize, token }], // ✅ token được đưa vào queryKey
    queryFn: () => GetCurrentUserOrders(pageIndex, pageSize, token),
    enabled: !!token,
    keepPreviousData: false,
  });
};


// Hàm API order list 
const GetAllOrders = async (pageIndex, pageSize) => {
    const { data } = await axios.get(
      `https://localhost:7067/api/v1/Order/order-list?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return data;
  };
  
  export const useGetAllOrder = (pageIndex, pageSize) => {
    return useQuery({
      queryKey: ['v1/Order/order-list', { pageIndex, pageSize }],
      queryFn: () => GetAllOrders(pageIndex, pageSize),
    });
  };