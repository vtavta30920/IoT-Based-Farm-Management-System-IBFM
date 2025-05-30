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

// Hàm gọi API lấy lịch làm việc của staff hiện tại
export const getScheduleByStaff = async () => {
  const { data } = await axios.get(
    "https://localhost:7067/api/v1/Schedule/schedule-by-staff"
  );
  return data;
};

// Hook react-query để lấy lịch làm việc của staff hiện tại
export const useGetScheduleByStaff = () => {
  return useQuery({
    queryKey: ["v1/Schedule/schedule-by-staff"],
    queryFn: getScheduleByStaff,
  });
};
