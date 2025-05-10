import React, { useState, useEffect } from "react";
import defaultAvatar from "../../assets/avatardefault.jpg";
import { useGetAllCrops } from "../../api/CropEndPoint";
import { useUpdateProductStatus } from "../../api/ProductEndPoint"; // Import API hook
import { useCategories } from "../../api/CategoryEndPoint"; // Import API hook

// Dropdown chọn Crop
const CropDropdown = ({ selectedCropId, onCropChange }) => {
  const { data: crops = [], isLoading } = useGetAllCrops();

  if (isLoading) return <p>Loading crops...</p>;

  return (
    <select
      value={selectedCropId}
      onChange={(e) => onCropChange(Number(e.target.value))}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select a crop</option>
      {crops.map((crop) => (
        <option key={crop.cropId} value={crop.cropId}>
          {crop.cropName}
        </option>
      ))}
    </select>
  );
};

// Modal đổi URL ảnh
const ImageUrlModal = ({ currentImageUrl, onChangeImageUrl, onClose }) => {
  const [newImageUrl, setNewImageUrl] = useState(""); // Mặc định là rỗng

  useEffect(() => {
    // Reset giá trị newImageUrl mỗi khi modal mở (hoặc currentImageUrl thay đổi)
    setNewImageUrl("");
  }, [currentImageUrl]);

  const handleSubmit = () => {
    onChangeImageUrl(newImageUrl);
    onClose(); // Đóng modal sau khi lưu thay đổi
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Change Image URL
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium">New Image URL</label>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSubmit} // Thêm onClick ở đây
            >
              Save
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal xác nhận đổi trạng thái
const ConfirmStatusModal = ({ currentStatus, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Confirm Status Change
        </h2>
        <p className="mb-6">
          Are you sure you want to change the status to{" "}
          <strong>{currentStatus === 1 ? "Inactive" : "Active"}</strong>?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Dropdown chọn danh mục
const CategoryDropdown = ({
  selectedCategoryId,
  onCategoryChange,
  selectedCategoryName,
}) => {
  const { data, isLoading, isError } = useCategories();
  let categories = [];
  if (Array.isArray(data)) {
    categories = data;
  } else if (data && Array.isArray(data.data)) {
    categories = data.data;
  }
  if (isLoading) {
    return (
      <select className="w-full border rounded px-3 py-2" disabled>
        <option>Loading...</option>
      </select>
    );
  }
  if (isError) {
    return (
      <select className="w-full border rounded px-3 py-2" disabled>
        <option>Failed to load categories</option>
      </select>
    );
  }
  if (!categories.length) {
    return (
      <select
        value={selectedCategoryId || ""}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        <option value={selectedCategoryId || ""}>
          {selectedCategoryName || "No categories"}
        </option>
      </select>
    );
  }
  return (
    <select
      value={selectedCategoryId || ""}
      onChange={(e) => onCategoryChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    >
      {categories.map((category) => (
        <option key={category.categoryId} value={String(category.categoryId)}>
          {category.categoryName}
        </option>
      ))}
    </select>
  );
};

// Modal chi tiết sản phẩm
const ProductDetailModal = ({ product, onClose }) => {
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [showConfirmStatusModal, setShowConfirmStatusModal] = useState(false); // State for confirm modal
  const [imageUrl, setImageUrl] = useState(product?.images || defaultAvatar);
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ? String(product.categoryId) : ""
  );
  const [status, setStatus] = useState(product?.status || 0);
  const [name, setName] = useState(product?.productName || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stockQuantity || 0);
  const [description, setDescription] = useState(product?.description || "");
  const [cropId, setCropId] = useState(product?.cropId || "");

  const { mutate: updateStatus, isLoading: isUpdatingStatus } =
    useUpdateProductStatus(); // Use mutation hook

  const handleImageClick = () => setShowImageUrlModal(true);

  const handleStatusClick = () => {
    if (!product?.productId) {
      console.error("Product ID is missing.");
      return;
    }
    setShowConfirmStatusModal(true);
  };

  const handleConfirmStatusChange = () => {
    if (!product?.productId) {
      console.error("Product ID is missing.");
      setShowConfirmStatusModal(false);
      return;
    }

    updateStatus(product.productId, {
      onSuccess: () => {
        setStatus(status === 1 ? 0 : 1); // Update local state on success
        setShowConfirmStatusModal(false);
      },
      onError: (error) => {
        console.error("Failed to update status:", error); // Handle error
        setShowConfirmStatusModal(false);
      },
    });
  };

  const handleSaveChanges = () => {
    const updatedProduct = {
      ...product,
      cropId,
      images: imageUrl,
      categoryId,
      status,
      productName: name,
      price,
      stockQuantity: stock,
      description,
    };

    console.log("Product to save:", updatedProduct);
    // Gửi lên API nếu cần
    onClose();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-50 p-8 rounded-xl shadow-lg w-full max-w-3xl relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
          Product Details
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Ảnh và trạng thái */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <img
              src={imageUrl}
              alt="Product"
              className="w-48 h-48 object-cover rounded cursor-pointer border"
              onClick={handleImageClick}
            />
            <div className="mt-4 w-full">
              {/* Nút trạng thái */}
              <button
                className={`w-full px-4 py-2 rounded font-semibold transition-colors duration-200 ${
                  status === 1
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                onClick={handleStatusClick}
                disabled={isUpdatingStatus} // Disable button while updating
              >
                {isUpdatingStatus
                  ? "Updating..."
                  : status === 1
                  ? "Active"
                  : "Inactive"}
              </button>
            </div>
          </div>

          {/* Right: thông tin sản phẩm */}
          <div className="flex-grow space-y-4">
            <div>
              <label className="block font-medium">Crop</label>
              <CropDropdown selectedCropId={cropId} onCropChange={setCropId} />
            </div>
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium">Category</label>
              <CategoryDropdown
                selectedCategoryId={categoryId}
                selectedCategoryName={product?.categoryName}
                onCategoryChange={(val) => setCategoryId(String(val))}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="bg-gray-600 text-white px-6 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>

        {/* Modal đổi ảnh */}
        {showImageUrlModal && (
          <ImageUrlModal
            currentImageUrl={imageUrl}
            onChangeImageUrl={setImageUrl}
            onClose={() => setShowImageUrlModal(false)}
          />
        )}

        {/* Modal xác nhận đổi trạng thái */}
        {showConfirmStatusModal && (
          <ConfirmStatusModal
            currentStatus={status}
            onConfirm={handleConfirmStatusChange}
            onClose={() => setShowConfirmStatusModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal;
