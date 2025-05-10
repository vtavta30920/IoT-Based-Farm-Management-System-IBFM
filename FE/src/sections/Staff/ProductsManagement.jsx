import React, { useState } from "react";
import {
  useGetAllProducts,
  useGetProductById,
  useCreateProduct,
} from "../../api/ProductEndPoint";
import defaultAvatar from "../../assets/avatardefault.jpg";
import ProductDetailModal from "./ProductDetailModal";
import CreateProductModal from "./CreateProductModal";

const ProductsManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortByStockAsc, setSortByStockAsc] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { mutate: createProduct, isLoading: isCreating } = useCreateProduct();

  const handleCreateProduct = (productData) => {
    createProduct(productData, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
      },
    });
  };

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

  const { data: productDetailData, isLoading: isLoadingDetail } =
    useGetProductById(selectedProductId);

  const products = data?.data?.items || [];
  const totalPagesCount = data?.data?.totalPagesCount || 1;

  const selectedProduct = productDetailData?.data;

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Product Management
      </h1>

      {/* Filter + Sort + Create */}
      <div className="flex justify-end mb-6 gap-4">
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
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create
        </button>
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
              className={`border ${cardColor} shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
              onClick={() => handleProductClick(product.productId)}
            >
              <div className="flex flex-col items-center">
                {/* Image on Top */}
                <img
                  src={product.images || defaultAvatar}
                  alt={product.productName}
                  className="w-40 h-40 object-cover rounded-lg mb-3"
                />

                {/* Product Name */}
                <h3 className="text-lg font-semibold">{product.productName}</h3>
                <p className="text-sm text-gray-700">
                  Stock: {product.stockQuantity}
                </p>
                {/* Status */}
                <p className="text-sm text-gray-700">
                  Status:{" "}
                  <span
                    className={isActive ? "text-green-600" : "text-red-600"}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </p>

                {/* Information Below */}
                <div className="flex flex-col items-start w-full mt-3">
                  {/* Stock Warning (Low Stock) */}
                  {product.stockQuantity < 100 ? (
                    <div className="flex items-center justify-between w-full bg-yellow-100 text-yellow-800 border border-yellow-400 px-3 py-2 rounded-md shadow animate-pulse mt-3">
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
                      <span className="font-medium text-xs">Low Stock!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full bg-blue-200 text-blue-800 border border-blue-400 px-3 py-2 rounded-md shadow-lg mt-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-800"
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
                      <span className="font-medium text-xs">Stock Normal</span>
                    </div>
                  )}
                </div>
              </div>
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

      {isModalOpen && selectedProduct && !isLoadingDetail && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <CreateProductModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProduct}
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
};

export default ProductsManagement;
