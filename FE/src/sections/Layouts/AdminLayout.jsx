import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getUserByEmail, useGetAllAccount } from "../../api/AccountEndPoint";
import { updateStatus } from "../../api/AccountEndPoint";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const { user } = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [currentMenu, setCurrentMenu] = useState(null);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const queryGetAllAccount = useGetAllAccount(currentPage, pageSize);

  const data = queryGetAllAccount.data;
  const users = data?.items;
  const totalPages = data?.totalPagesCount || 1;
  const menuRef = useRef();
  const navigate = useNavigate();

  const toggleRoleMenu = () => {
    setIsRoleMenuOpen((prev) => !prev); // Chuyển đổi trạng thái submenu
  };

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
      console.log("Search result:", result);

      if (!result || Object.keys(result).length === 0) {
        setSearchResult([]);
      } else {
        setSearchResult(Array.isArray(result) ? result : [result]);
      }
    } catch (error) {
      console.error(
        "Search failed:",
        error?.response || error?.message || error
      );
      setSearchResult([]);
    }
  };

  // Hàm xử lý khi chọn role từ submenu
  const handleRoleChange = async (userId, newRole) => {
    // Gọi API thay đổi role của người dùng
    try {
      await updateRole(userId, newRole);
      console.log(`User role updated to: ${newRole}`);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE"; // Toggle logic

    const isConfirmed = window.confirm(
      `Are you sure you want to change the status to ${newStatus}?`
    );

    if (isConfirmed) {
      try {
        await updateStatus(userId); // Cập nhật trạng thái người dùng
        await queryGetAllAccount.refetch(); // Làm mới danh sách người dùng sau khi thay đổi
        console.log(`User status updated to: ${newStatus}`);
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    } else {
      console.log("Status change was canceled.");
    }
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
            <h2 className="text-xl font-semibold text-gray-800 mt-2">
              Welcome,{" "}
              <span className="text-green-600">
                {user?.fullname || "Admin"}
              </span>
            </h2>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          <div className="flex items-center space-x-2">
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
                {(searchResult !== null ? searchResult : users)?.map(
                  (user, index) => (
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
                        <button
                          className={`px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800`}
                        >
                          {user.role}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={
                            () =>
                              handleStatusChange(user?.accountId, user.status) // Truyền đúng userId và status
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
                  )
                )}
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
