import React, { useState } from "react";
import { useGetScheduleByStaff } from "../../api/ScheduleEndPoint";

const PAGE_SIZE = 5;

const StaffSchedule = () => {
  const { data, isLoading, isError } = useGetScheduleByStaff();
  const [pageIndex, setPageIndex] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  // Chuẩn hóa data
  const schedules = Array.isArray(data?.data) ? data.data : [];
  const totalItems = schedules.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // Phân trang
  const pagedSchedules = schedules.slice(
    (pageIndex - 1) * PAGE_SIZE,
    pageIndex * PAGE_SIZE
  );

  const handleExpand = (scheduleId) => {
    setExpandedId(expandedId === scheduleId ? null : scheduleId);
  };

  return (
    <div className="p-6 bg-white min-h-screen flex flex-col">
      <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
        My Schedules
      </h1>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="py-3 px-4 text-center border-r border-gray-300">
                No
              </th>
              <th className="py-3 px-4 text-center border-r border-gray-300">
                Start Date
              </th>
              <th className="py-3 px-4 text-center border-r border-gray-300">
                End Date
              </th>
              <th className="py-3 px-4 text-center border-r border-gray-300">
                Status
              </th>
              <th className="py-3 px-4 text-center border-r border-gray-300">
                Crop
              </th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-8 border-b border-gray-300"
                >
                  Loading schedules...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-red-600 py-8 border-b border-gray-300"
                >
                  Error loading schedules.
                </td>
              </tr>
            ) : pagedSchedules.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-500 py-8 border-b border-gray-300"
                >
                  No schedules found.
                </td>
              </tr>
            ) : (
              pagedSchedules.map((sch, idx) => (
                <React.Fragment key={sch.scheduleId}>
                  <tr className="hover:bg-gray-50 border-b border-gray-300">
                    <td className="px-4 py-2 text-center border-r border-gray-300">
                      {(pageIndex - 1) * PAGE_SIZE + idx + 1}
                    </td>
                    <td className="px-4 py-2 text-center border-r border-gray-300">
                      {sch.startDate}
                    </td>
                    <td className="px-4 py-2 text-center border-r border-gray-300">
                      {sch.endDate}
                    </td>
                    <td className="px-4 py-2 text-center border-r border-gray-300">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          sch.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sch.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center border-r border-gray-300">
                      {sch.cropView?.cropName || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleExpand(sch.scheduleId)}
                      >
                        {expandedId === sch.scheduleId ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expandedId === sch.scheduleId && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50 px-4 py-4">
                        <div>
                          <h3 className="font-semibold mb-2 text-green-700">
                            Activities
                          </h3>
                          <table className="min-w-full border border-gray-200 mb-2">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="py-2 px-3 border-r border-gray-200 text-center">
                                  Activity Type
                                </th>
                                <th className="py-2 px-3 border-r border-gray-200 text-center">
                                  Start Date
                                </th>
                                <th className="py-2 px-3 border-r border-gray-200 text-center">
                                  End Date
                                </th>
                                <th className="py-2 px-3 text-center">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(sch.farmActivityView) &&
                              sch.farmActivityView.length > 0 ? (
                                sch.farmActivityView.map((act) => (
                                  <tr key={act.farmActivitiesId}>
                                    <td className="py-2 px-3 border-r border-gray-200 text-center">
                                      {act.activityType}
                                    </td>
                                    <td className="py-2 px-3 border-r border-gray-200 text-center">
                                      {act.startDate}
                                    </td>
                                    <td className="py-2 px-3 border-r border-gray-200 text-center">
                                      {act.endDate}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                          act.status === "ACTIVE"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {act.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="text-center text-gray-500 py-4"
                                  >
                                    No activities found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
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

export default StaffSchedule;
