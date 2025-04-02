import React, { useContext } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const ManagerLayout = () => {
  const { user, role, logout } = useContext(UserContext);
  const navigate = useNavigate();

  if (role !== "manager") {
    navigate("/");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Manager Dashboard</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/manager/iot-monitoring"
                className="block p-2 hover:bg-blue-700 rounded"
              >
                IoT Monitoring
              </Link>
            </li>
            <li>
              <Link
                to="/manager/farming-schedules"
                className="block p-2 hover:bg-blue-700 rounded"
              >
                Farming Schedules
              </Link>
            </li>
            <li>
              <Link
                to="/manager/inventory"
                className="block p-2 hover:bg-blue-700 rounded"
              >
                Inventory Management
              </Link>
            </li>
            <li>
              <Link
                to="/manager/reports"
                className="block p-2 hover:bg-blue-700 rounded"
              >
                Reports
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full text-left p-2 hover:bg-blue-700 rounded"
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

export default ManagerLayout;
