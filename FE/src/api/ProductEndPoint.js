import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  
  const GetProductById = async (id) => {
    const { data } = await axios.get(`https://localhost:7067/api/v1/products/get-product/${id}`);
    return data;
  };

  export const useGetProductById = (id) => {
    return useQuery({
      queryKey: ['v1/products/get-product', id],
      queryFn: () => GetProductById(id),
      enabled: !!id, // chỉ gọi API khi id có giá trị hợp lệ
    });
  };

  export const updateProductStatus = async (productId) => {
    if (!productId) {
      throw new Error("Product ID is required to update status.");
    }
    // Đổi từ POST sang PUT (hoặc PATCH) nếu backend yêu cầu, hoặc kiểm tra lại endpoint
    // Nếu backend chỉ nhận POST nhưng không có body, thêm {} làm body
    const response = await axios.put(
      `https://localhost:7067/api/v1/products/change-product-status/${productId}`,
      {} // Thêm body rỗng để tránh lỗi 405 nếu backend yêu cầu body
    );
    return response.data;
  };
  
  export const useUpdateProductStatus = () => {
    const queryClient = useQueryClient(); // Access the query client

    return useMutation({
      mutationFn: (productId) => updateProductStatus(productId), // Accept productId dynamically
      onSuccess: (data) => {
        console.log("Product status updated successfully:", data);
        queryClient.invalidateQueries(['v1/products/product-filter']); // Invalidate product list query
      },
      onError: (error) => {
        console.error("Failed to update product status:", error);
      },
    });
  };

export const createProduct = async (product) => {
  console.log("Create Product API payload:", product);
  const response = await axios.post(
    'https://localhost:7067/api/v1/products/create',
    product,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  console.log("Create Product API response:", response);
  return response.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product) => {
      console.log("Calling createProduct with:", product);
      return createProduct(product);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['v1/products/product-filter']);
      console.log('Product created successfully:', data);
    },
    onError: (error) => {
      if (error.response) {
        console.error('Create product failed:', error.response.data, error.response.status, error.response.config.url);
      } else {
        console.error('Create product failed:', error.message);
      }
    },
  });
};