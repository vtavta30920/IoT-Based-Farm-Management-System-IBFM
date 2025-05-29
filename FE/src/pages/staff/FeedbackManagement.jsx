import React, { useState } from "react";
import { useGetAllProducts } from "../../api/ProductEndPoint";
import defaultAvatar from "../../assets/avatardefault.jpg";
import { useNavigate } from "react-router-dom";

const ProductsFeedbackManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortByStockAsc, setSortByStockAsc] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 6;
  const navigate = useNavigate();

  const statusValue =
    statusFilter === "" ? undefined : parseInt(statusFilter, 10);

  // Lấy danh sách sản phẩm theo search/filter/sort
  const {
    data: allData,
    isLoading,
    isError,
  } = useGetAllProducts(
    pageIndex,
    pageSize,
    statusValue,
    null,
    sortByStockAsc,
    true
  );

  // Nếu có searchTerm thì lọc sản phẩm theo tên
  const products =
    searchTerm && allData?.data?.items
      ? allData.data.items.filter((p) =>
          p.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allData?.data?.items || [];

  const totalPages = allData?.data?.totalPagesCount || 1;

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        Feedback Management
      </h1>

      {/* Search + Filter + Sort */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Search Input & Button */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value.trim() === "") setSearchTerm("");
            }}
            className="border border-gray-300 rounded px-4 py-2 w-64"
          />
          <button
            onClick={() => {
              setSearchTerm(searchValue);
              setPageIndex(1);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
        {/* Filter & Sort */}
        <div className="flex gap-3 flex-wrap items-center">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageIndex(1);
            }}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <button
            onClick={() => {
              setSortByStockAsc((prev) => !prev);
              setPageIndex(1);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Sort Stock: {sortByStockAsc ? "Ascending ↑" : "Descending ↓"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-10">
            Loading products...
          </div>
        ) : isError ? (
          <div className="col-span-3 text-center text-red-600 py-10">
            Error loading products.
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 py-10">
            No products found.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.productId}
              className="border bg-gray-50 shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col items-center"
              onClick={() =>
                navigate(`/staff/feedback/product/${product.productId}`)
              }
            >
              <img
                src={product.images || defaultAvatar}
                alt={product.productName}
                className="w-32 h-32 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-center">
                {product.productName}
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                Stock: {product.stockQuantity}
              </p>
              <p className="text-sm text-gray-700">
                Status:{" "}
                <span
                  className={
                    product.status === 1 ? "text-green-600" : "text-red-600"
                  }
                >
                  {product.status === 1 ? "Active" : "Inactive"}
                </span>
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/staff/feedback/product/${product.productId}`);
                }}
              >
                View Feedback
              </button>
            </div>
          ))
        )}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-auto bg-white p-4 shadow-lg">
        <button
          disabled={pageIndex === 1}
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageIndex} / {totalPages}
        </span>
        <button
          disabled={pageIndex === totalPages}
          onClick={() => setPageIndex((prev) => prev + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsFeedbackManagement;
