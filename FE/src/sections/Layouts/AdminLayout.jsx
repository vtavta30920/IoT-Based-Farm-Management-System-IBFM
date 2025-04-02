import React, { useContext } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const AdminLayout = () => {
  const { user, role, logout } = useContext(UserContext);
  const navigate = useNavigate();

  if (role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/users"
                className="block p-2 hover:bg-green-700 rounded"
              >
                Manage Users
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="block p-2 hover:bg-green-700 rounded"
              >
                System Settings
              </Link>
            </li>
            <li>
              <Link
                to="/admin/performance"
                className="block p-2 hover:bg-green-700 rounded"
              >
                System Performance
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full text-left p-2 hover:bg-green-700 rounded"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Welcome, {user?.name}</h2>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
