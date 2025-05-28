import React, { useState, useContext, useMemo } from "react";
import { useGetAllOrder, useGetOrdersByEmail } from "../../api/OrderEndPoint";
import { UserContext } from "../../contexts/UserContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  CategoryScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
  CategoryScale
);

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

function getDaysInMonth(year, month) {
  const days = [];
  const lastDay = new Date(year, month, 0).getDate();
  for (let d = 1; d <= lastDay; d++) {
    days.push(
      `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );
  }
  return days;
}

const OrdersManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const pageSize = 5;

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchPageIndex, setSearchPageIndex] = useState(1);
  const searchPageSize = 5;

  const { token } = useContext(UserContext);

  const { data: allOrderData } = useGetAllOrder(1, 10000, undefined);
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

  const revenueLineData = useMemo(() => {
    const items = allOrderData?.data?.items;
    if (!items) return { labels: [], datasets: [] };

    const filtered = items.filter((order) => {
      const date = new Date(order.createdAt);
      return (
        date.getFullYear() === Number(selectedYear) &&
        date.getMonth() + 1 === Number(selectedMonth) &&
        order.status === 8 // COMPLETED
      );
    });

    const dateMap = {};
    filtered.forEach((order) => {
      const date = new Date(order.createdAt);
      const dateStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (!dateMap[dateStr]) dateMap[dateStr] = 0;
      dateMap[dateStr] += order.totalPrice;
    });

    const days = getDaysInMonth(selectedYear, selectedMonth);
    const values = days.map((d) => dateMap[d] || 0);

    return {
      labels: days,
      datasets: [
        {
          label: "Revenue by Day",
          data: values,
          fill: false,
          borderColor: "rgba(34,197,94,1)",
          backgroundColor: "rgba(34,197,94,0.2)",
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: "rgba(34,197,94,1)",
        },
      ],
    };
  }, [allOrderData, selectedMonth, selectedYear]);

  const revenueLineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Revenue: ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Date" },
        type: "category",
        ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 },
      },
      y: {
        title: { display: true, text: "Revenue (VND)" },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return formatCurrency(value);
          },
        },
      },
    },
    maintainAspectRatio: false,
    elements: { point: { radius: 3 } },
    layout: { padding: 0 },
  };

  const { totalRevenue, paidOrderCount } = useMemo(() => {
    const items = allOrderData?.data?.items;
    if (!items) return { totalRevenue: 0, paidOrderCount: 0 };

    let total = 0;
    let count = 0;
    items.forEach((order) => {
      const date = new Date(order.createdAt);
      if (
        date.getFullYear() === Number(selectedYear) &&
        date.getMonth() + 1 === Number(selectedMonth) &&
        order.status === 8 // COMPLETED
      ) {
        total += order.totalPrice;
        count += 1;
      }
    });
    return { totalRevenue: total, paidOrderCount: count };
  }, [allOrderData, selectedMonth, selectedYear]);

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

  const items = data?.data?.items || [];
  const totalPagesCount = data?.data?.totalPagesCount || 1;

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPageIndex(1);
  };

  const yearOptions = [];
  for (let y = now.getFullYear(); y >= now.getFullYear() - 5; y--) {
    yearOptions.push(y);
  }
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

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

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Manager Dashboard
      </h1>

      <div className="flex flex-wrap gap-4 mb-4 items-center justify-center">
        <label className="font-medium">Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {monthOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <label className="font-medium">Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-8 mb-4 items-center justify-center">
        <div className="bg-green-100 border border-green-400 rounded-lg px-6 py-4 text-center shadow">
          <div className="text-lg font-semibold text-green-700">
            Total Revenue In Month
          </div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {formatCurrency(totalRevenue)}
          </div>
        </div>
        <div className="bg-blue-100 border border-blue-400 rounded-lg px-6 py-4 text-center shadow">
          <div className="text-lg font-semibold text-blue-700">
            Completed Orders
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {paidOrderCount}
          </div>
        </div>
      </div>

      <div className="mb-8 bg-white rounded shadow p-4 flex justify-center items-center">
        <div style={{ width: 700, height: 250, maxWidth: "100%" }}>
          <h2 className="text-lg font-semibold mb-2 text-green-700 text-center">
            Revenue by Day
          </h2>
          <Line
            data={{
              ...revenueLineData,
              labels: revenueLineData.labels.map((dateStr) => {
                const parts = dateStr.split("-");
                return parts[2];
              }),
            }}
            options={{
              ...revenueLineOptions,
              maintainAspectRatio: false,
              elements: { point: { radius: 3 } },
              layout: { padding: { left: 0, right: 0 } },
              plugins: {
                ...revenueLineOptions.plugins,
                legend: { display: false },
              },
              scales: {
                ...revenueLineOptions.scales,
                x: {
                  ...revenueLineOptions.scales.x,
                  type: "category",
                  title: { display: true, text: "Day" },
                  ticks: {
                    ...revenueLineOptions.scales.x.ticks,
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                  },
                },
                y: {
                  ...revenueLineOptions.scales.y,
                  ticks: {
                    callback: function (value) {
                      return formatCurrency(value);
                    },
                  },
                },
              },
            }}
            height={250}
            width={700}
          />
        </div>
      </div>

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
          <div className="text-center text-gray-500 py-8 text-lg font-semibold">
            No order found.
          </div>
        ) : (
          displayOrders.map((order, index) => {
            const status = statusMap[order.status];
            // Đổi màu theo statusMap
            let bgColor, textColor;
            switch (status) {
              case "PAID":
                bgColor = "bg-blue-100 border-blue-400";
                textColor = "text-blue-600";
                break;
              case "UNDISCHARGED":
                bgColor = "bg-yellow-100 border-yellow-400";
                textColor = "text-yellow-600";
                break;
              case "PENDING":
                bgColor = "bg-orange-100 border-orange-400";
                textColor = "text-orange-600";
                break;
              case "DELIVERED":
                bgColor = "bg-purple-100 border-purple-400";
                textColor = "text-purple-600";
                break;
              case "COMPLETED":
                bgColor = "bg-green-100 border-green-400";
                textColor = "text-green-600";
                break;
              case "CANCELLED":
                bgColor = "bg-red-100 border-red-400";
                textColor = "text-red-600";
                break;
              default:
                bgColor = "bg-gray-100 border-gray-400";
                textColor = "text-gray-600";
            }

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
                          <span className={`font-semibold ${textColor}`}>
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

export default OrdersManagement;
