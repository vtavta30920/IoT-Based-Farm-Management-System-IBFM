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
  const [statusDropdownOpenId, setStatusDropdownOpenId] = useState(null);

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

  // Map status code to label
  const statusOptions = [
    { value: 0, label: "ACTIVE" },
    { value: 1, label: "INACTIVE" },
    { value: 2, label: "IN_STOCK" },
  ];

  // Helper to get status label from value
  const getStatusLabel = (status) => {
    const found = statusOptions.find(
      (opt) => opt.label === status || opt.value === status
    );
    return found ? found.label : status;
  };

  // Helper to get status color classes
  const getStatusClass = (status) => {
    if (status === "ACTIVE" || status === 0)
      return "bg-green-100 text-green-800 border border-green-400";
    if (status === "IN_STOCK" || status === 2)
      return "bg-blue-100 text-blue-800 border border-blue-400";
    if (status === "CLEAR")
      return "bg-yellow-100 text-yellow-800 border border-yellow-400";
    return "bg-red-100 text-red-800 border border-red-400";
  };

  // Update status handler
  const handleStatusSelect = async (crop, statusValue) => {
    setIsChanging(true);
    try {
      // statusValue là số (0, 1, 2) lấy từ statusOptions.value
      await changeCropStatus({ cropId: crop.cropId, status: statusValue });
      await reloadCurrentPage();
      setNotification({
        show: true,
        message: "Update crop status successfully!",
        type: "success",
      });
    } catch (err) {
      setError(err.message);
      setNotification({
        show: true,
        message: "Update crop status failed!",
        type: "error",
      });
    } finally {
      setIsChanging(false);
      setStatusDropdownOpenId(null);
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

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full bg-white">
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "38%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Name
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Description
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Status
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : cropList.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No crops found
                </td>
              </tr>
            ) : (
              cropList.map((crop) => (
                <tr key={crop.cropId} className="hover:bg-gray-50 align-middle">
                  <td className="py-2 px-4 border text-center align-middle">
                    <div className="text-sm font-medium text-gray-900 flex items-center justify-center h-full">
                      {crop.cropName}
                    </div>
                  </td>
                  <td className="py-2 px-4 border text-center align-middle">
                    <div className="text-sm text-gray-500 break-words max-w-xs mx-auto flex items-center justify-center h-full">
                      {crop.description}
                    </div>
                  </td>
                  <td className="py-2 px-4 border text-center align-middle relative">
                    <div className="flex items-center justify-center h-full">
                      <select
                        value={getStatusLabel(crop.status)}
                        onChange={(e) => {
                          const selected = statusOptions.find(
                            (opt) => opt.label === e.target.value
                          );
                          if (selected)
                            handleStatusSelect(crop, selected.value); // truyền value là số
                        }}
                        className={`px-2 py-1 rounded text-xs font-semibold border focus:outline-none ${getStatusClass(
                          crop.status
                        )}`}
                        disabled={isChanging}
                      >
                        {statusOptions.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.label}
                            className={
                              opt.label === "ACTIVE"
                                ? "text-green-800"
                                : opt.label === "IN_STOCK"
                                ? "text-blue-800"
                                : opt.label === "CLEAR"
                                ? "text-yellow-800"
                                : opt.label === "INACTIVE"
                                ? "text-red-800"
                                : ""
                            }
                            disabled={getStatusLabel(crop.status) === opt.label}
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-2 px-4 border text-center align-middle">
                    <div className="flex items-center justify-center h-full">
                      <button
                        onClick={() => handleEdit(crop)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                      >
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
