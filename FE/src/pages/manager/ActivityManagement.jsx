import React, { useState } from "react";
import {
  useGetAllActivities,
  useCreateActivity,
  useChangeActivityStatus,
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

const ActivityManagement = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form, setForm] = useState({
    activityType: "",
    startDate: "",
    endDate: "",
  });
  const [formError, setFormError] = useState("");
  const [statusModal, setStatusModal] = useState({
    open: false,
    activity: null,
  });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const queryClient = useQueryClient();
  const createActivity = useCreateActivity();
  const changeStatus = useChangeActivityStatus();

  // Chỉ truyền pageIndex, PAGE_SIZE cho API (BE phân trang)
  const { data, isLoading, isError, error } = useGetAllActivities(
    pageIndex,
    PAGE_SIZE
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
      </div>

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
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={form.endDate}
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

      {/* Activities Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                No
              </th>
              <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                Activity Type
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
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No activities found
                </td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr
                  key={activity.farmActivitiesId}
                  className="hover:bg-gray-50"
                >
                  <td className="py-2 px-4 border">
                    {(pageIndex - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="py-2 px-4 border">{activity.activityType}</td>
                  <td className="py-2 px-4 border">{activity.startDate}</td>
                  <td className="py-2 px-4 border">{activity.endDate}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex justify-center">
                      <button
                        className={`px-2 py-1 rounded text-xs w-20 flex items-center justify-center ${
                          activity.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        onClick={() => setStatusModal({ open: true, activity })}
                      >
                        {activity.status}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
