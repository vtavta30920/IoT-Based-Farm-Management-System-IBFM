import React, { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { SidebarContext } from "../../SidebarToggle";
import { useGetAllAccount } from "../../api/AccountEndPoint";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { user, logout } = useContext(UserContext);
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [currentMenu, setCurrentMenu] = useState(null);

  const queryGetAllAccount = useGetAllAccount(currentPage, pageSize);
  const data = queryGetAllAccount.data;
  const users = data?.items;
  console.log(users);
  const totalPages = data?.totalPagesCount || 1;
  const menuRef = useRef();
  const navigate = useNavigate();

  const statusColors = {
    Seated: "bg-green-100 text-green-800",
    Suspended: "bg-red-100 text-red-800",
    Unseated: "bg-yellow-100 text-yellow-800",
  };

  const handleViewDetail = (userId) => {
    navigate(`/admin/users/${userId}`);
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

  const handleSearch = () => {
    // Thêm logic tìm kiếm tại đây
    console.log("Searching...");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setCurrentMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                {user?.fullname || user?.Email || "User"}
              </span>
            </h2>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-6">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search User"
              className="w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
              Search
            </button>
          </div>
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
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users?.map((user, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 relative ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`} // Thêm màu nền cho dòng chẵn và lẻ
                  >
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.accountProfile?.fullname || user.username}
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
                    {/* Action menu */}
                    <td className="px-6 py-4 text-right">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() =>
                            setCurrentMenu((prev) =>
                              prev === index ? null : index
                            )
                          }
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                          </svg>
                        </button>

                        {currentMenu === index && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                          >
                            <button
                              onClick={() => handleViewDetail(user.userId)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <i className="fas fa-eye mr-2"></i> Detail
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <i className="fas fa-edit mr-2"></i> Update
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <i className="fas fa-user-shield mr-2"></i> Change
                              Role
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                              <i className="fas fa-sync-alt mr-2"></i> Change
                              Status
                            </button>
                          </div>
                        )}
                      </div>
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
