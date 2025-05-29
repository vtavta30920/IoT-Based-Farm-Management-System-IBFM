import React, { useState, useEffect } from "react";
import { getAllCrops, getAllCategories } from "../../api/api";
import {
  changeCropStatus,
  useCreateCrop,
  useUpdateCrop,
} from "../../api/CropEndPoint";
import { uploadImageToFirebase } from "../../api/firebase.js";
const CropManagement = () => {
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCrop, setCurrentCrop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const { mutate: createCrop, isLoading: isCreating } = useCreateCrop();
  const { mutate: updateCrop, isLoading: isUpdating } = useUpdateCrop();
  const [formErrors, setFormErrors] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [newImageFile, setNewImageFile] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [cropsData, categoriesData] = await Promise.all([
          getAllCrops(token, pageIndex, pageSize),
          getAllCategories(token),
        ]);
        setCrops(Array.isArray(cropsData.items) ? cropsData.items : []);
        setCategories(categoriesData);
        setTotalPages(cropsData.totalPagesCount || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageIndex]);

  const validateForm = (cropData) => {
    const errors = {};
    if (!cropData.cropName || !cropData.cropName.trim()) {
      errors.cropName = "Crop name is required";
    }
    if (!cropData.description || !cropData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!cropData.categoryId) {
      errors.categoryId = "Category is required";
    }
    return errors;
  };

  const handleEdit = (crop) => {
    setCurrentCrop(crop);
    setIsModalOpen(true);
  };

  const reloadCurrentPage = async () => {
    const token = localStorage.getItem("token");
    const cropsData = await getAllCrops(token, pageIndex, pageSize);
    setCrops(Array.isArray(cropsData.items) ? cropsData.items : []);
    setTotalPages(cropsData.totalPagesCount || 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cropData = Object.fromEntries(formData);

    const errors = validateForm(cropData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      let imageUrl = cropData.imageUrl;

      // Upload new image if there's one
      if (newImageFile) {
        try {
          imageUrl = await uploadImageToFirebase(newImageFile, "crops");
        } catch (err) {
          setError("Image upload failed: " + err.message);
          return;
        }
      }

      if (currentCrop) {
        updateCrop(
          {
            cropId: currentCrop.cropId,
            updateData: {
              cropName: cropData.cropName,
              description: cropData.description,
              imageUrl: imageUrl,
              origin: cropData.origin,
              categoryId: Number(cropData.categoryId),
            },
          },
          {
            onSuccess: async () => {
              await reloadCurrentPage();
              setIsModalOpen(false);
              setCurrentCrop(null);
              setFormErrors({});
              setNewImageFile(null);
            },
            onError: (err) => {
              setError(err.message);
            },
          }
        );
      } else {
        createCrop(
          {
            cropName: cropData.cropName,
            description: cropData.description,
            imageUrl: imageUrl,
            origin: cropData.origin,
            categoryId: Number(cropData.categoryId),
          },
          {
            onSuccess: async () => {
              await reloadCurrentPage();
              setIsModalOpen(false);
              setCurrentCrop(null);
              setFormErrors({});
              setNewImageFile(null);
            },
            onError: (err) => {
              setError(err.message);
            },
          }
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div>Loading crops...</div>;
  if (error) return <div>Error: {error}</div>;
  const cropList = Array.isArray(crops) ? crops : [];
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setCurrentCrop((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
      setShowImageModal(false);
    }
  };

  const handlePasteImage = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setNewImageFile(file);
          setCurrentCrop((prev) => ({
            ...prev,
            imageUrl: URL.createObjectURL(file),
          }));
          setShowImageModal(false);
          break;
        }
      }
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Crop Management</h2>
        <button
          onClick={() => {
            setCurrentCrop(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Add New Crop
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Image
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Description
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Origin
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cropList.map((crop) => (
              <tr key={crop.cropId}>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {crop.cropName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">
                    {crop.imageUrl && (
                      <img
                        src={crop.imageUrl}
                        alt={crop.cropName}
                        className="w-10 h-10 rounded-full object-cover mx-auto"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">
                    {crop.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">
                    {crop.category?.categoryName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">{crop.origin}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <button
                    onClick={() => handleEdit(crop)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={pageIndex === 1}
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {pageIndex} / {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={pageIndex === totalPages}
          onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>

      {/* Crop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentCrop ? "Edit Crop" : "Add New Crop"}
              </h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    name="cropName"
                    defaultValue={currentCrop?.cropName || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  {formErrors.cropName && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.cropName}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={currentCrop?.description || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="flex items-center">
                    {currentCrop?.imageUrl && (
                      <img
                        src={currentCrop.imageUrl}
                        alt="Crop"
                        className="w-16 h-16 rounded-md object-cover mr-4 cursor-pointer"
                        onClick={() => setShowImageModal(true)}
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => setShowImageModal(true)}
                      className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Upload
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin
                  </label>
                  <input
                    type="text"
                    name="origin"
                    defaultValue={currentCrop?.origin || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={currentCrop?.category?.categoryId || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoryId && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.categoryId}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormErrors({});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={isCreating || isUpdating}
                  >
                    {currentCrop
                      ? isUpdating
                        ? "Updating..."
                        : "Update"
                      : isCreating
                      ? "Saving..."
                      : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Select or Paste new image
            </h3>
            <div
              tabIndex={0}
              onPaste={handlePasteImage}
              className="w-full h-20 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center mb-4 text-gray-500 focus:outline-none"
              style={{ cursor: "pointer" }}
              title="Paste image here"
            >
              Paste image here (Ctrl+V)
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="w-full border px-3 py-2 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropManagement;
