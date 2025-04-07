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

  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const queryGetAllAccount = useGetAllAccount(currentPage, pageSize);

  const data = queryGetAllAccount.data;
  const users = data?.items;
  const totalPages = data?.totalPagesCount || 1;
  const menuRef = useRef();
  const navigate = useNavigate();

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

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE"; // Toggle logic

    try {
      // Gọi API cập nhật trạng thái
      await updateStatus(userId);

      // Sau khi cập nhật thành công, cập nhật trạng thái trực tiếp trong UI
      setSearchResult((prev) =>
        prev?.map((user) =>
          user.userId === userId ? { ...user, status: newStatus } : user
        )
      );

      console.log(`User status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Failed to update status:", error);
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
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
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
                      <td className="px-6 py-4 text-gray-700">{user.role}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleStatusChange(user.userId, user.status)
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
                                <i className="fas fa-user-shield mr-2"></i>{" "}
                                Change Role
                              </button>
                            </div>
                          )}
                        </div>
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
