import React, { useState, useEffect } from "react";
import { getAllCrops, getAllFarms } from "../../api/api";
import { changeCropStatus, useCreateCrop } from "../../api/CropEndPoint";

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
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [cropsData, farmsData] = await Promise.all([
          getAllCrops(token),
          getAllFarms(token),
        ]);
        setCrops(cropsData);
        setFarms(farmsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (crop) => {
    setCurrentCrop(crop);
    setIsModalOpen(true);
  };

  const validateForm = (cropData) => {
    const errors = {};
    if (!cropData.quantity || isNaN(Number(cropData.quantity))) {
      errors.quantity = "Quantity is required and must be a number";
    } else if (Number(cropData.quantity) <= 0) {
      errors.quantity = "Quantity must be a positive number";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!cropData.plantingDate) {
      errors.plantingDate = "Planting date is required";
    } else {
      const plantingDate = new Date(cropData.plantingDate);
      if (plantingDate < today) {
        errors.plantingDate = "Planting date cannot be in the past";
      }
    }

    if (!cropData.harvestDate) {
      errors.harvestDate = "Harvest date is required";
    } else {
      const harvestDate = new Date(cropData.harvestDate);
      if (harvestDate < today) {
        errors.harvestDate = "Harvest date cannot be in the past";
      } else if (cropData.plantingDate) {
        const plantingDate = new Date(cropData.plantingDate);
        const diffTime = harvestDate.getTime() - plantingDate.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        if (diffDays < 30) {
          errors.harvestDate =
            "Harvest date must be at least 1 month after planting date";
        }
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cropData = Object.fromEntries(formData);

    cropData.quantity = Number(cropData.quantity);

    const errors = validateForm(cropData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (currentCrop) {
        const token = localStorage.getItem("token");
        let response = await fetch(
          `${API_BASE_URL}/crop/update/${currentCrop.cropId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(cropData),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update crop");
        }
        const cropsData = await getAllCrops(token);
        setCrops(cropsData);
        setIsModalOpen(false);
        setCurrentCrop(null);
        setFormErrors({});
      } else {
        createCrop(cropData, {
          onSuccess: async () => {
            const token = localStorage.getItem("token");
            const cropsData = await getAllCrops(token);
            setCrops(cropsData);
            setIsModalOpen(false);
            setCurrentCrop(null);
            setFormErrors({});
          },
          onError: (err) => {
            setError(err.message);
          },
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeStatus = async () => {
    if (!statusModal.crop) return;
    setIsChanging(true);
    try {
      await changeCropStatus(statusModal.crop.cropId);
      const token = localStorage.getItem("token");
      const cropsData = await getAllCrops(token);
      setCrops(cropsData);
      setStatusModal({ open: false, crop: null });
    } catch (err) {
      setError(err.message);
      setStatusModal({ open: false, crop: null });
    } finally {
      setIsChanging(false);
    }
  };

  if (isLoading) return <div>Loading crops...</div>;
  if (error) return <div>Error: {error}</div>;

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
                Description
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Quantity
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Planting Date
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Harvest Date
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {crops.map((crop) => (
              <tr key={crop.cropId}>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {crop.cropName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">
                    {crop.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">{crop.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">
                    {crop.plantingDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">
                    {crop.harvestDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
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
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    step="1"
                    defaultValue={currentCrop?.quantity || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    pattern="[0-9]*"
                    onKeyDown={(e) => {
                      // Không cho nhập e, E, +, -, .
                      if (["e", "E", "+", "-", "."].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      // Xóa ký tự không phải số
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                  />
                  {formErrors.quantity && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.quantity}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Planting Date
                  </label>
                  <input
                    type="date"
                    name="plantingDate"
                    defaultValue={currentCrop?.plantingDate || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {formErrors.plantingDate && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.plantingDate}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    name="harvestDate"
                    defaultValue={currentCrop?.harvestDate || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {formErrors.harvestDate && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.harvestDate}
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
                    disabled={isCreating}
                  >
                    {currentCrop ? "Update" : isCreating ? "Saving..." : "Save"}
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
