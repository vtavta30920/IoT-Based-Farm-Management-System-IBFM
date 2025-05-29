import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetFeedbackByProduct,
  useUpdateFeedbackStatus,
} from "../../api/FeedbackEndPoint";

// Table hiển thị danh sách feedback cho 1 product
const FeedbackList = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetFeedbackByProduct(productId);

  // Debug: log raw API data
  // console.log("FeedbackList API data:", data);

  // Chuẩn hóa lấy feedbacks từ data.data nếu là mảng
  let feedbacks = [];
  if (Array.isArray(data?.data)) {
    feedbacks = data.data;
  } else if (Array.isArray(data?.items)) {
    feedbacks = data.items;
  } else if (Array.isArray(data?.data?.items)) {
    feedbacks = data.data.items;
  } else if (Array.isArray(data)) {
    feedbacks = data;
  }

  // State để quản lý modal thông báo
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // "success" | "error"
  });

  // Hook cập nhật status feedback
  const updateFeedbackStatus = useUpdateFeedbackStatus();

  // Khi bấm vào status, tự động chuyển đổi status và gọi API
  const handleStatusClick = async (fb) => {
    if (updateFeedbackStatus.isLoading) return;
    try {
      await updateFeedbackStatus.mutateAsync(fb.feedbackId);
      setNotification({
        show: true,
        message: "Update feedback status successfully!",
        type: "success",
      });
    } catch (err) {
      setNotification({
        show: true,
        message: "Update feedback status failed!",
        type: "error",
      });
    }
  };

  // Nếu productId không có hoặc là undefined, báo lỗi
  if (!productId) {
    return (
      <div className="p-6 bg-white min-h-screen flex flex-col">
        <div className="text-center text-red-600 py-10">
          Product ID is missing in the URL.
        </div>
      </div>
    );
  }

  // Các status có thể chọn
  const statusOptions = ["ACTIVE", "INACTIVE"];

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      {/* Notification Modal */}
      {notification.show && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80 flex flex-col items-center">
            <span
              className={`text-2xl mb-2 ${
                notification.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {notification.type === "success" ? "✔️" : "❌"}
            </span>
            <div className="text-center mb-4">{notification.message}</div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => setNotification({ ...notification, show: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex items-center mb-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-4"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        <h2 className="text-2xl font-bold text-green-700">Feedback List</h2>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white">
        <table className="min-w-full bg-white border border-gray-300">
          <colgroup>
            <col style={{ width: "32%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-r border-gray-300">
                Comment
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-r border-gray-300">
                Email
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-r border-gray-300">
                Created At
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold border-r border-gray-300">
                Rating
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 border-b border-gray-300"
                >
                  Loading feedback...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-red-600 py-8 border-b border-gray-300"
                >
                  Error loading feedback.
                </td>
              </tr>
            ) : feedbacks && feedbacks.length > 0 ? (
              feedbacks.map((fb, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 border-b border-gray-300"
                >
                  <td className="px-4 py-2 text-left border-r border-gray-300 align-top">
                    <div className="whitespace-pre-line break-words">
                      {fb.comment}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center border-r border-gray-300 align-top">
                    {fb.email}
                  </td>
                  <td className="px-4 py-2 text-center border-r border-gray-300 align-top">
                    {fb.createdAt}
                  </td>
                  <td className="px-4 py-2 text-center border-r border-gray-300 align-top">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < (fb.rating || 0) ? "#fbbf24" : "#d1d5db",
                          fontSize: "1.1em",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2 text-center align-top relative">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow border transition ${
                        fb.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 border-green-400"
                          : "bg-red-100 text-red-800 border-red-400"
                      }`}
                      onClick={() => handleStatusClick(fb)}
                      disabled={updateFeedbackStatus.isLoading}
                    >
                      {fb.status}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-8 border-b border-gray-300"
                >
                  No feedback found for this product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackList;
