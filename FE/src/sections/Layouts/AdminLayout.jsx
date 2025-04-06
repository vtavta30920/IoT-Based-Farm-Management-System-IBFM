import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { SidebarContext } from "../../SidebarToggle";
import { useGetAllAccount } from "../../api/AccountEndPoint";

const AdminLayout = () => {
  const { user, logout } = useContext(UserContext);
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const [currentPage, setCurrentPage] = useState("1");
  const pageSize = 5;

  const queryGetAllAccount = useGetAllAccount(currentPage, pageSize);
  const data = queryGetAllAccount.data;
  const users = data?.items;
  const totalPages = data?.totalPages || 1;

  const statusColors = {
    Seated: "bg-green-100 text-green-800",
    Suspended: "bg-red-100 text-red-800",
    Unseated: "bg-yellow-100 text-yellow-800",
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome,{" "}
              <span className="text-green-600">
                {user?.fullname || user?.email || "User"}
              </span>
            </h2>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-6">
          <input
            type="text"
            placeholder="Search User"
            className="w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </main>

        {/* table */}
        <div className="flex justify-center mt-6">
          <div className="w-full max-w-7xl overflow-x-auto rounded-lg shadow-sm bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Fullname</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users?.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.fullname || user.username}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusColors[user.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageClick(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
