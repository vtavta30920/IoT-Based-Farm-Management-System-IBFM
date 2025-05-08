import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext'; 

const GetAllProducts = async (pageIndex, pageSize, status, categoryId, sortByStockAsc = true) => {
    const statusParam = status !== undefined && status !== null ? `&status=${status}` : "";
    const categoryParam = categoryId !== undefined && categoryId !== null ? `&categoryId=${categoryId}` : "";
    const sortParam = `&sortByStockAsc=${sortByStockAsc}`;
  
    const { data } = await axios.get(
      `https://localhost:7067/api/v1/products/product-filter?pageIndex=${pageIndex}&pageSize=${pageSize}${statusParam}${categoryParam}${sortParam}`
    );
    return data;
  };
  
  export const useGetAllProducts = (pageIndex, pageSize, status, categoryId, sortByStockAsc = true) => {
    return useQuery({
      queryKey: ['v1/products/product-filter', { pageIndex, pageSize, status, categoryId, sortByStockAsc }],
      queryFn: () => GetAllProducts(pageIndex, pageSize, status, categoryId, sortByStockAsc),
    });
  };
  