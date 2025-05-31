import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    `https://webapi20250531180300.azurewebsites.net/api/v1/feedback/feed-back-list?pageIndex=${pageIndex}&pageSize=${pageSize}`
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

// Hàm gọi API lấy feedback theo productId (GET /api/v1/feedback/feedback-by-product/{productId})
export const getFeedbackByProduct = async (productId) => {
  if (!productId) throw new Error("productId is required");
  const { data } = await axios.get(
    `https://webapi20250531180300.azurewebsites.net/api/v1/feedback/feedback-by-product/${productId}`,
    {
      headers: {
        Accept: "*/*",
      },
    }
  );
  return data;
};

// Hook react-query để lấy feedback theo productId
export const useGetFeedbackByProduct = (productId) => {
  return useQuery({
    queryKey: ["v1/feedback/feedback-by-product", productId],
    queryFn: () => getFeedbackByProduct(productId),
    enabled: !!productId,
  });
};

// Hàm gọi API lấy feedback theo orderId (GET /api/v1/feedback/feedback-by-order/{orderId})
export const getFeedbackByOrder = async (orderId) => {
  if (!orderId) throw new Error("orderId is required");
  const { data } = await axios.get(
    `https://webapi20250531180300.azurewebsites.net/api/v1/feedback/feedback-by-order/${orderId}`,
    {
      headers: {
        Accept: "*/*",
      },
    }
  );
  return data;
};

// Hook react-query để lấy feedback theo orderId
export const useGetFeedbackByOrder = (orderId) => {
  return useQuery({
    queryKey: ["v1/feedback/feedback-by-order", orderId],
    queryFn: () => getFeedbackByOrder(orderId),
    enabled: !!orderId,
  });
};

// Hàm gọi API cập nhật trạng thái feedback (POST, truyền feedbackId trên URL)
export const updateFeedbackStatus = async (feedbackId) => {
  if (!feedbackId) throw new Error("feedbackId is required");
  const { data } = await axios.post(
    `https://webapi20250531180300.azurewebsites.net/api/v1/feedback/update-feedback-status/${feedbackId}`
  );
  return data;
};

// Hook react-query để cập nhật trạng thái feedback
export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFeedbackStatus,
    onSuccess: () => {
      // Invalidate feedback queries nếu cần
      queryClient.invalidateQueries(["v1/feedback/feedback-by-product"]);
      queryClient.invalidateQueries(["v1/feedback/feed-back-list"]);
    },
    onError: (error) => {
      if (error.response) {
        console.error(
          "Update feedback status failed:",
          error.response.data,
          error.response.status,
          error.response.config.url
        );
      } else {
        console.error("Update feedback status failed:", error.message);
      }
    },
  });
};
