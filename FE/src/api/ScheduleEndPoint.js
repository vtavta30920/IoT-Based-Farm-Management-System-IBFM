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

// Hàm gọi API lấy lịch làm việc của staff hiện tại, có filter theo month (tháng của startDate)
export const getScheduleByStaff = async (month) => {
  let url =
    "https://webapi20250531180300.azurewebsites.net/api/v1/Schedule/schedule-by-staff";
  if (month) {
    url += `?month=${month}`;
  }
  const { data } = await axios.get(url, {
    headers: {
      Accept: "*/*",
    },
  });
  return data;
};

// Hook react-query để lấy lịch làm việc của staff hiện tại, có filter theo month
export const useGetScheduleByStaff = (month) => {
  return useQuery({
    queryKey: ["v1/Schedule/schedule-by-staff", month],
    queryFn: () => getScheduleByStaff(month),
  });
};
