import React, { useState } from "react";
import { useGetFeedbackList } from "../../api/FeedbackEndPoint";

// Hàm render rating dạng ngôi sao
function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? "#fbbf24" : "#d1d5db" }}>
        ★
      </span>
    );
  }
  return stars;
}

const FeedbackManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useGetFeedbackList(pageIndex, pageSize);

  if (isLoading) return <div>Loading feedback...</div>;
  if (isError) return <div>Error loading feedback.</div>;

  const feedbacks = data?.items || data?.data?.items || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700">
        Feedback Management
      </h2>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">Comment</th>
              <th className="px-4 py-2 text-center">Rating</th>
              <th className="px-4 py-2 text-center">Phone</th>
              <th className="px-4 py-2 text-center">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {feedbacks.map((fb, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2">
                  {fb.orderDetail?.productName || "-"}
                </td>
                <td className="px-4 py-2">{fb.comment}</td>
                <td className="px-4 py-2 text-center">
                  {renderStars(fb.rating)}
                </td>
                <td className="px-4 py-2 text-center">{fb.phone}</td>
                <td className="px-4 py-2 text-center">{fb.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={pageIndex === 1}
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>Page {pageIndex}</span>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={feedbacks.length < pageSize}
          onClick={() => setPageIndex((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedbackManagement;
