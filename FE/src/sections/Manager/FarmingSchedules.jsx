"use client";

import { useState, useEffect } from "react";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  updateScheduleStatus,
} from "../../api/api"; // Using the provided API functions

const FarmingSchedules = () => {
  // State for schedules list and pagination
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const statusOptions = [
    "ACTIVE",
    "DEACTIVATED",
    "SUSPENDED",
    "BANNED",
    "PAID",
    "UNDISCHARGED",
  ];
  // State for form data
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    assignedTo: "",
    farmActivityId: "",
    farmDetailsId: "",
    cropId: "",
    dailyLogId: "",
  });

  // State for modal visibility
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  // Get token from localStorage (assuming it's stored there after login)
  const token = localStorage.getItem("token");

  // Fetch schedules on component mount and when pagination changes
  useEffect(() => {
    fetchSchedules();
  }, [pagination.pageIndex, pagination.pageSize]);

  // Function to fetch schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSchedules(
        pagination.pageIndex + 1, // API expects 1-based index
        pagination.pageSize,
        token
      );

      if (response.status === 1) {
        setSchedules(response.data.items);
        setPagination({
          ...pagination,
          totalPages: response.data.totalPagesCount,
          totalItems: response.data.totalItemCount,
        });
      } else {
        setError(response.message || "Failed to fetch schedules");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching schedules");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "assignedTo" ||
        name === "farmActivityId" ||
        name === "farmDetailsId" ||
        name === "cropId" ||
        name === "dailyLogId"
          ? Number.parseInt(value, 10)
          : value,
    });
  };

  // Handle create schedule
  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await createSchedule(formData, token);
      if (response.status === 1) {
        setIsCreateModalOpen(false);
        resetForm();
        fetchSchedules();
      } else {
        setError(response.message || "Failed to create schedule");
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating schedule");
    } finally {
      setLoading(false);
    }
  };

  // Handle update schedule
  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
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
        setError(response.message || "Failed to update schedule");
      }
    } catch (err) {
      setError(err.message || "An error occurred while updating schedule");
    } finally {
      setLoading(false);
    }
  };

  // Handle update schedule status
  const handleStatusChange = async (scheduleId, newStatus) => {
    try {
      setLoading(true);
      const response = await updateScheduleStatus(scheduleId, newStatus, token);
      if (response.status === 1) {
        fetchSchedules(); // Refresh the list
      } else {
        setError(response.message || "Failed to update status");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Reset form data
  const resetForm = () => {
    setFormData({
      startDate: "",
      endDate: "",
      assignedTo: "",
      farmActivityId: "",
      farmDetailsId: "",
      cropId: "",
      dailyLogId: "",
    });
  };

  // Open edit modal and populate form with schedule data
  const openEditModal = (schedule) => {
    setCurrentSchedule(schedule);
    setFormData({
      startDate: formatDateForInput(schedule.startDate),
      endDate: formatDateForInput(schedule.endDate),
      assignedTo: schedule.assignedTo,
      farmActivityId: schedule.farmActivityId,
      farmDetailsId: schedule.farmId,
      cropId: schedule.cropId,
      dailyLogId:
        schedule.dailyLog && schedule.dailyLog.length > 0
          ? schedule.dailyLog[0].trackingId
          : "",
    });
    setIsEditModalOpen(true);
  };

  // Open view modal
  const openViewModal = (schedule) => {
    setCurrentSchedule(schedule);
    setIsViewModalOpen(true);
  };

  // Format date from API (DD/MM/YYYY) to input format (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  // Format date from input (YYYY-MM-DD) to display format (DD/MM/YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      pageIndex: newPage,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Farming Schedules</h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Schedule
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Schedules Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Staff</th>
              <th className="py-2 px-4 border">Start Date</th>
              <th className="py-2 px-4 border">End Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Crop</th>
              <th className="py-2 px-4 border">Actions</th>
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
              schedules.map((schedule) => (
                <tr key={schedule.scheduleId} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{schedule.scheduleId}</td>
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
                          : schedule.status === "DEACTIVATED"
                          ? "bg-red-100 text-red-800"
                          : schedule.status === "SUSPENDED"
                          ? "bg-yellow-100 text-yellow-800"
                          : schedule.status === "BANNED"
                          ? "bg-purple-100 text-purple-800"
                          : schedule.status === "PAID"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                      disabled={loading}
                    >
                      {[
                        "ACTIVE",
                        "DEACTIVATED",
                        "SUSPENDED",
                        "BANNED",
                        "PAID",
                        "UNDISCHARGED",
                      ].map((option) => (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create New Schedule</h2>
            <form onSubmit={handleCreateSchedule}>
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
                <div className="mb-4">
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
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Assigned To (Staff ID)
                  </label>
                  <input
                    type="number"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Farm Activity ID
                  </label>
                  <input
                    type="number"
                    name="farmActivityId"
                    value={formData.farmActivityId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Farm Details ID
                  </label>
                  <input
                    type="number"
                    name="farmDetailsId"
                    value={formData.farmDetailsId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Crop ID
                  </label>
                  <input
                    type="number"
                    name="cropId"
                    value={formData.cropId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Daily Log ID (Optional)
                  </label>
                  <input
                    type="number"
                    name="dailyLogId"
                    value={formData.dailyLogId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
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
                <div className="mb-4">
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
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Assigned To (Staff ID)
                  </label>
                  <input
                    type="number"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Farm Activity ID
                  </label>
                  <input
                    type="number"
                    name="farmActivityId"
                    value={formData.farmActivityId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Farm Details ID
                  </label>
                  <input
                    type="number"
                    name="farmDetailsId"
                    value={formData.farmDetailsId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Crop ID
                  </label>
                  <input
                    type="number"
                    name="cropId"
                    value={formData.cropId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Daily Log ID (Optional)
                  </label>
                  <input
                    type="number"
                    name="dailyLogId"
                    value={formData.dailyLogId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
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
              <div className="mb-2">
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
              </div>
            </div>

            {/* Crop Information */}
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

            {/* Farm Activity Information */}
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

            {/* Daily Logs */}
            {currentSchedule.dailyLog &&
              currentSchedule.dailyLog.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Daily Logs</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border">ID</th>
                          <th className="py-2 px-4 border">Date</th>
                          <th className="py-2 px-4 border">Notes</th>
                          <th className="py-2 px-4 border">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSchedule.dailyLog.map((log) => (
                          <tr key={log.trackingId} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border">
                              {log.trackingId}
                            </td>
                            <td className="py-2 px-4 border">{log.date}</td>
                            <td className="py-2 px-4 border">{log.notes}</td>
                            <td className="py-2 px-4 border">{log.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
