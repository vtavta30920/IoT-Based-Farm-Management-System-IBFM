import React, { useState } from "react";

const CropManagement = () => {
  const [crops, setCrops] = useState([
    {
      id: 1,
      name: "Tomato",
      variety: "Cherry",
      plantingDate: "2023-05-15",
      harvestDate: "2023-07-20",
      status: "Growing",
      farm: "Main Farm",
    },
    {
      id: 2,
      name: "Lettuce",
      variety: "Romaine",
      plantingDate: "2023-06-01",
      harvestDate: "2023-07-15",
      status: "Harvested",
      farm: "Northern Farm",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCrop, setCurrentCrop] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      setCrops(crops.filter((crop) => crop.id !== id));
    }
  };

  const handleEdit = (crop) => {
    setCurrentCrop(crop);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cropData = Object.fromEntries(formData);

    if (currentCrop) {
      // Update existing crop
      setCrops(
        crops.map((crop) =>
          crop.id === currentCrop.id ? { ...crop, ...cropData } : crop
        )
      );
    } else {
      // Add new crop
      const newCrop = {
        id: crops.length + 1,
        ...cropData,
      };
      setCrops([...crops, newCrop]);
    }
    setIsModalOpen(false);
    setCurrentCrop(null);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Variety
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Farm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Planting Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Harvest Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {crop.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{crop.variety}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{crop.farm}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {crop.plantingDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {crop.harvestDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      crop.status === "Growing"
                        ? "bg-blue-100 text-blue-800"
                        : crop.status === "Harvested"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {crop.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(crop)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(crop.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={currentCrop?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variety
                  </label>
                  <input
                    type="text"
                    name="variety"
                    defaultValue={currentCrop?.variety || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm
                  </label>
                  <select
                    name="farm"
                    defaultValue={currentCrop?.farm || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Farm</option>
                    <option value="Main Farm">Main Farm</option>
                    <option value="Northern Farm">Northern Farm</option>
                  </select>
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
                  />
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
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={currentCrop?.status || "Growing"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="Growing">Growing</option>
                    <option value="Harvested">Harvested</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    {currentCrop ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropManagement;
