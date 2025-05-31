"use client";

import { useState, useEffect } from "react";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  updateScheduleStatus,
  getStaffAccounts,
  getAllFarms,
  getAllFarmActivities, // Note: Update to use get-active API
  getExcludingInactive,
} from "../../api/api";

const FarmingSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [farms, setFarms] = useState([]);
  const [farmActivities, setFarmActivities] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
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
    farmActivities: [], // Stores farmActivityId as strings
    farmDetailsId: "",
    cropId: "",
    plantingDate: "",
    quantity: "",
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
      // Use get-active API instead of getAllFarmActivities
      const response = await fetch(
        `https://webapi20250531180300.azurewebsites.net/api/v1/farm-activity/get-active?pageIndex=1&pageSize=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((res) => res.json());
      if (response.status === 1) {
        setFarmActivities(response.data.items);
      } else {
        throw new Error(response.message || "Failed to fetch farm activities");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCrops = async () => {
    try {
      const response = await getExcludingInactive(token);
      setCrops(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

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

        if (searchTerm) {
          filteredSchedules = filteredSchedules.filter(
            (schedule) =>
              schedule.fullNameStaff
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              schedule.cropView?.cropName
                ?.toLowerCase()
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
      [name]: ["assignedTo", "farmDetailsId", "cropId", "quantity"].includes(
        name
      )
        ? validateNumber(value)
        : value,
    });
  };

  const handleActivitySelection = (activityId) => {
    setFormData((prev) => {
      const updatedActivities = prev.farmActivities.includes(activityId)
        ? prev.farmActivities.filter((id) => id !== activityId)
        : [...prev.farmActivities, activityId];
      return {
        ...prev,
        farmActivities: updatedActivities,
      };
    });
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setModalError(null);

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        throw new Error("Start date cannot be after end date");
      }

      if (formData.farmActivities.length === 0) {
        throw new Error("Please select at least one farm activity");
      }

      // Validate required fields (removed location)
      if (
        !formData.startDate ||
        !formData.endDate ||
        !formData.assignedTo ||
        !formData.farmDetailsId ||
        !formData.cropId ||
        !formData.quantity
      ) {
        throw new Error("Please fill in all required fields");
      }

      const requestData = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        assignedTo: Number(formData.assignedTo),
        farmActivityId: formData.farmActivities.map(Number),
        farmDetailsId: Number(formData.farmDetailsId),
        cropId: Number(formData.cropId),
        plantingDate: formData.plantingDate || null,
        quantity: Number(formData.quantity),
      };

      console.log("Create request body:", requestData); // Debug
      const response = await createSchedule(requestData, token);

      if (response.status === 1) {
        setIsCreateModalOpen(false);
        resetForm();
        fetchSchedules();
      } else {
        throw new Error(response.message || "Failed to create schedule");
      }
    } catch (err) {
      setModalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setModalError(null);

      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        throw new Error("Start date cannot be after end date");
      }

      if (formData.farmActivities.length === 0) {
        throw new Error("Please select at least one farm activity");
      }

      // Validate required fields (removed location)
      if (
        !formData.startDate ||
        !formData.endDate ||
        !formData.assignedTo ||
        !formData.farmDetailsId ||
        !formData.cropId ||
        !formData.quantity
      ) {
        throw new Error("Please fill in all required fields");
      }

      const updateData = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        assignedTo: Number(formData.assignedTo),
        farmActivityId: formData.farmActivities.map(Number), // Use farmActivityId
        farmDetailsId: Number(formData.farmDetailsId),
        cropId: Number(formData.cropId),
        plantingDate: formData.plantingDate || null,
        quantity: Number(formData.quantity),
      };

      console.log("Update request body:", updateData); // Debug
      const response = await updateSchedule(
        currentSchedule.scheduleId,
        updateData,
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
      setModalError(
        err.message || "An error occurred while updating the schedule"
      );
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
      farmActivities: [],
      farmDetailsId: "",
      cropId: "",
      plantingDate: "",
      quantity: "",
    });
    setModalError(null);
  };

  const openEditModal = (schedule) => {
    setCurrentSchedule(schedule);
    setFormData({
      startDate: formatDateForInput(schedule.startDate),
      endDate: formatDateForInput(schedule.endDate),
      assignedTo: schedule.assignedTo.toString(),
      farmActivities:
        schedule.farmActivityView?.map((a) => a.farmActivitiesId.toString()) ||
        [],
      farmDetailsId: schedule.farmId?.toString() || "",
      cropId: schedule.cropId?.toString() || "",
      plantingDate: schedule.plantingDate
        ? formatDateForInput(schedule.plantingDate)
        : "",
      quantity: schedule.quantity?.toString() || "",
    });
    setIsEditModalOpen(true);
    setModalError(null);
  };

  const openViewModal = (schedule) => {
    setCurrentSchedule(schedule);
    setIsViewModalOpen(true);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // Handle DD/MM/YYYY format from API response
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    // Handle other formats if needed
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    // Handle YYYY-MM-DD format from input
    if (dateString.includes("-")) {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    }
    // Already in DD/MM/YYYY
    return dateString;
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      pageIndex: newPage,
    });
  };

  const renderFarmActivitiesSection = () => (
    <div className="mb-4 col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Farm Activities (Select one or more)
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {farmActivities.map((activity) => (
          <div key={activity.farmActivitiesId} className="flex items-center">
            <input
              type="checkbox"
              id={`activity-${activity.farmActivitiesId}`}
              checked={formData.farmActivities.includes(
                activity.farmActivitiesId.toString()
              )}
              onChange={() =>
                handleActivitySelection(activity.farmActivitiesId.toString())
              }
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label
              htmlFor={`activity-${activity.farmActivitiesId}`}
              className="ml-2 block text-sm text-gray-700"
            >
              {activity.activityType} (
              {formatDateForDisplay(activity.startDate)} -{" "}
              {formatDateForDisplay(activity.endDate)})
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderViewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Schedule Details #{currentSchedule.scheduleId}
        </h2>

        {/* Basic Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            {formatDateForDisplay(currentSchedule.startDate)}
          </div>
          <div className="mb-2">
            <span className="font-medium">End Date:</span>{" "}
            {formatDateForDisplay(currentSchedule.endDate)}
          </div>
          <div className="mb-2">
            <span className="font-medium">Planting Date:</span>{" "}
            {formatDateForDisplay(currentSchedule.plantingDate) || "N/A"}
          </div>
        </div>

        {/* Farm Information */}
        {farms.find((f) => f.farmId === currentSchedule.farmId) && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Farm Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {
                  farms.find((f) => f.farmId === currentSchedule.farmId)
                    ?.farmName
                }
              </div>
              <div>
                <span className="font-medium">Location:</span>{" "}
                {
                  farms.find((f) => f.farmId === currentSchedule.farmId)
                    ?.location
                }
              </div>
            </div>
          </div>
        )}

        {/* Crop Information */}
        {currentSchedule.cropView && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Crop Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {currentSchedule.cropView.cropName}
              </div>
              <div>
                <span className="font-medium">Description:</span>{" "}
                {currentSchedule.cropView.description || "N/A"}
              </div>
            </div>
          </div>
        )}

        {/* Farm Activities */}
        {currentSchedule.farmActivityView?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Farm Activities</h3>
            <div className="space-y-3">
              {currentSchedule.farmActivityView.map((activity, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {activity.activityType}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {activity.status}
                    </div>
                    <div>
                      <span className="font-medium">Start Date:</span>{" "}
                      {formatDateForDisplay(activity.startDate)}
                    </div>
                    <div>
                      <span className="font-medium">End Date:</span>{" "}
                      {formatDateForDisplay(activity.endDate)}
                    </div>
                  </div>
                </div>
              ))}
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
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Farming Schedules
          </h1>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={() => {
              setIsCreateModalOpen(true);
              setModalError(null);
            }}
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
                  <td className="py-2 px-4 border">
                    {formatDateForDisplay(schedule.startDate)}
                  </td>
                  <td className="py-2 px-4 border">
                    {formatDateForDisplay(schedule.endDate)}
                  </td>
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
          <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Schedule
            </h2>
            {modalError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                {modalError}
              </div>
            )}
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Planting Date
                  </label>
                  <input
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To (Staff)
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                    min="0"
                  />
                </div>
                {renderFarmActivitiesSection()}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm
                  </label>
                  <select
                    name="farmDetailsId"
                    value={formData.farmDetailsId}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop
                  </label>
                  <select
                    name="cropId"
                    value={formData.cropId}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Edit Schedule #{currentSchedule.scheduleId}
            </h2>
            {modalError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                {modalError}
              </div>
            )}
            <form onSubmit={handleUpdateSchedule}>
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Planting Date
                  </label>
                  <input
                    type="date"
                    name="plantingDate"
                    value={formData.plantingDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To (Staff)
                  </label>
                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                    min="0"
                  />
                </div>
                {renderFarmActivitiesSection()}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm
                  </label>
                  <select
                    name="farmDetailsId"
                    value={formData.farmDetailsId}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop
                  </label>
                  <select
                    name="cropId"
                    value={formData.cropId}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
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
      {isViewModalOpen && currentSchedule && renderViewModal()}
    </div>
  );
};

export default FarmingSchedules;
