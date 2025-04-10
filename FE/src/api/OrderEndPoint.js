import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; // đường dẫn context

// Hàm API gọi dữ liệu đơn giản
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

// Custom hook giống cũ: chỉ truyền pageIndex, pageSize
export const useGetAllAccount = (pageIndex, pageSize) => {
  const { token } = useContext(UserContext); // lấy token bên trong custom hook

  return useQuery({
    queryKey: ['v1/Order/order-list-by-current-account', { pageIndex, pageSize }],
    queryFn: () => GetCurrentUserOrders(pageIndex, pageSize, token),
    enabled: !!token, // chỉ gọi khi có token
  });
};
