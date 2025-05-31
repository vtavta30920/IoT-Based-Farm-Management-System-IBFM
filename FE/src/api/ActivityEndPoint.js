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

// Lấy tất cả hoạt động nông trại (có phân trang và filter)
export const getAllActivities = async ({
  pageIndex = 1,
  pageSize = 10,
  type,
  status,
  month,
}) => {
  let url = `https://webapi20250531180300.azurewebsites.net/api/v1/farm-activity/get-all?pageIndex=${pageIndex}&pageSize=${pageSize}`;
  if (type !== undefined && type !== "") url += `&type=${type}`;
  if (status !== undefined && status !== "") url += `&status=${status}`;
  if (month !== undefined && month !== "") url += `&month=${month}`;
  const response = await axios.get(url, {
    headers: {
      Accept: "*/*",
    },
  });
  return response.data;
};

// Hook sử dụng React Query để lấy danh sách hoạt động với filter
export const useGetAllActivities = (
  pageIndex = 1,
  pageSize = 10,
  type,
  status,
  month
) => {
  return useQuery({
    queryKey: ["farm-activity", pageIndex, pageSize, type, status, month],
    queryFn: () =>
      getAllActivities({ pageIndex, pageSize, type, status, month }),
    keepPreviousData: true,
  });
};

// Tạo hoạt động nông trại mới
export const createActivity = async ({ activityType, startDate, endDate }) => {
  const response = await axios.post(
    `https://webapi20250531180300.azurewebsites.net/api/v1/farm-activity/create?activityType=${activityType}`,
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

// Đổi trạng thái hoạt động nông trại
export const changeActivityStatus = async (farmActivitiesId) => {
  const response = await axios.put(
    `https://webapi20250531180300.azurewebsites.net/api/v1/farm-activity/change-status/${farmActivitiesId}`,
    null,
    {
      headers: {
        Accept: "*/*",
      },
    }
  );
  return response.data;
};

// Hook mutation để đổi trạng thái hoạt động
export const useChangeActivityStatus = () => {
  return useMutation({
    mutationFn: changeActivityStatus,
  });
};

// Cập nhật hoạt động nông trại
export const updateActivity = async ({
  farmActivitiesId,
  activityType,
  startDate,
  endDate,
}) => {
  const response = await axios.put(
    `https://webapi20250531180300.azurewebsites.net/api/v1/farm-activity/update/${farmActivitiesId}?activityType=${activityType}`,
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

// Hook mutation để cập nhật hoạt động
export const useUpdateActivity = () => {
  return useMutation({
    mutationFn: updateActivity,
  });
};

// Đổi trạng thái activity sang COMPLETE
export const completeActivity = async (farmActivitiesId) => {
  const response = await axios.put(
    `https://webapi20250531180300.azurewebsites.net/api/v1/farm-activity/complete/${farmActivitiesId}`,
    null,
    {
      headers: {
        Accept: "*/*",
      },
    }
  );
  return response.data;
};

// Hook mutation để gọi complete activity
export const useCompleteActivity = () => {
  return useMutation({
    mutationFn: completeActivity,
  });
};
