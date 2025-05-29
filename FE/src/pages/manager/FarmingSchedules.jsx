"use client";

import { useState, useEffect } from "react";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  updateScheduleStatus,
  getStaffAccounts,
  getAllFarms,
  getAllFarmActivities,
  getExcludingInactive, // Changed from getAllActive
} from "../../api/api";
const FarmingSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [farms, setFarms] = useState([]); // New state for farms
  const [farmActivities, setFarmActivities] = useState([]); // New state for farm activities
  const [crops, setCrops] = useState([]); // New state for crops
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
    totalPages: 0,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const statusOptions = ["ACTIVE", "DEACTIVATED"];
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    assignedTo: "",
    farmActivityId: "",
    farmDetailsId: "",
    cropId: "",
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchSchedules();
    fetchStaffAccounts();
    fetchFarms();
    fetchFarmActivities();
    fetchCrops();
  }, [pagination.pageIndex, pagination.pageSize, statusFilter]);

  // Fetch all necessary data
  const fetchFarms = async () => {
    try {
      const response = await getAllFarms(token);
      setFarms(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFarmActivities = async () => {
    try {
      const response = await getAllFarmActivities(token);
      setFarmActivities(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCrops = async () => {
    try {
      const response = await getExcludingInactive(token);
      setCrops(response.data); // Note: response.data is now used to access the array
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch staff accounts
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSchedules(
        pagination.pageIndex + 1,
        pagination.pageSize,
        token
      );
      if (response.status === 1) {
        let filteredSchedules = response.data.items;

        // Apply filters
        if (searchTerm) {
          filteredSchedules = filteredSchedules.filter(
            (schedule) =>
              schedule.fullNameStaff
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              schedule.cropView?.cropName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
        }
        if (statusFilter) {
          filteredSchedules = filteredSchedules.filter(
            (schedule) => schedule.status === statusFilter
          );
        }

        setSchedules(filteredSchedules);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPagesCount,
          totalItems: response.data.totalItemCount,
        });
      } else {
        throw new Error(response.message || "Failed to fetch schedules");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffAccounts = async () => {
    try {
      const staffData = await getStaffAccounts(0, 100, token);
      setStaffList(staffData.items);
    } catch (err) {
      setError(err.message);
    }
  };

  const validateNumber = (value) => {
    const num = Number.parseInt(value, 10);
    return !isNaN(num) && num >= 0 ? num : "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: [
        "assignedTo",
        "farmActivityId",
        "farmDetailsId",
        "cropId",
      ].includes(name)
        ? validateNumber(value)
        : value,
    });
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Additional validation
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        throw new Error("Start date cannot be after end date");
      }

      const response = await createSchedule(formData, token);
      if (response.status === 1) {
        setIsCreateModalOpen(false);
        resetForm();
        fetchSchedules();
      } else {
        throw new Error(response.message || "Failed to create schedule");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        throw new Error("Start date cannot be after end date");
      }

      const response = await updateSchedule(
        currentSchedule.scheduleId,
        formData,
        token
      );
      if (response.status === 1) {
        setIsEditModalOpen(false);
        resetForm();
        fetchSchedules();
      } else {
        throw new Error(response.message || "Failed to update schedule");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (scheduleId, newStatus) => {
    try {
      setLoading(true);
      const response = await updateScheduleStatus(scheduleId, newStatus, token);
      if (response.status === 1) {
        fetchSchedules();
      } else {
        setError(response.message || "Failed to update status");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      startDate: "",
      endDate: "",
      assignedTo: "",
      farmActivityId: "",
      farmDetailsId: "",
      cropId: "",
    });
  };

  const openEditModal = (schedule) => {
    setCurrentSchedule(schedule);
    setFormData({
      startDate: formatDateForInput(schedule.startDate),
      endDate: formatDateForInput(schedule.endDate),
      assignedTo: schedule.assignedTo,
      farmActivityId: schedule.farmActivityId,
      farmDetailsId: schedule.farmId,
      cropId: schedule.cropId,
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (schedule) => {
    setCurrentSchedule(schedule);
    setIsViewModalOpen(true);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      pageIndex: newPage,
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Farming Schedules
          </h1>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + New Schedule
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by staff or crop name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">All Status</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={fetchSchedules}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Filter
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}

      {/* Schedules Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                No
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Staff
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Start Date
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                End Date
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Status
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Crop
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : schedules.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No schedules found
                </td>
              </tr>
            ) : (
              schedules.map((schedule, index) => (
                <tr key={schedule.scheduleId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">
                    {pagination.pageIndex * pagination.pageSize + index + 1}
                  </td>
                  <td className="py-2 px-4 border">{schedule.fullNameStaff}</td>
                  <td className="py-2 px-4 border">{schedule.startDate}</td>
                  <td className="py-2 px-4 border">{schedule.endDate}</td>
                  <td className="py-2 px-4 border">
                    <select
                      value={schedule.status}
                      onChange={(e) =>
                        handleStatusChange(schedule.scheduleId, e.target.value)
                      }
                      className={`px-2 py-1 rounded text-xs ${
                        schedule.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      disabled={loading}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4 border">
                    {schedule.cropView?.cropName || "N/A"}
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                      onClick={() => openViewModal(schedule)}
                    >
                      View
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      onClick={() => openEditModal(schedule)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            pagination.totalItems
          )}{" "}
          of {pagination.totalItems} entries
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 border rounded ${
              pagination.pageIndex === 0
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 0}
          >
            Previous
          </button>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${
                pagination.pageIndex === i
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={`px-3 py-1 border rounded ${
              pagination.pageIndex === pagination.totalPages - 1
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => handlePageChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex === pagination.totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Schedule Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Schedule
            </h2>
            <form onSubmit={handleCreateSchedule}>
              <div className="grid grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div> */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Assigned To (Staff)
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Staff</option>
                    {staffList.map((staff) => (
                      <option key={staff.accountId} value={staff.accountId}>
                        {staff.accountProfile.fullname} ({staff.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Farm Activity
                  </label>
                  <select
                    name="farmActivityId"
                    value={formData.farmActivityId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Farm Activity</option>
                    {farmActivities.map((activity) => (
                      <option
                        key={activity.farmActivitiesId}
                        value={activity.farmActivitiesId}
                      >
                        {activity.activityType} (
                        {formatDateForDisplay(activity.startDate)} -{" "}
                        {formatDateForDisplay(activity.endDate)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Farm</label>
                  <select
                    name="farmDetailsId"
                    value={formData.farmDetailsId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Farm</option>
                    {farms.map((farm) => (
                      <option key={farm.farmId} value={farm.farmId}>
                        {farm.farmName} ({farm.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Crop</label>
                  <select
                    name="cropId"
                    value={formData.cropId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Crop</option>
                    {crops.map((crop) => (
                      <option key={crop.cropId} value={crop.cropId}>
                        {crop.cropName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg text-gray-700 transition-colors"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {isEditModalOpen && currentSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              Edit Schedule #{currentSchedule.scheduleId}
            </h2>
            <form onSubmit={handleUpdateSchedule}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div> */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Assigned To (Staff)
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Staff</option>
                    {staffList.map((staff) => (
                      <option key={staff.accountId} value={staff.accountId}>
                        {staff.accountProfile.fullname} ({staff.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Farm Activity
                  </label>
                  <select
                    name="farmActivityId"
                    value={formData.farmActivityId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Farm Activity</option>
                    {farmActivities.map((activity) => (
                      <option
                        key={activity.farmActivitiesId}
                        value={activity.farmActivitiesId}
                      >
                        {activity.activityType} (
                        {formatDateForDisplay(activity.startDate)} -{" "}
                        {formatDateForDisplay(activity.endDate)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Farm</label>
                  <select
                    name="farmDetailsId"
                    value={formData.farmDetailsId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Farm</option>
                    {farms.map((farm) => (
                      <option key={farm.farmId} value={farm.farmId}>
                        {farm.farmName} ({farm.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Crop</label>
                  <select
                    name="cropId"
                    value={formData.cropId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Crop</option>
                    {crops.map((crop) => (
                      <option key={crop.cropId} value={crop.cropId}>
                        {crop.cropName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Schedule Modal */}
      {isViewModalOpen && currentSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              Schedule Details #{currentSchedule.scheduleId}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-2">
                <span className="font-medium">Staff:</span>{" "}
                {currentSchedule.fullNameStaff}
              </div>
              <div className="mb-2">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    currentSchedule.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {currentSchedule.status}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Start Date:</span>{" "}
                {currentSchedule.startDate}
              </div>
              <div className="mb-2">
                <span className="font-medium">End Date:</span>{" "}
                {currentSchedule.endDate}
              </div>
              <div className="mb-2">
                <span className="font-medium">Created At:</span>{" "}
                {currentSchedule.createdAt}
              </div>
              {/* <div className="mb-2">
                <span className="font-medium">Updated At:</span>{" "}
                {currentSchedule.updatedAt}
              </div>
              <div className="mb-2">
                <span className="font-medium">Farm Activity ID:</span>{" "}
                {currentSchedule.farmActivityId}
              </div>
              <div className="mb-2">
                <span className="font-medium">Farm ID:</span>{" "}
                {currentSchedule.farmId}
              </div>
              <div className="mb-2">
                <span className="font-medium">Crop ID:</span>{" "}
                {currentSchedule.cropId}
              </div> */}
            </div>

            {currentSchedule.cropView && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Crop Information</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                  <div className="mb-2">
                    <span className="font-medium">Name:</span>{" "}
                    {currentSchedule.cropView.cropName}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Description:</span>{" "}
                    {currentSchedule.cropView.description}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Quantity:</span>{" "}
                    {currentSchedule.cropView.quantity}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Planting Date:</span>{" "}
                    {currentSchedule.cropView.plantingDate}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Harvest Date:</span>{" "}
                    {currentSchedule.cropView.harvestDate}
                  </div>
                </div>
              </div>
            )}

            {currentSchedule.farmActivityView && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">
                  Farm Activity Information
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                  <div className="mb-2">
                    <span className="font-medium">Activity Type:</span>{" "}
                    {currentSchedule.farmActivityView.activityType}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Start Date:</span>{" "}
                    {currentSchedule.farmActivityView.startDate}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">End Date:</span>{" "}
                    {currentSchedule.farmActivityView.endDate}
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">Status:</span>{" "}
                    {currentSchedule.farmActivityView.status}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmingSchedules;
