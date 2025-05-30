import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

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

// Lấy tất cả hoạt động nông trại (có phân trang)
export const getAllActivities = async ({ pageIndex = 1, pageSize = 10 }) => {
  const response = await axios.get(
    `https://localhost:7067/api/v1/farm-activity/get-all?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      headers: {
        Accept: "*/*",
      },
    }
  );
  return response.data;
};

// Hook sử dụng React Query để lấy danh sách hoạt động
export const useGetAllActivities = (pageIndex = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["farm-activity", pageIndex, pageSize],
    queryFn: () => getAllActivities({ pageIndex, pageSize }),
    keepPreviousData: true,
  });
};

// Tạo hoạt động nông trại mới
export const createActivity = async ({ activityType, startDate, endDate }) => {
  const response = await axios.post(
    `https://localhost:7067/api/v1/farm-activity/create?activityType=${activityType}`,
    {
      startDate,
      endDate,
    },
    {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Hook mutation để tạo hoạt động mới
export const useCreateActivity = () => {
  return useMutation({
    mutationFn: createActivity,
  });
};
