import React, { useState, useContext } from "react";
import {
  useGetAllOrder,
  useGetOrdersByEmail,
  useUpdateDeliveryStatus,
  useUpdateCompleteStatus, // Thêm hook này
} from "../../api/OrderEndPoint";
import { UserContext } from "../../contexts/UserContext";
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

const OrderManagementStaff = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const pageSize = 5;

  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchPageIndex, setSearchPageIndex] = useState(1);
  const searchPageSize = 5;

  const { token } = useContext(UserContext);

  const { data, isLoading, isError } = useGetAllOrder(
    pageIndex,
    pageSize,
    statusFilter
  );

  // Convert statusFilter to correct value for API (number or string)
  let searchStatus = statusFilter;
  if (searchStatus === "PAID") searchStatus = 0;
  else if (searchStatus === "UNDISCHARGED") searchStatus = 1;
  else if (searchStatus === "PENDING") searchStatus = 2;
  else if (searchStatus === "DELIVERED") searchStatus = 5;
  else if (searchStatus === "COMPLETED") searchStatus = 4;
  else if (searchStatus === "CANCELLED") searchStatus = 3;
  else if (searchStatus === "") searchStatus = undefined;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useGetOrdersByEmail(
    searchEmail,
    searchPageIndex,
    searchPageSize,
    searching,
    searchStatus
  );

  const { items, totalPagesCount } = data?.data ?? {
    items: [],
    totalPagesCount: 1,
  };

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPageIndex(1);
  };

  // Lấy danh sách order để hiển thị (ưu tiên kết quả search)
  let displayOrders = items;
  let displayTotalPages = totalPagesCount;
  let displayPageIndex = pageIndex;
  let setDisplayPageIndex = setPageIndex;

  if (searching && searchEmail) {
    if (Array.isArray(searchData?.data)) {
      displayOrders = searchData.data;
      displayTotalPages = 1;
    } else if (Array.isArray(searchData?.data?.items)) {
      displayOrders = searchData.data.items;
      displayTotalPages = searchData.data.totalPagesCount || 1;
    } else {
      displayOrders = [];
      displayTotalPages = 1;
    }
    displayPageIndex = searchPageIndex;
    setDisplayPageIndex = setSearchPageIndex;
  }

  const handleSearchOrderByEmail = (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchPageIndex(1);
  };

  const handleClearSearch = () => {
    setSearchEmail("");
    setSearching(false);
    setSearchPageIndex(1);
  };

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalType, setModalType] = useState(""); // "DELIVER" hoặc "COMPLETE"

  const updateDeliveryStatus = useUpdateDeliveryStatus();
  const updateCompleteStatus = useUpdateCompleteStatus();
  const queryClient = useQueryClient();

  // Notification modal state
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // "success" | "error"
  });

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

      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Order Management
      </h1>

      <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
        <form
          className="flex items-center gap-2"
          onSubmit={handleSearchOrderByEmail}
        >
          <input
            type="text"
            placeholder="Search by customer email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={isSearchLoading || !searchEmail}
          >
            {isSearchLoading ? "Searching..." : "Search"}
          </button>
          {searching && (
            <button
              type="button"
              className="ml-2 bg-gray-400 text-white px-3 py-2 rounded"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}
        </form>
        <div className="flex items-center">
          <label htmlFor="status" className="mr-2 text-gray-600 font-medium">
            Sort by Status:
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={handleStatusChange}
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

      <div className="flex-1 overflow-y-auto space-y-4">
        {displayOrders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No Orders Found
          </div>
        ) : (
          displayOrders.map((order, index) => {
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

            return (
              <div
                key={order.orderId || index}
                className={`border rounded-md shadow-sm ${bgColor}`}
              >
                <div
                  className="cursor-pointer hover:bg-opacity-50"
                  onClick={() => toggleExpand(index)}
                >
                  <table className="w-full table-fixed border border-gray-300 text-sm mb-2">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border-r w-1/6 text-center">
                          Customer
                        </th>
                        <th className="p-2 border-r w-1/6 text-center">
                          Order Date
                        </th>
                        <th className="p-2 border-r w-1/6 text-center">
                          Total
                        </th>
                        <th className="p-2 border-r w-1/6 text-center">
                          Status
                        </th>
                        <th className="p-2 text-center">Address</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-t text-center">
                          {order.email}
                        </td>
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
                          {/* Nút Deliver cho PAID, Nút Complete cho DELIVERED */}
                          {status === "PAID" ? (
                            <button
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderId(order.orderId);
                                setModalType("DELIVER");
                                setShowModal(true);
                              }}
                            >
                              Deliver
                            </button>
                          ) : status === "DELIVERED" ? (
                            <button
                              className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrderId(order.orderId);
                                setModalType("COMPLETE");
                                setShowModal(true);
                              }}
                            >
                              Complete
                            </button>
                          ) : (
                            // Nút tượng trưng cho các status khác
                            <span className="inline-block px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed select-none">
                              None
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

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
                          className="grid grid-cols-3 border-b border-gray-200 pb-1 text-center"
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

      {/* Modal xác nhận đổi trạng thái */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              {modalType === "DELIVER"
                ? "Confirm Delivery"
                : "Confirm Complete"}
            </h2>
            <p className="mb-6 text-center">
              {modalType === "DELIVER" ? (
                <>
                  Are you sure you want to change status to <b>DELIVERED</b>?
                </>
              ) : (
                <>
                  Are you sure you want to change status to <b>COMPLETED</b>?
                </>
              )}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  let success = false;
                  try {
                    if (modalType === "DELIVER") {
                      await updateDeliveryStatus.mutateAsync(selectedOrderId);
                    } else if (modalType === "COMPLETE") {
                      await updateCompleteStatus.mutateAsync(selectedOrderId);
                    }
                    // Làm mới danh sách order và danh sách search (nếu có)
                    queryClient.invalidateQueries({
                      queryKey: ["v1/Order/order-list"],
                    });
                    queryClient.invalidateQueries({
                      queryKey: ["v1/Order/order-list-by-emal"],
                    });
                    success = true;
                  } catch (err) {
                    success = false;
                  }
                  setShowModal(false);
                  setNotification({
                    show: true,
                    message: success
                      ? "Order status updated successfully!"
                      : "Failed to update order status!",
                    type: success ? "success" : "error",
                  });
                  if (success) {
                    // Nếu chỉ có 1 order đang hiển thị (tức là sau khi đổi status thì list sẽ rỗng)
                    if (displayOrders.length === 1) {
                      setStatusFilter("");
                      setPageIndex(1);
                      setSearching(false);
                      setSearchEmail("");
                      setSearchPageIndex(1);
                    }
                    setTimeout(() => {
                      setNotification((prev) =>
                        prev.show ? { ...prev, show: false } : prev
                      );
                    }, 2000);
                  }
                }}
                disabled={
                  modalType === "DELIVER"
                    ? updateDeliveryStatus.isLoading
                    : updateCompleteStatus.isLoading
                }
              >
                {(
                  modalType === "DELIVER"
                    ? updateDeliveryStatus.isLoading
                    : updateCompleteStatus.isLoading
                )
                  ? "Processing..."
                  : "Confirm"}
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
                disabled={
                  modalType === "DELIVER"
                    ? updateDeliveryStatus.isLoading
                    : updateCompleteStatus.isLoading
                }
              >
                Cancel
              </button>
            </div>
            {modalType === "DELIVER" && updateDeliveryStatus.isError && (
              <div className="text-red-500 text-center mt-2">
                Failed to update status!
              </div>
            )}
            {modalType === "COMPLETE" && updateCompleteStatus.isError && (
              <div className="text-red-500 text-center mt-2">
                Failed to update status!
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={displayPageIndex === 1}
          onClick={() => setDisplayPageIndex((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {displayPageIndex} / {displayTotalPages}
        </span>
        <button
          disabled={displayPageIndex === displayTotalPages}
          onClick={() => setDisplayPageIndex((prev) => prev + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderManagementStaff;
