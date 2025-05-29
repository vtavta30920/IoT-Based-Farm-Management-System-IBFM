import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

// Hàm gọi API lấy danh sách feedback
export const getFeedbackList = async (pageIndex = 1, pageSize = 10) => {
  const { data } = await axios.get(
    `https://localhost:7067/api/v1/feedback/feed-back-list?pageIndex=${pageIndex}&pageSize=${pageSize}`
  );
  return data;
};

// Hook react-query để lấy danh sách feedback
export const useGetFeedbackList = (pageIndex = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["v1/feedback/feed-back-list", { pageIndex, pageSize }],
    queryFn: () => getFeedbackList(pageIndex, pageSize),
  });
};
