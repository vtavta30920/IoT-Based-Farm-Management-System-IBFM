import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { SidebarContext } from "../../SidebarToggle";
import { useGetAllAccount } from "../../api/AccountEndPoint";

const AdminLayout = () => {
  const { user, logout } = useContext(UserContext);
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  const queryGetAllAccount = useGetAllAccount(1, 10);
  const data = queryGetAllAccount.data;
  const users = data?.items;
  console.log(users);

  const statusColors = {
    Seated: "bg-green-100 text-green-800",
    Suspended: "bg-red-100 text-red-800",
    Unseated: "bg-yellow-100 text-yellow-800",
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
      </div>
    </div>
  );
};

export default AdminLayout;
