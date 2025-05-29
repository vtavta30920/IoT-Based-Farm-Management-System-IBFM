import React, { useState, useEffect } from "react";
import { getAllCrops, getAllFarms } from "../../api/api";
import {
  changeCropStatus,
  useCreateCrop,
  useUpdateCrop,
} from "../../api/CropEndPoint";

const CropManagement = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCrop, setCurrentCrop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusModal, setStatusModal] = useState({ open: false, crop: null });
  const [isChanging, setIsChanging] = useState(false);
  const { mutate: createCrop, isLoading: isCreating } = useCreateCrop();
  const { mutate: updateCrop, isLoading: isUpdating } = useUpdateCrop();
  const [formErrors, setFormErrors] = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // "success" | "error"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [cropsData, farmsData] = await Promise.all([
          getAllCrops(token, pageIndex, pageSize),
          getAllFarms(token),
        ]);
        setCrops(Array.isArray(cropsData.items) ? cropsData.items : []);
        setFarms(farmsData);
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
    if (!cropData.origin || !cropData.origin.trim()) {
      errors.origin = "Origin is required";
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
    const cropData = {
      cropName: formData.get("cropName"),
      description: formData.get("description"),
      origin: formData.get("origin"),
    };

    // Validate required fields
    const errors = {};
    if (!cropData.cropName || !cropData.cropName.trim()) {
      errors.cropName = "Crop name is required";
    }
    if (!cropData.description || !cropData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!cropData.origin || !cropData.origin.trim()) {
      errors.origin = "Origin is required";
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (currentCrop) {
        await updateCrop(
          {
            cropId: currentCrop.cropId,
            updateData: cropData,
          },
          {
            onSuccess: async () => {
              await reloadCurrentPage();
              setIsModalOpen(false);
              setCurrentCrop(null);
              setFormErrors({});
              setNotification({
                show: true,
                message: "Update crop successfully!",
                type: "success",
              });
            },
            onError: (err) => {
              setNotification({
                show: true,
                message: "Update crop failed!",
                type: "error",
              });
              setError(err.message);
            },
          }
        );
      } else {
        await createCrop(cropData, {
          onSuccess: async () => {
            await reloadCurrentPage();
            setIsModalOpen(false);
            setCurrentCrop(null);
            setFormErrors({});
            setNotification({
              show: true,
              message: "Create crop successfully!",
              type: "success",
            });
          },
          onError: (err) => {
            setNotification({
              show: true,
              message: "Create crop failed!",
              type: "error",
            });
            setError(err.message);
          },
        });
      }
    } catch (err) {
      setNotification({
        show: true,
        message: "Something went wrong!",
        type: "error",
      });
      setError(err.message);
    }
  };

  const handleChangeStatus = async () => {
    if (!statusModal.crop) return;
    setIsChanging(true);
    try {
      await changeCropStatus(statusModal.crop.cropId);
      await reloadCurrentPage();
      setStatusModal({ open: false, crop: null });
      setNotification({
        show: true,
        message: "Update crop status successfully!",
        type: "success",
      });
    } catch (err) {
      setError(err.message);
      setStatusModal({ open: false, crop: null });
      setNotification({
        show: true,
        message: "Update crop status failed!",
        type: "error",
      });
    } finally {
      setIsChanging(false);
    }
  };

  if (isLoading) return <div>Loading crops...</div>;
  if (error) return <div>Error: {error}</div>;
  const cropList = Array.isArray(crops) ? crops : [];

  return (
    <div className="p-6">
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
                Description
              </th>
              {/* Bỏ cột Origin */}
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cropList.map((crop) => (
              <tr key={crop.cropId}>
                <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                  <div className="text-sm font-medium text-gray-900">
                    {crop.cropName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-pre-line text-center align-top">
                  <div className="text-sm text-gray-500 break-words max-w-xs mx-auto">
                    {crop.description}
                  </div>
                </td>
                {/* Bỏ cột Origin */}
                <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                  <button
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        crop.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 border border-green-400"
                          : "bg-red-100 text-red-800 border border-red-400"
                      }
                    `}
                    disabled={isChanging}
                    onClick={() => setStatusModal({ open: true, crop })}
                  >
                    {crop.status}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center align-top">
                  <button
                    onClick={() => handleEdit(crop)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Detail
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
                  <textarea
                    name="description"
                    defaultValue={currentCrop?.description || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y min-h-[60px] max-h-[200px]"
                    required
                    rows={3}
                    style={{ wordBreak: "break-word" }}
                  />
                  {formErrors.description && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.description}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Origin
                  </label>
                  <textarea
                    name="origin"
                    defaultValue={currentCrop?.origin || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y min-h-[40px] max-h-[120px]"
                    required
                    rows={2}
                    style={{ wordBreak: "break-word" }}
                  />
                  {formErrors.origin && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.origin}
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

      {/* Modal confirm đổi trạng thái */}
      {statusModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Confirm Change Status
            </h2>
            <p className="mb-6">
              Are you sure you want to change status for crop{" "}
              <span className="font-bold">{statusModal.crop?.cropName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                onClick={() => setStatusModal({ open: false, crop: null })}
                disabled={isChanging}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleChangeStatus}
                disabled={isChanging}
              >
                {isChanging ? "Changing..." : "Change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropManagement;
