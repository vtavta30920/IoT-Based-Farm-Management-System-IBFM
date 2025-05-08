import React, { useState } from "react";
import { useGetAllProducts } from "../../api/ProductEndPoint";
import defaultAvatar from "../../assets/avatardefault.jpg";

const ProductsManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortByStockAsc, setSortByStockAsc] = useState(true);
  const pageSize = 6;
  const categoryId = null;

  const statusValue =
    statusFilter === "" ? undefined : parseInt(statusFilter, 10);

  const { data, isLoading, isError } = useGetAllProducts(
    pageIndex,
    pageSize,
    statusValue,
    categoryId,
    sortByStockAsc,
    true
  );

  if (isLoading)
    return <div className="text-center mt-10">Loading products...</div>;
  if (isError)
    return (
      <div className="text-center mt-10 text-red-500">Failed to load data.</div>
    );

  const products = data?.data?.items || [];
  const totalPagesCount = data?.data?.totalPagesCount || 1;

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Product Management
      </h1>

      {/* Filter + Sort */}
      <div className="flex justify-end mb-6 gap-4">
        {/* Filters Section */}
        <div className="flex gap-4">
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

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {products.map((product) => {
          const isActive = product.status === 1;
          const cardColor = isActive
            ? "bg-green-100 border-green-400"
            : "bg-red-100 border-red-400";

          return (
            <div
              key={product.productId}
              className={`border ${cardColor} shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200`}
            >
              <img
                src={product.images || defaultAvatar}
                alt={product.productName}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold">{product.productName}</h3>
              <p className="text-sm text-gray-700">
                Stock quantity: {product.stockQuantity}
              </p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span className={isActive ? "text-green-600" : "text-red-600"}>
                  {isActive ? "Active" : "Inactive"}
                </span>
              </p>
              {/* Warning Icon for low stock */}
              {product.stockQuantity < 100 && (
                <div className="mt-3 flex items-center gap-2 bg-yellow-100 text-yellow-800 border border-yellow-400 px-3 py-2 rounded shadow animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M4.293 17.707A1 1 0 015 17h14a1 1 0 01.707 1.707l-7 7a1 1 0 01-1.414 0l-7-7z"
                    />
                  </svg>
                  <span className="font-medium">Low Stock!</span>
                </div>
              )}
            </div>
          );
        })}
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

export default ProductsManagement;
