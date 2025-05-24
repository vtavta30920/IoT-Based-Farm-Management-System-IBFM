import React, { useState, useEffect } from "react";
import defaultAvatar from "../../assets/avatardefault.jpg";
import { useGetAllCrops } from "../../api/CropEndPoint";
import { useCategories } from "../../api/CategoryEndPoint";
import { uploadImageToFirebase } from "../../api/Firebase";

const CropDropdown = ({ selectedCropId, onCropChange }) => {
  const { data: crops = [], isLoading } = useGetAllCrops();
  if (isLoading) return <p>Loading crops...</p>;
  return (
    <select
      value={selectedCropId}
      onChange={(e) => onCropChange(e.target.value)}
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select a Crop</option>
      {crops.map((crop) => (
        <option key={crop.cropId} value={String(crop.cropId)}>
          {crop.cropName}
        </option>
      ))}
    </select>
  );
};

const CategoryDropdown = ({
  selectedCategoryId,
  selectedCategoryName,
  onCategoryChange,
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
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.categoryId} value={String(category.categoryId)}>
          {category.categoryName}
        </option>
      ))}
    </select>
  );
};

// Thay thế ImageUrlModal bằng modal upload ảnh Firebase
const ImageUrlModal = ({ currentImageUrl, onChangeImageUrl, onClose }) => {
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

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
          Upload Product Image
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

const CreateProductModal = ({
  onClose,
  onSubmit,
  isSubmitting = false,
  apiError,
}) => {
  const [showImageUrlModal, setShowImageUrlModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(defaultAvatar);
  const [categoryId, setCategoryId] = useState("");
  const [cropId, setCropId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(10000); // default price is 10000
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  const handleImageClick = () => setShowImageUrlModal(true);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!categoryId) newErrors.categoryId = "Category is required.";
    if (!cropId) newErrors.cropId = "Crop is required.";
    if (!imageUrl.trim()) newErrors.imageUrl = "Image URL is required.";
    if (!price || price < 10000)
      newErrors.price = "Price must be at least 10,000.";
    if (!stock || stock <= 0) newErrors.stock = "Stock must be greater than 0.";
    return newErrors;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const categoryIdNum =
      categoryId && !isNaN(Number(categoryId)) ? Number(categoryId) : undefined;
    const cropIdNum =
      cropId && !isNaN(Number(cropId)) ? Number(cropId) : undefined;

    const payload = {
      productName: name,
      price,
      images: imageUrl,
      stockQuantity: stock,
      description,
      categoryId: categoryIdNum,
      cropId: cropIdNum,
    };

    console.log("Create product payload (before API):", payload);

    if (onSubmit) onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-green-50 p-8 rounded-xl shadow-lg w-full max-w-3xl max-h-[95vh] overflow-y-auto relative">
        <button
          className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
          Create Product
        </h2>
        <form onSubmit={handleSave}>
          {Object.keys(errors).length > 3 && (
            <div className="mb-2 text-red-600 font-semibold text-center">
              Please fill all required fields correctly.
            </div>
          )}
          {apiError && (
            <div className="mb-2 text-center text-red-600 font-semibold">
              {apiError}
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex flex-col items-center">
              <img
                src={imageUrl}
                alt="Product"
                className="w-48 h-48 object-cover rounded cursor-pointer border"
                onClick={handleImageClick}
              />
              {errors.imageUrl && (
                <div className="text-red-600 text-sm mt-2">
                  {errors.imageUrl}
                </div>
              )}
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <label className="block font-medium">Crop</label>
                <CropDropdown
                  selectedCropId={cropId}
                  onCropChange={(val) => setCropId(String(val))}
                />
                {errors.cropId && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.cropId}
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
                    // Chỉ cho phép số, không cho nhập bất kỳ ký tự nào ngoài số
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setPrice(val === "" ? "" : Math.max(Number(val), 0));
                  }}
                  className="w-full border rounded px-3 py-2"
                  min={10000}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
                {errors.price && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.price}
                  </div>
                )}
              </div>
              <div>
                <label className="block font-medium">Stock</label>
                <input
                  type="text"
                  value={stock}
                  onChange={(e) => {
                    // Chỉ cho phép số, không cho nhập bất kỳ ký tự nào ngoài số
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setStock(val === "" ? "" : Math.max(Number(val), 0));
                  }}
                  className="w-full border rounded px-3 py-2"
                  min={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                />
                {errors.stock && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.stock}
                  </div>
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
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
        {showImageUrlModal && (
          <ImageUrlModal
            currentImageUrl={imageUrl}
            onChangeImageUrl={setImageUrl}
            onClose={() => setShowImageUrlModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CreateProductModal;
