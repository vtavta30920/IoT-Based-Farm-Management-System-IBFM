import React, { useState, useEffect, useRef } from "react";
import {
  useCompletePayment,
  useCreateOrderPayment,
  useGetCurrentUserOrder,
  useUpdateCancelStatus,
} from "../../../api/OrderEndPoint";
import { useQueryClient } from "@tanstack/react-query";
import { FaStar, FaRegStar } from "react-icons/fa";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const statusMap = {
  0: "PAID",
  1: "UNDISCHARGED",
  2: "PENDING",
  5: "DELIVERED",
  4: "COMPLETED",
  3: "CANCELLED",
};

const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => editable && setRating(star)}
          className="focus:outline-none"
          disabled={!editable}
        >
          {star <= rating ? (
            <FaStar className="text-yellow-400 text-lg" />
          ) : (
            <FaRegStar className="text-yellow-400 text-lg" />
          )}
        </button>
      ))}
    </div>
  );
};

const CurrentUserOrderList = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [feedbackData, setFeedbackData] = useState({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentOrderItem, setCurrentOrderItem] = useState(null);
  const [ordersWithFeedback, setOrdersWithFeedback] = useState([]);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [showViewFeedbackModal, setShowViewFeedbackModal] = useState(false);
  const [selectedOrderIdForFeedback, setSelectedOrderIdForFeedback] =
    useState(null);
  const pageSize = 5;

  const { data, isLoading } = useGetCurrentUserOrder(
    pageIndex,
    pageSize,
    selectedStatus
  );
  const cancelOrder = useUpdateCancelStatus();
  const queryClient = useQueryClient();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // "success" | "error"
  });

  const orders = data?.data.items ?? [];
  const totalPagesCount = data?.data.totalPagesCount ?? 1;

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };
  const completePayment = useCompletePayment();
  const createOrderPayment = useCreateOrderPayment();

  // Fetch feedback for each order when data changes
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!data?.data?.items) return;

      const updatedOrders = await Promise.all(
        data.data.items.map(async (order) => {
          if (statusMap[order.status] === "COMPLETED") {
            try {
              const response = await fetch(
                `https://localhost:7067/api/v1/feedback/feedback-by-order/${order.orderId}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              if (response.ok) {
                const feedbackResponse = await response.json();
                return { ...order, feedbacks: feedbackResponse.data || [] };
              }
            } catch (error) {
              console.error("Failed to fetch feedback:", error);
            }
          }
          return { ...order, feedbacks: [] };
        })
      );
      setOrdersWithFeedback(updatedOrders);
    };

    fetchFeedbacks();
  }, [data]);

  const handleFeedbackChange = (orderDetailId, field, value) => {
    setFeedbackData((prev) => ({
      ...prev,
      [orderDetailId]: {
        ...prev[orderDetailId],
        [field]: value,
      },
    }));
  };

  const submitFeedback = async () => {
    try {
      if (!currentOrderItem?.orderDetailId) {
        throw new Error("Invalid order detail ID");
      }

      const feedback = feedbackData[currentOrderItem.orderDetailId];
      if (!feedback || !feedback.rating) {
        throw new Error("Please provide a rating");
      }

      const url = editingFeedback
        ? `https://localhost:7067/api/v1/feedback/update-feedback/${editingFeedback.feedbackId}`
        : `https://localhost:7067/api/v1/feedback/create-feedback`;

      const method = editingFeedback ? "PUT" : "POST";

      const payload = {
        comment: feedback.comment || "",
        rating: feedback.rating,
        orderDetailId: currentOrderItem.orderDetailId,
      };

      if (editingFeedback) {
        payload.feedbackId = editingFeedback.feedbackId;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }

      const feedbackResponse = await response.json();
      const newFeedback = feedbackResponse.data || {
        feedbackId: editingFeedback ? editingFeedback.feedbackId : Date.now(),
        orderDetailId: currentOrderItem.orderDetailId,
        productId: currentOrderItem.productId,
        productName: currentOrderItem.productName,
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: new Date().toISOString(),
        orderDetail: {
          productId: currentOrderItem.productId,
          productName: currentOrderItem.productName,
        },
      };

      // Deep copy to ensure state update triggers re-render
      setOrdersWithFeedback((prev) => {
        const newOrders = JSON.parse(JSON.stringify(prev));
        return newOrders.map((order) => {
          if (order.orderId === currentOrderItem.orderId) {
            const updatedFeedbacks = editingFeedback
              ? order.feedbacks.map((f) =>
                  f.feedbackId === editingFeedback.feedbackId ? newFeedback : f
                )
              : [...(order.feedbacks || []), newFeedback];
            return { ...order, feedbacks: updatedFeedbacks };
          }
          return order;
        });
      });

      setNotification({
        show: true,
        message: editingFeedback
          ? "Feedback updated successfully!"
          : "Feedback submitted successfully!",
        type: "success",
      });

      // Clear feedback form
      setFeedbackData((prev) => {
        const newData = { ...prev };
        delete newData[currentOrderItem.orderDetailId];
        return newData;
      });

      // Invalidate query in the background with a slight delay
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["v1/Order/order-list-by-current-account"],
        });
      }, 100);

      setShowFeedbackModal(false);
      setCurrentOrderItem(null);
      setEditingFeedback(null);
    } catch (error) {
      setNotification({
        show: true,
        message: error.message || "Failed to submit feedback",
        type: "error",
      });
    }
  };

  const handleEditFeedback = (feedback, orderId, order) => {
    // Find the corresponding order item to get productId
    const orderItemIndex = order.orderDetailIds.indexOf(feedback.orderDetailId);
    const orderItem = order.orderItems[orderItemIndex] || {};

    setEditingFeedback(feedback);
    setCurrentOrderItem({
      productName: feedback.orderDetail.productName,
      orderDetailId: feedback.orderDetailId,
      orderId,
      productId: orderItem.productId,
    });
    setFeedbackData((prev) => ({
      ...prev,
      [feedback.orderDetailId]: {
        rating: feedback.rating,
        comment: feedback.comment || "",
      },
    }));
    setShowFeedbackModal(true);
  };

  // Auto cancel PENDING orders after 5 minutes if status doesn't change
  const pendingTimers = useRef({});

  useEffect(() => {
    Object.values(pendingTimers.current).forEach(clearTimeout);
    pendingTimers.current = {};

    orders.forEach((order) => {
      const status = statusMap[order.status];
      if (status === "PENDING") {
        if (!pendingTimers.current[order.orderId]) {
          pendingTimers.current[order.orderId] = setTimeout(async () => {
            let success = false;
            try {
              await cancelOrder.mutateAsync(order.orderId);
              queryClient.invalidateQueries({
                queryKey: ["v1/Order/order-list-by-current-account"],
              });
              success = true;
            } catch (err) {
              success = false;
            }
            setNotification({
              show: true,
              message: success
                ? "Order was automatically cancelled after 5 minutes of pending status."
                : "Failed to auto-cancel order after timeout.",
              type: success ? "success" : "error",
            });
          }, 5 * 60 * 1000); // 5 minutes
        }
      }
    });

    return () => {
      Object.values(pendingTimers.current).forEach(clearTimeout);
      pendingTimers.current = {};
    };
  }, [orders, cancelOrder, queryClient]);

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

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Your Order History
      </h1>

      {/* Status filter dropdown */}
      <div className="mb-4 flex justify-end">
        <div className="flex items-center">
          <label htmlFor="status" className="mr-2 text-gray-600 font-medium">
            Sort by Status:
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPageIndex(1);
            }}
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">All</option>
            <option value="PAID">Paid</option>
            <option value="UNDISCHARGED">Undischarged</option>
            <option value="PENDING">Pending</option>
            <option value="DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order list */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No Orders Found
          </div>
        ) : (
          orders.map((order, index) => {
            const status = statusMap[order.status];
            const isGreen =
              status === "PAID" ||
              status === "DELIVERED" ||
              status === "COMPLETED";
            const isRed = status === "UNDISCHARGED" || status === "CANCELLED";
            const bgColor = isGreen
              ? "bg-green-100 border-green-400"
              : isRed
              ? "bg-red-100 border-red-400"
              : "bg-yellow-100 border-yellow-400";

            const canCancel = status === "UNDISCHARGED" || status === "PENDING";
            const canFeedback = status === "COMPLETED";

            const orderWithFeedback = ordersWithFeedback.find(
              (o) => o.orderId === order.orderId
            );
            const feedbacks = orderWithFeedback?.feedbacks || [];

            return (
              <div
                key={index}
                className={`border rounded-md shadow-sm ${bgColor}`}
              >
                <div
                  className="cursor-pointer hover:bg-opacity-50"
                  onClick={() => toggleExpand(index)}
                >
                  <table className="w-full table-fixed border border-gray-300 text-sm mb-2">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border-r border-gray-300 w-1/6 text-center">
                          Order Date
                        </th>
                        <th className="p-2 border-r border-gray-300 w-1/6 text-center">
                          Total
                        </th>
                        <th className="p-2 border-r border-gray-300 w-1/6 text-center">
                          Status
                        </th>
                        <th className="p-2 border-r border-gray-300 text-center">
                          Address
                        </th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-t text-center">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2 border-t text-center">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="p-2 border-t text-center">
                          <span
                            className={`font-semibold ${
                              isGreen
                                ? "text-green-600"
                                : isRed
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="p-2 border-t text-center">
                          {order.shippingAddress}
                        </td>
                        <td className="p-2 border-t text-center">
                          {canCancel ? (
                            <div className="flex justify-center gap-2">
                              <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrderId(order.orderId);
                                  setShowModal(true);
                                }}
                              >
                                Cancel
                              </button>
                              {(status === "UNDISCHARGED" ||
                                status === "PENDING") && (
                                <button
                                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      const result =
                                        await createOrderPayment.mutateAsync(
                                          order.orderId
                                        );
                                      if (result.data?.paymentUrl) {
                                        window.location.href =
                                          result.data.paymentUrl;
                                      } else {
                                        setNotification({
                                          show: true,
                                          message: "Payment URL not received",
                                          type: "error",
                                        });
                                      }
                                    } catch (error) {
                                      setNotification({
                                        show: true,
                                        message:
                                          error.response?.data?.message ||
                                          "Failed to initiate payment",
                                        type: "error",
                                      });
                                    }
                                  }}
                                  disabled={createOrderPayment.isLoading}
                                >
                                  {createOrderPayment.isLoading
                                    ? "Processing..."
                                    : "Pay Now"}
                                </button>
                              )}
                            </div>
                          ) : canFeedback ? (
                            <button
                              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(index);
                              }}
                            >
                              Leave Feedback
                            </button>
                          ) : (
                            <span className="inline-block px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed select-none">
                              None
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Order details */}
                {expandedIndex === index && (
                  <div className="px-4 py-2 bg-white rounded-b-md">
                    <h2 className="font-semibold text-sm mb-2">
                      Order Details
                    </h2>
                    <div className="grid grid-cols-5 font-semibold text-gray-700 border-b border-gray-300 pb-1 text-sm text-center">
                      <span>Product Name</span>
                      <span>Price</span>
                      <span>Quantity</span>
                      <span>Feedback</span>
                      <span>Action</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {order.orderItems.map((item, i) => {
                        const orderDetailId = order.orderDetailIds[i];
                        const existingFeedback = feedbacks.find(
                          (f) => f.orderDetailId === orderDetailId
                        );

                        return (
                          <li
                            key={i}
                            className="grid grid-cols-5 justify-between border-b border-gray-200 pb-1 text-center items-center"
                          >
                            <span>{item.productName}</span>
                            <span>{formatCurrency(item.price)}</span>
                            <span>{item.stockQuantity}</span>
                            <span>
                              {existingFeedback ? (
                                <div className="flex flex-col items-center">
                                  <StarRating
                                    rating={existingFeedback.rating}
                                  />
                                  {existingFeedback.comment && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      "{existingFeedback.comment}"
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  {status === "COMPLETED"
                                    ? "No feedback"
                                    : "N/A"}
                                </span>
                              )}
                            </span>
                            <span>
                              {status === "COMPLETED" && (
                                <div className="flex justify-center gap-1">
                                  {existingFeedback ? (
                                    <>
                                      <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedOrderIdForFeedback(
                                            order.orderId
                                          );
                                          setShowViewFeedbackModal(true);
                                        }}
                                      >
                                        View
                                      </button>
                                      <button
                                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditFeedback(
                                            existingFeedback,
                                            order.orderId,
                                            order
                                          );
                                        }}
                                      >
                                        Edit
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentOrderItem({
                                          ...item,
                                          orderDetailId,
                                          orderId: order.orderId,
                                          productId: item.productId,
                                        });
                                        setShowFeedbackModal(true);
                                      }}
                                    >
                                      Rate
                                    </button>
                                  )}
                                </div>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && currentOrderItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {editingFeedback ? "Edit Feedback" : "Leave Feedback"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Product: {currentOrderItem.productName}
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Rating:
              </label>
              <StarRating
                rating={
                  feedbackData[currentOrderItem.orderDetailId]?.rating || 0
                }
                setRating={(rating) =>
                  handleFeedbackChange(
                    currentOrderItem.orderDetailId,
                    "rating",
                    rating
                  )
                }
                editable={true}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Comment:
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                value={
                  feedbackData[currentOrderItem.orderDetailId]?.comment || ""
                }
                onChange={(e) =>
                  handleFeedbackChange(
                    currentOrderItem.orderDetailId,
                    "comment",
                    e.target.value
                  )
                }
                placeholder="Share your experience with this product..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setCurrentOrderItem(null);
                  setEditingFeedback(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                onClick={submitFeedback}
              >
                {editingFeedback ? "Update Feedback" : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Feedback Modal */}
      {showViewFeedbackModal && selectedOrderIdForFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Feedback Details
            </h2>
            <div className="space-y-4">
              {ordersWithFeedback
                .find((order) => order.orderId === selectedOrderIdForFeedback)
                ?.feedbacks.map((feedback) => (
                  <div key={feedback.feedbackId} className="border-b pb-4 mb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">
                        {feedback.orderDetail.productName}
                      </h3>
                      <StarRating rating={feedback.rating} />
                    </div>
                    <p className="text-gray-600 mt-2">{feedback.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Submitted on:{" "}
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )) || (
                <div className="text-center text-gray-500">No feedback</div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowViewFeedbackModal(false);
                  setSelectedOrderIdForFeedback(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Confirm Cancel
            </h2>
            <p className="mb-6 text-center">
              Are you sure you want to <b>cancel</b> this order?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  let success = false;
                  try {
                    await cancelOrder.mutateAsync(selectedOrderId);
                    queryClient.invalidateQueries({
                      queryKey: ["v1/Order/order-list-by-current-account"],
                    });
                    success = true;
                  } catch (err) {
                    success = false;
                  }
                  setShowModal(false);
                  setNotification({
                    show: true,
                    message: success
                      ? "Order cancelled successfully!"
                      : "Failed to cancel order!",
                    type: success ? "success" : "error",
                  });
                  if (success && orders.length === 1) {
                    setSelectedStatus("");
                    setPageIndex(1);
                  }
                }}
                disabled={cancelOrder.isLoading}
              >
                {cancelOrder.isLoading ? "Processing..." : "Confirm"}
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
                disabled={cancelOrder.isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={pageIndex === 1}
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageIndex} / {totalPagesCount}
        </span>
        <button
          disabled={pageIndex === totalPagesCount}
          onClick={() => setPageIndex((prev) => prev + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CurrentUserOrderList;
