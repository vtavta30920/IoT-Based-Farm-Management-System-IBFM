import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetFeedbackByProduct } from "../../api/FeedbackEndPoint";

// Table hiển thị danh sách feedback cho 1 product
const FeedbackList = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetFeedbackByProduct(productId);

  // Debug: log raw API data
  console.log("FeedbackList API data:", data);

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

  // State để quản lý dropdown status cho từng feedback
  const [statusDropdownIdx, setStatusDropdownIdx] = useState(null);

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
            <col style={{ width: "40%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
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
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 border-b border-gray-300"
                >
                  Loading feedback...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={4}
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
                  <td className="px-4 py-2 text-center align-top relative">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow border transition ${
                        fb.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 border-green-400"
                          : "bg-red-100 text-red-800 border-red-400"
                      }`}
                      onClick={() =>
                        setStatusDropdownIdx(
                          statusDropdownIdx === idx ? null : idx
                        )
                      }
                    >
                      {fb.status}
                    </button>
                    {statusDropdownIdx === idx && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-10 bg-white border rounded shadow-lg min-w-[100px]">
                        {statusOptions
                          .filter((opt) => opt !== fb.status)
                          .map((opt) => (
                            <button
                              key={opt}
                              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                opt === "ACTIVE"
                                  ? "text-green-800"
                                  : "text-red-800"
                              }`}
                              // onClick={() => handleChangeStatus(fb, opt)} // TODO: implement
                            >
                              {opt}
                            </button>
                          ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
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
