import React, { useState } from "react";
import {
  useGetAllActivities,
  useCreateActivity,
  useChangeActivityStatus,
  useUpdateActivity,
} from "../../api/ActivityEndPoint";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;
const activityTypeOptions = [
  { label: "Sowing", value: 0 },
  { label: "Protection", value: 1 },
  { label: "Irrigation", value: 2 },
  { label: "Fertilization", value: 3 },
  { label: "Harvesting", value: 4 },
];
const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Complete", value: "COMPLETE" },
  { label: "In Progress", value: "IN_PROGRESS" },
];

const months = [
  { label: "All", value: "" },
  ...Array.from({ length: 12 }, (_, i) => ({
    label: `Month ${i + 1}`,
    value: i + 1,
  })),
];

const ActivityManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [form, setForm] = useState({
    activityType: "",
    startDate: "",
    endDate: "",
  });
  const [formError, setFormError] = useState("");
  const [editForm, setEditForm] = useState({
    farmActivitiesId: null,
    activityType: "",
    startDate: "",
    endDate: "",
  });
  const [editFormError, setEditFormError] = useState("");
  const [statusModal, setStatusModal] = useState({
    open: false,
    activity: null,
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMonth, setFilterMonth] = useState("");

  const queryClient = useQueryClient();
  const createActivity = useCreateActivity();
  const changeStatus = useChangeActivityStatus();
  const updateActivity = useUpdateActivity();

  // Sử dụng hook mới với filter
  const { data, isLoading, isError, error } = useGetAllActivities(
    pageIndex,
    PAGE_SIZE,
    filterType,
    filterStatus,
    filterMonth
  );

  // Chuẩn hóa lấy danh sách activities từ nhiều trường có thể có
  let activities = [];
  let total = 0;
  let totalPages = 1;
  if (Array.isArray(data?.data)) {
    activities = data.data;
    total = data?.total || data?.totalCount || data?.data?.length || 0;
    totalPages = data?.totalPagesCount || Math.ceil(total / PAGE_SIZE) || 1;
  } else if (Array.isArray(data?.items)) {
    activities = data.items;
    total = data?.total || data?.totalCount || data?.items?.length || 0;
    totalPages = data?.totalPagesCount || Math.ceil(total / PAGE_SIZE) || 1;
  } else if (Array.isArray(data?.data?.items)) {
    activities = data.data.items;
    total =
      data.data?.total ||
      data.data?.totalCount ||
      data.data?.items?.length ||
      0;
    totalPages =
      data.data?.totalPagesCount || Math.ceil(total / PAGE_SIZE) || 1;
  } else if (Array.isArray(data)) {
    activities = data;
    total = data.length;
    totalPages = Math.ceil(total / PAGE_SIZE) || 1;
  }

  // Helper: kiểm tra ngày không phải quá khứ và không phải ngày hiện tại
  const isFutureDate = (dateStr) => {
    if (!dateStr) return false;
    const inputDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate > today;
  };

  // Helper: kiểm tra startDate không vượt quá endDate
  const isStartBeforeEnd = (start, end) => {
    if (!start || !end) return true;
    return new Date(start) <= new Date(end);
  };

  // Helper: kiểm tra khoảng cách giữa start và end là ít nhất 7 ngày
  const isAtLeastOneWeekApart = (start, end) => {
    if (!start || !end) return false;
    const startDate = new Date(start);
    const endDate = new Date(end);
    // Tính số ngày chênh lệch (UTC, không tính giờ)
    const diffDays = Math.round(
      (endDate.setHours(0, 0, 0, 0) - startDate.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24)
    );
    return diffDays >= 7;
  };

  // Xử lý submit tạo activity
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.activityType && form.activityType !== 0) {
      setFormError("Please select activity type");
      return;
    }
    if (!form.startDate || !form.endDate) {
      setFormError("Please select start and end date");
      return;
    }
    if (!isFutureDate(form.startDate) || !isFutureDate(form.endDate)) {
      setFormError(
        "Start date and End date must be in the future (not today or past)"
      );
      return;
    }
    if (!isStartBeforeEnd(form.startDate, form.endDate)) {
      setFormError("Start date must not be after End date");
      return;
    }
    if (!isAtLeastOneWeekApart(form.startDate, form.endDate)) {
      setFormError(
        "The distance between Start date and End date must be at least 7 days"
      );
      return;
    }
    try {
      await createActivity.mutateAsync({
        activityType: form.activityType,
        startDate: form.startDate,
        endDate: form.endDate,
      });
      setIsCreateModalOpen(false);
      setForm({ activityType: "", startDate: "", endDate: "" });
      setNotification({
        show: true,
        message: "Create activity successfully!",
        type: "success",
      });
      // Refetch activities to update UI immediately
      queryClient.invalidateQueries({ queryKey: ["farm-activity"] });
    } catch (err) {
      setFormError(err?.response?.data?.message || "Create failed");
    }
  };

  // Helper: chuẩn hóa date về format yyyy-MM-dd cho input type="date"
  const toInputDate = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        let d, m, y;
        if (parts[2].length === 4) {
          if (parseInt(parts[0], 10) > 12) {
            d = parts[0];
            m = parts[1];
            y = parts[2];
          } else {
            m = parts[0];
            d = parts[1];
            y = parts[2];
          }
          return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
      }
    }
    if (dateStr.includes("T")) {
      return dateStr.slice(0, 10);
    }
    return dateStr;
  };

  // Helper: tính ngày enddate sau startdate 7 ngày (format yyyy-MM-dd)
  const calcEndDate = (startDate) => {
    if (!startDate) return "";
    const d = new Date(startDate);
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  };

  // Helper: chuẩn hóa date về format dd/MM/yyyy cho hiển thị
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    // Nếu đã là dd/MM/yyyy thì trả về luôn
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
    // Nếu là yyyy-MM-dd hoặc yyyy-MM-ddTHH:mm:ss
    let d = dateStr.includes("T") ? dateStr.slice(0, 10) : dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [y, m, day] = d.split("-");
      return `${day.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
    }
    // Nếu là d/m/yyyy hoặc dd/mm/yyyy
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts[0].length === 4) {
        // yyyy/mm/dd
        return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${
          parts[0]
        }`;
      }
      // dd/mm/yyyy
      return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${
        parts[2]
      }`;
    }
    return dateStr;
  };

  // Xử lý mở modal update và load data lên form
  const openEditModal = (activity) => {
    setEditForm({
      farmActivitiesId: activity.farmActivitiesId,
      activityType:
        activity.activityTypeIndex !== undefined
          ? activity.activityTypeIndex
          : typeof activity.activityType === "number"
          ? activity.activityType
          : activityTypeOptions.findIndex(
              (opt) => opt.label === activity.activityType
            ),
      startDate: toInputDate(activity.startDate),
      endDate: toInputDate(activity.endDate),
    });
    setEditFormError("");
    setIsEditModalOpen(true);
  };

  // Xử lý submit update activity
  const handleEdit = async (e) => {
    e.preventDefault();
    setEditFormError("");
    if (
      editForm.activityType === "" ||
      editForm.startDate === "" ||
      editForm.endDate === ""
    ) {
      setEditFormError("Please fill all fields");
      return;
    }
    if (!isFutureDate(editForm.startDate) || !isFutureDate(editForm.endDate)) {
      setEditFormError(
        "Start date and End date must be in the future (not today or past)"
      );
      return;
    }
    if (!isStartBeforeEnd(editForm.startDate, editForm.endDate)) {
      setEditFormError("Start date must not be after End date");
      return;
    }
    if (!isAtLeastOneWeekApart(editForm.startDate, editForm.endDate)) {
      setEditFormError(
        "The distance between Start date and End date must be at least 7 days"
      );
      return;
    }
    try {
      await updateActivity.mutateAsync({
        farmActivitiesId: editForm.farmActivitiesId,
        activityType: editForm.activityType,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
      });
      setIsEditModalOpen(false);
      setNotification({
        show: true,
        message: "Update activity successfully!",
        type: "success",
      });
      // Refetch activities to update UI immediately
      queryClient.invalidateQueries({ queryKey: ["farm-activity"] });
    } catch (err) {
      setEditFormError(err?.response?.data?.message || "Update failed");
    }
  };

  // Xử lý đổi trạng thái
  const handleChangeStatus = async () => {
    if (!statusModal.activity) return;
    try {
      await changeStatus.mutateAsync(statusModal.activity.farmActivitiesId);
      setStatusModal({ open: false, activity: null });
      setNotification({
        show: true,
        message: "Change status successfully!",
        type: "success",
      });
      // Refetch activities to update UI immediately
      queryClient.invalidateQueries({ queryKey: ["farm-activity"] });
    } catch (err) {
      setStatusModal({ open: false, activity: null });
      setNotification({
        show: true,
        message: "Change status failed!",
        type: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
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

      {/* Modal confirm change status */}
      {statusModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirm Change Status</h2>
            <div className="mb-4">
              Are you sure you want to change the status of this activity?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setStatusModal({ open: false, activity: null })}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleChangeStatus}
                disabled={changeStatus.isLoading}
              >
                {changeStatus.isLoading ? "Changing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Activity</h2>
            {formError && (
              <div className="mb-3 text-red-600 text-sm">{formError}</div>
            )}
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Activity Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={form.activityType}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      activityType: Number(e.target.value),
                    }))
                  }
                  required
                >
                  <option value="">Select activity type</option>
                  {activityTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={toInputDate(form.startDate)}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setForm((f) => ({
                      ...f,
                      startDate: newStart,
                      endDate: newStart ? calcEndDate(newStart) : "",
                    }));
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={toInputDate(form.endDate)}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  disabled={createActivity.isLoading}
                >
                  {createActivity.isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Activity</h2>
            {editFormError && (
              <div className="mb-3 text-red-600 text-sm">{editFormError}</div>
            )}
            <form onSubmit={handleEdit}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Activity Type</label>
                <select
                  className="w-full p-2 border rounded"
                  value={editForm.activityType}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      activityType: Number(e.target.value),
                    }))
                  }
                  required
                >
                  <option value="">Select activity type</option>
                  {activityTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={toInputDate(editForm.startDate)}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setEditForm((f) => ({
                      ...f,
                      startDate: newStart,
                      endDate: newStart ? calcEndDate(newStart) : "",
                    }));
                  }}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={toInputDate(editForm.endDate)}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditFormError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-4 py-2 rounded"
                  disabled={updateActivity.isLoading}
                >
                  {updateActivity.isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Activity Management
          </h1>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + New Activity
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div>
            <label className="mr-2 font-medium">Activity Type:</label>
            <select
              className="p-2 border rounded"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPageIndex(1);
              }}
            >
              <option value="">All</option>
              {activityTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2 font-medium">Status:</label>
            <select
              className="p-2 border rounded"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPageIndex(1);
              }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2 font-medium">Month:</label>
            <select
              className="p-2 border rounded"
              value={filterMonth}
              onChange={(e) => {
                setFilterMonth(e.target.value);
                setPageIndex(1);
              }}
            >
              {months.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                No
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Activity Type
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                Start Date
              </th>
              <th className="py-3 px-4 text-center text-gray-600 font-semibold">
                End Date
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
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No activities found
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => {
                // Xác định màu theo status
                let statusClass = "";
                if (activity.status === "ACTIVE") {
                  statusClass = "bg-green-100 text-green-800";
                } else if (activity.status === "INACTIVE") {
                  statusClass = "bg-red-100 text-red-800";
                } else if (
                  activity.status === "COMPLETE" ||
                  activity.status === "COMPLETED"
                ) {
                  statusClass = "bg-lime-100 text-lime-700"; // màu lục
                } else if (
                  activity.status === "IN_PROGRESS" ||
                  activity.status === "INPROGRESS"
                ) {
                  statusClass = "bg-blue-100 text-blue-700"; // màu xanh dương
                } else {
                  statusClass = "bg-gray-100 text-gray-700";
                }
                return (
                  <tr
                    key={activity.farmActivitiesId}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-2 px-4 border text-center">
                      {(pageIndex - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {activity.activityType}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {formatDateDisplay(activity.startDate)}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {formatDateDisplay(activity.endDate)}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <div className="flex justify-center">
                        <button
                          className={`px-2 py-1 rounded text-xs w-24 flex items-center justify-center ${statusClass}`}
                          onClick={() =>
                            setStatusModal({ open: true, activity })
                          }
                        >
                          {activity.status}
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                        onClick={() => openEditModal(activity)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination giống orderlist current */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={pageIndex === 1}
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageIndex} / {totalPages || 1}
        </span>
        <button
          disabled={pageIndex === totalPages || totalPages === 0}
          onClick={() => setPageIndex((prev) => prev + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityManagement;
