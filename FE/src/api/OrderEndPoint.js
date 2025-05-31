import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext"; // đường dẫn context
import { useState } from "react";

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

// Hàm API order list theo current user
const GetCurrentUserOrders = async (pageIndex, pageSize, token, status) => {
  const statusParam = status ? `&status=${status}` : "";
  const { data } = await axios.get(
    `https://webapi20250531180300.azurewebsites.net/api/v1/Order/order-list-by-current-account?pageIndex=${pageIndex}&pageSize=${pageSize}${statusParam}`,
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
  const statusParam =
    status !== undefined && status !== null ? `&status=${status}` : "";
  const { data } = await axios.get(
    `https://webapi20250531180300.azurewebsites.net/api/v1/Order/order-list?pageIndex=${pageIndex}&pageSize=${pageSize}${statusParam}`
  );
  return data;
};

export const useGetAllOrder = (pageIndex, pageSize, status) => {
  return useQuery({
    queryKey: ["v1/Order/order-list", { pageIndex, pageSize, status }],
    queryFn: () => GetAllOrders(pageIndex, pageSize, status),
  });
};

// Hàm API order list theo email, có filter status
const GetOrdersByEmail = async (email, pageIndex = 1, pageSize = 5, status) => {
  // Đúng URL: /order-list-by-emal/{email}?status=4&pageIndex=1&pageSize=10
  let url = `https://webapi20250531180300.azurewebsites.net/api/v1/Order/order-list-by-emal/${encodeURIComponent(
    email
  )}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
  if (status !== undefined && status !== null && status !== "") {
    url += `&status=${status}`;
  }
  console.log("[DEBUG] Call API:", url);
  const { data } = await axios.get(url);
  console.log("[DEBUG] API response data:", data);
  return data;
};

export const useGetOrdersByEmail = (
  email,
  pageIndex = 1,
  pageSize = 5,
  enabled = false,
  status
) => {
  return useQuery({
    queryKey: [
      "v1/Order/order-list-by-emal",
      { email, pageIndex, pageSize, status },
    ],
    queryFn: () => GetOrdersByEmail(email, pageIndex, pageSize, status),
    enabled: !!email && enabled,
    keepPreviousData: false,
  });
};

// Hàm API cập nhật trạng thái giao hàng
const UpdateDeliveryStatus = async (orderId, token) => {
  const url = `https://webapi20250531180300.azurewebsites.net/api/v1/Order/updateDeliveryStatus/${orderId}`;
  const headers = token
    ? { Authorization: `Bearer ${token}`, accept: "*/*" }
    : { accept: "*/*" };
  const { data } = await axios.put(url, null, { headers });
  return data;
};

// Hook dùng để gọi API cập nhật trạng thái giao hàng
export const useUpdateDeliveryStatus = () => {
  const { token } = useContext(UserContext);
  return useMutation({
    mutationFn: (orderId) => UpdateDeliveryStatus(orderId, token),
  });
};

const UpdateCompleteStatus = async (orderId, token) => {
  const url = `https://webapi20250531180300.azurewebsites.net/api/v1/Order/updateCompletedStatus/${orderId}`;
  const headers = token
    ? { Authorization: `Bearer ${token}`, accept: "*/*" }
    : { accept: "*/*" };
  const { data } = await axios.put(url, null, { headers });
  return data;
};

// Hook dùng để gọi API cập nhật trạng thái giao hàng
export const useUpdateCompleteStatus = () => {
  const { token } = useContext(UserContext);
  return useMutation({
    mutationFn: (orderId) => UpdateCompleteStatus(orderId, token),
  });
};

const UpdateCancelStatus = async (orderId, token) => {
  const url = `https://webapi20250531180300.azurewebsites.net/api/v1/Order/updateCancelStatus/${orderId}`;
  const headers = token
    ? { Authorization: `Bearer ${token}`, accept: "*/*" }
    : { accept: "*/*" };
  const { data } = await axios.put(url, null, { headers });
  return data;
};

// Hook dùng để gọi API cập nhật trạng thái giao hàng
export const useUpdateCancelStatus = () => {
  const { token } = useContext(UserContext);
  return useMutation({
    mutationFn: (orderId) => UpdateCancelStatus(orderId, token),
  });
};

export const useCompletePayment = () => {
  return useMutation({
    mutationFn: (orderId) =>
      axios
        .post(
          `https://webapi20250531180300.azurewebsites.net/api/vnpay/PaymentByOrderId/${orderId}`
        )
        .then((res) => res.data),
  });
};

export const useCreateOrderPayment = () => {
  return useMutation({
    mutationFn: (orderId) =>
      axios
        .post(
          `https://webapi20250531180300.azurewebsites.net/api/v1/Order/createOrderPayment/${orderId}`
        )
        .then((res) => res.data),
  });
};
