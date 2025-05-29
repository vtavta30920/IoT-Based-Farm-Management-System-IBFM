import React, { useState, useEffect, useRef } from "react";
import {
  useCompletePayment,
  useCreateOrderPayment,
  useGetCurrentUserOrder,
  useUpdateCancelStatus,
} from "../../../api/OrderEndPoint";
import { UserContext } from "../../../contexts/UserContext";
import { useQueryClient } from "@tanstack/react-query";

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

const CurrentUserOrderList = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // trạng thái lọc
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

  // Timer refs để lưu timeout cho từng order
  const pendingTimers = useRef({});

  // Tự động cancel order PENDING sau 5 phút nếu không đổi trạng thái
  useEffect(() => {
    // Xóa hết timer cũ trước khi set lại
    Object.values(pendingTimers.current).forEach(clearTimeout);
    pendingTimers.current = {};

    orders.forEach((order) => {
      const status = statusMap[order.status];
      if (status === "PENDING") {
        // Nếu order chưa có timer thì set timer
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
                ? "Order was automatically cancelled after 1 minutes of pending status."
                : "Failed to auto-cancel order after timeout.",
              type: success ? "success" : "error",
            });
          }, 1 * 60 * 1000); // 5 phút
        }
      }
    });

    // Cleanup khi unmount hoặc orders thay đổi
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

      {/* Dropdown lọc theo trạng thái */}
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
              setPageIndex(1); // Reset về trang đầu khi lọc
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

      {/* Danh sách đơn hàng */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No Orders Found
          </div>
        ) : (
          orders.map((order, index) => {
            const status = statusMap[order.status];
            // Cập nhật logic màu sắc
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

            // Determine if cancel button should show
            const canCancel = status === "UNDISCHARGED" || status === "PENDING";

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
                                        // Redirect to the payment URL
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

                {/* Chi tiết đơn hàng */}
                {expandedIndex === index && (
                  <div className="px-4 py-2 bg-white rounded-b-md">
                    <h2 className="font-semibold text-sm mb-2">
                      Order Details
                    </h2>
                    <div className="grid grid-cols-3 font-semibold text-gray-700 border-b border-gray-300 pb-1 text-sm text-center">
                      <span>Product Name</span>
                      <span>Price</span>
                      <span>Quantity</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {order.orderItems.map((item, i) => (
                        <li
                          key={i}
                          className="grid grid-cols-3 justify-between border-b border-gray-200 pb-1 text-center"
                        >
                          <span>{item.productName}</span>
                          <span>{formatCurrency(item.price)}</span>
                          <span>{item.stockQuantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal xác nhận hủy đơn */}
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
                    // Refetch order list after cancel
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
                  if (success) {
                    // Nếu chỉ còn 1 order đang hiển thị (sau khi cancel sẽ rỗng)
                    if (orders.length === 1) {
                      setSelectedStatus("");
                      setPageIndex(1);
                    }
                    setTimeout(() => {
                      setNotification((prev) =>
                        prev.show ? { ...prev, show: false } : prev
                      );
                    }, 2000);
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
            {cancelOrder.isError && (
              <div className="text-red-500 text-center mt-2">
                Failed to cancel order!
              </div>
            )}
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
