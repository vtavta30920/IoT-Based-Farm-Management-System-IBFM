import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
  getUserByEmail,
  useGetAllAccount,
  updateStatus,
} from "../../api/AccountEndPoint";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const [roleFilter, setRoleFilter] = useState(""); // New state for role filter
  const [statusFilter, setStatusFilter] = useState(""); // New state for status filter

  const queryGetAllAccount = useGetAllAccount(
    currentPage,
    pageSize,
    roleFilter,
    statusFilter
  );
  const data = queryGetAllAccount.data;
  const users = data?.items;
  const totalPages = data?.totalPagesCount || 1;
  const navigate = useNavigate();

  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewDetail = (user) => {
    navigate(`/admin/users/detail`, { state: { user } });
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

  const handleSearch = async () => {
    if (searchEmail.trim() === "") {
      setSearchResult(null);
      return;
    }

    try {
      const result = await getUserByEmail(searchEmail.trim());
      if (!result || Object.keys(result).length === 0) {
        setSearchResult([]);
      } else {
        setSearchResult(Array.isArray(result) ? result : [result]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResult([]);
    }
  };

  const handleStatusChange = (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE"; // Toggle logic
    setSelectedUser({ userId, currentStatus, newStatus });
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    const { userId, newStatus } = selectedUser;
    try {
      await updateStatus(userId); // Update the user status
      await queryGetAllAccount.refetch(); // Refresh the user list
      console.log(`User status updated to: ${newStatus}`);
      setShowStatusModal(false); // Close the modal
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleCloseModal = () => {
    setShowStatusModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = searchResult !== null ? searchResult : users;

  useEffect(() => {
    queryGetAllAccount.refetch();
  }, [roleFilter, statusFilter, currentPage]);

  useEffect(() => {
    if (searchEmail.trim() === "") {
      setSearchResult(null);
    }
  }, [searchEmail]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6 flex flex-col items-center">
            <h3 className="text-3xl font-bold text-green-600 border-b-2 border-gray-300 pb-2 mb-4 text-center">
              Accounts Management
            </h3>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          <div className="flex items-center justify-between">
            {/* Phần: Search group */}
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search User by Email"
                className="w-64 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
              >
                Search
              </button>
            </div>

            {/* Filter group for Role and Status */}
            <div className="flex items-center space-x-4">
              <label
                htmlFor="status"
                className="mr-2 text-gray-600 font-medium"
              >
                Sort by:
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Role</option>
                <option value="Customer">Customer</option>
                <option value="Manager">Manager</option>
                <option value="Staff">Staff</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="BANNED">Banned</option>
              </select>
            </div>

            {/* Phần: Create Account button */}
            <button
              onClick={() => navigate("/admin/users/create")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Create Account
            </button>
          </div>
        </main>

        <div className="flex justify-center mt-6">
          <div className="w-full max-w-7xl overflow-x-auto rounded-lg shadow-sm bg-white min-h-[400px]">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Fullname</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers?.map((user, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 relative ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.accountProfile?.fullname || user.username}
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {user.role}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleStatusChange(user?.accountId, user.status)
                        }
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : user.status === "BANNED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetail(user)}
                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center items-center mt-10 space-x-2">
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
                i + 1 === currentPage ? "bg-green-500 text-white" : "bg-white"
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

      {/* Status Change Modal */}
      {showStatusModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-md w-96 shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-4">
              Are you sure you want to change the status of this user?
            </h3>
            <div className="flex justify-around space-x-4">
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
