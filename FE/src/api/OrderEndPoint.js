import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; // đường dẫn context
import { useState } from 'react';

// Hàm API order list theo current user
const GetCurrentUserOrders = async (pageIndex, pageSize, token, status) => {
  const statusParam = status ? `&status=${status}` : "";
  const { data } = await axios.get(
    `https://localhost:7067/api/v1/Order/order-list-by-current-account?pageIndex=${pageIndex}&pageSize=${pageSize}${statusParam}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const useGetCurrentUserOrder = (pageIndex, pageSize, status) => {
  const { token } = useContext(UserContext);

  return useQuery({
    queryKey: [
      "v1/Order/order-list-by-current-account",
      { pageIndex, pageSize, status, token },
    ],
    queryFn: () => GetCurrentUserOrders(pageIndex, pageSize, token, status),
    enabled: !!token,
    keepPreviousData: false,
  });
};


// Hàm API order list 
const GetAllOrders = async (pageIndex, pageSize, status) => {
  const statusParam = status !== undefined && status !== null ? `&status=${status}` : "";
  const { data } = await axios.get(
    `https://localhost:7067/api/v1/Order/order-list?pageIndex=${pageIndex}&pageSize=${pageSize}${statusParam}`
  );
  return data;
};

export const useGetAllOrder = (pageIndex, pageSize, status) => {
  return useQuery({
    queryKey: ['v1/Order/order-list', { pageIndex, pageSize, status }],
    queryFn: () => GetAllOrders(pageIndex, pageSize, status),
  });
};

// Hàm API order list theo email
const GetOrdersByEmail = async (email, pageIndex = 1, pageSize = 10) => {
  // Đúng URL: /order-list-by-emal/{email}?pageIndex=1&pageSize=10
  const url = `https://localhost:7067/api/v1/Order/order-list-by-emal/${encodeURIComponent(email)}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
  console.log("[DEBUG] Call API:", url);
  const { data } = await axios.get(url);
  console.log("[DEBUG] API response data:", data);
  return data;
};

export const useGetOrdersByEmail = (email, pageIndex = 1, pageSize = 10, enabled = false) => {
  return useQuery({
    queryKey: ['v1/Order/order-list-by-emal/cus', { email, pageIndex, pageSize }],
    queryFn: () => GetOrdersByEmail(email, pageIndex, pageSize),
    enabled: !!email && enabled,
    keepPreviousData: false,
  });
};
