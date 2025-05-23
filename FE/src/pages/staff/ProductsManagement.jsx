import React, { useState } from "react";
import {
  useGetAllProducts,
  useGetProductById,
  useCreateProduct,
  useGetProductByName,
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
  const [searchValue, setSearchValue] = useState(""); // gõ ở ô input
  const [searchTerm, setSearchTerm] = useState(""); // dùng để query API
  const [createApiError, setCreateApiError] = useState(""); // Thêm state để nhận lỗi từ CreateProductModal

  const { mutate: createProduct, isLoading: isCreating } = useCreateProduct();

  const handleCreateProduct = (productData, { onError, onSuccess } = {}) => {
    setCreateApiError(""); // Reset lỗi trước khi submit
    createProduct(productData, {
      onSuccess: (data) => {
        // Nếu BE trả về status -1 và message, thì không đóng modal, hiện lỗi
        if (data && data.status === -1 && data.message) {
          setCreateApiError(data.message);
          if (onError) onError({ response: { data } });
          return;
        }
        setCreateApiError("");
        setIsCreateModalOpen(false);
        if (onSuccess) onSuccess(data);
      },
      onError: (err) => {
        // Bắt lỗi trả về từ BE (status -1 hoặc message)
        const status = err?.response?.data?.status;
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Create product failed.";
        if (status === -1 && msg) {
          setCreateApiError(msg);
        } else {
          setCreateApiError(msg);
        }
        if (onError) onError(err);
      },
    });
  };

  const pageSize = 6;
  const categoryId = null;
  const statusValue =
    statusFilter === "" ? undefined : parseInt(statusFilter, 10);

  const {
    data: allData,
    isLoading,
    isError,
  } = useGetAllProducts(
    pageIndex,
    pageSize,
    statusValue,
    categoryId,
    sortByStockAsc,
    true
  );

  const { data: searchData, isLoading: isSearching } =
    useGetProductByName(searchTerm);

  const { data: productDetailData, isLoading: isLoadingDetail } =
    useGetProductById(selectedProductId);

  const searchedProducts = searchData?.data?.items || [];
  const allProducts = allData?.data?.items || [];
  const totalPagesCount = allData?.data?.totalPagesCount || 1;

  const selectedProduct = productDetailData?.data;

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const products = searchTerm ? searchedProducts : allProducts;

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Product Management
      </h1>

      {/* Search + Filter + Sort + Create */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Search Input & Button */}
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              // Nếu input rỗng thì reset searchTerm về ""
              if (e.target.value.trim() === "") {
                setSearchTerm("");
              }
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

        {/* Filter & Sort & Create */}
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

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create
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
              className={`border ${cardColor} shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer`}
              onClick={() => handleProductClick(product.productId)}
            >
              <div className="flex flex-col items-center">
                <img
                  src={product.images || defaultAvatar}
                  alt={product.productName}
                  className="w-40 h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-semibold">{product.productName}</h3>
                <p className="text-sm text-gray-700">
                  Stock: {product.stockQuantity}
                </p>
                <p className="text-sm text-gray-700">
                  Status:{" "}
                  <span
                    className={isActive ? "text-green-600" : "text-red-600"}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </p>

                <div className="flex flex-col items-start w-full mt-3">
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
      {!searchTerm && (
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
      )}

      {isModalOpen && selectedProduct && !isLoadingDetail && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <CreateProductModal
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateApiError("");
          }}
          onSubmit={handleCreateProduct}
          isSubmitting={isCreating}
          apiError={createApiError}
        />
      )}
    </div>
  );
};

export default ProductsManagement;
