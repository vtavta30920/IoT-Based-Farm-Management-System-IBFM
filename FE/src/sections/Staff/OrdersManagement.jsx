import React, { useState, useContext } from "react";
import { useGetAllOrder } from "../../api/OrderEndPoint";
import { UserContext } from "../../contexts/UserContext";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const statusMap = {
  4: "PAID",
  5: "UNDISCHARGED",
  6: "PENDING",
};

const OrdersManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState(null); // toggle chi tiết
  const pageSize = 5;

  const { token } = useContext(UserContext);
  const { data, isLoading, isError } = useGetAllOrder(pageIndex, pageSize);

  if (isLoading) {
    return <div className="p-6 bg-white">Loading...</div>;
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-red-500 bg-white">Failed to load orders.</div>
    );
  }

  const { items, totalPagesCount } = data.data;

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Order Management
      </h1>

      {/* Danh sách order - fixed height */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {items.map((order, index) => {
          const status = statusMap[order.status];
          const bgColor =
            status === "PAID"
              ? "bg-green-100 border-green-400"
              : status === "UNDISCHARGED"
              ? "bg-red-100 border-red-400"
              : "bg-yellow-100 border-yellow-400";

          return (
            <div
              key={index}
              className={`border rounded-md shadow-sm ${bgColor}`}
            >
              {/* Bảng tổng quát - click để toggle */}
              <div
                className="cursor-pointer hover:bg-opacity-50"
                onClick={() => toggleExpand(index)}
              >
                <table className="w-full table-fixed border border-gray-300 text-sm mb-2">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border-r border-gray-300 w-1/6 text-center">
                        Customer
                      </th>
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
                            status === "PAID"
                              ? "text-green-600"
                              : status === "UNDISCHARGED"
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
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Chi tiết đơn hàng */}
              {expandedIndex === index && (
                <div className="px-4 py-2 bg-white rounded-b-md">
                  <h2 className="font-semibold text-sm mb-2">Order Details</h2>

                  {/* Header chi tiết */}
                  <div className="grid grid-cols-3 font-semibold text-gray-700 border-b border-gray-300 pb-1 text-sm text-center">
                    <span>Product Name</span>
                    <span>Price</span>
                    <span>Quantity</span>
                  </div>

                  {/* Items */}
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
        })}
      </div>

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

export default OrdersManagement;
