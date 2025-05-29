import React, { useState, useEffect } from "react";
import defaultAvatar from "../../assets/avatardefault.jpg";
import {
  useUpdateProductStatus,
  useUpdateProduct,
} from "../../api/ProductEndPoint";
import { useCategories } from "../../api/CategoryEndPoint";
import { uploadImageToFirebase } from "../../api/firebase.js";

// Modal đổi ảnh (upload lên Firebase)
const ImageUrlModal = ({ currentImageUrl, onChangeImageUrl, onClose }) => {
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Xử lý chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Xử lý paste ảnh
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setNewImageFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          break;
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (newImageFile) {
      setUploading(true);
      try {
        const url = await uploadImageToFirebase(newImageFile, "products");
        onChangeImageUrl(url);
      } catch {
        alert("Upload image failed!");
      }
      setUploading(false);
    }
    onClose();
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
          Change Product Image
        </h2>
        <div className="space-y-4">
          <div
            tabIndex={0}
            onPaste={handlePaste}
            className="w-full h-20 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center text-gray-500 focus:outline-none mb-2"
            style={{ cursor: "pointer" }}
            title="Paste image here"
          >
            Paste image here (Ctrl+V)
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mx-auto border mb-2"
            />
          )}
          <div className="flex justify-end space-x-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
              disabled={!newImageFile || uploading}
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
            <button
              className="bg-gray-600 text-white px-4 py-2 rounded"
              onClick={onClose}
              disabled={uploading}
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
  const [showConfirmStatusModal, setShowConfirmStatusModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.images || defaultAvatar);
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ? String(product.categoryId) : ""
  );
  const [status, setStatus] = useState(product?.status || 0);
  const [name, setName] = useState(product?.productName || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stockQuantity || 0);
  const [description, setDescription] = useState(product?.description || "");
  const [cropName, setCropName] = useState(product?.cropName || "");
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // "success" | "error"
  });

  const { mutate: updateStatus, isLoading: isUpdatingStatus } =
    useUpdateProductStatus();
  const { mutate: updateProduct, isLoading: isUpdatingProduct } =
    useUpdateProduct();

  const handleImageClick = () => setShowImageUrlModal(true);

  const handleStatusClick = () => {
    if (!product?.productId) {
      console.error("Product ID is missing.");
      return;
    }
    setShowConfirmStatusModal(true);
  };

  const handleSaveChanges = () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      productName: name,
      price: Number(price),
      images: imageUrl,
      // Không truyền stockQuantity khi update
      description,
      categoryId:
        categoryId && !isNaN(Number(categoryId))
          ? Number(categoryId)
          : undefined,
    };

    updateProduct(
      { productId: product.productId, productData: payload },
      {
        onSuccess: () => {
          setNotification({
            show: true,
            message: "Update product successfully!",
            type: "success",
          });
          setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
            onClose();
          }, 1500);
        },
        onError: () => {
          setNotification({
            show: true,
            message: "Update product failed!",
            type: "error",
          });
        },
      }
    );
  };

  const handleConfirmStatusChange = () => {
    if (!product?.productId) {
      setShowConfirmStatusModal(false);
      return;
    }

    updateStatus(product.productId, {
      onSuccess: () => {
        setStatus(status === 1 ? 0 : 1);
        setShowConfirmStatusModal(false);
        setNotification({
          show: true,
          message: "Update product status successfully!",
          type: "success",
        });
      },
      onError: () => {
        setShowConfirmStatusModal(false);
        setNotification({
          show: true,
          message: "Update product status failed!",
          type: "error",
        });
      },
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!categoryId) newErrors.categoryId = "Category is required.";
    if (!cropName.trim()) newErrors.cropName = "Crop is required.";
    if (price === "" || isNaN(price)) newErrors.price = "Price is required.";
    else if (Number(price) < 10000)
      newErrors.price = "Price must be at least 10,000.";
    else if (Number(price) < 0) newErrors.price = "Price cannot be negative.";
    if (stock === "" || isNaN(stock)) newErrors.stock = "Stock is required.";
    else if (Number(stock) < 0) newErrors.stock = "Stock cannot be negative.";
    return newErrors;
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <button
                className={`w-full px-4 py-2 rounded font-semibold transition-colors duration-200 ${
                  status === 1
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
                onClick={handleStatusClick}
                disabled={isUpdatingStatus}
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
              <input
                type="text"
                value={cropName}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                placeholder="Enter crop name"
              />
              {errors.cropName && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.cropName}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.name && (
                <div className="text-red-600 text-sm mt-1">{errors.name}</div>
              )}
            </div>
            <div>
              <label className="block font-medium">Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setPrice(val === "" ? "" : val);
                }}
                className="w-full border rounded px-3 py-2"
                min={10000}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
              />
              {errors.price && (
                <div className="text-red-600 text-sm mt-1">{errors.price}</div>
              )}
            </div>
            <div>
              <label className="block font-medium">Stock</label>
              <input
                type="text"
                value={stock}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                min={0}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
              />
              {errors.stock && (
                <div className="text-red-600 text-sm mt-1">{errors.stock}</div>
              )}
            </div>
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              {errors.description && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.description}
                </div>
              )}
            </div>
            <div>
              <label className="block font-medium">Category</label>
              <CategoryDropdown
                selectedCategoryId={categoryId}
                selectedCategoryName={product?.categoryName}
                onCategoryChange={(val) => setCategoryId(String(val))}
              />
              {errors.categoryId && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.categoryId}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="bg-gray-600 text-white px-6 py-2 rounded"
            onClick={onClose}
            disabled={isUpdatingProduct}
          >
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded"
            onClick={handleSaveChanges}
            disabled={isUpdatingProduct}
          >
            {isUpdatingProduct ? "Saving..." : "Save Changes"}
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
