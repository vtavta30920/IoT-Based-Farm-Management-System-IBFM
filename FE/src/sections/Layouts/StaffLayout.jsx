import React, { useContext } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

const StaffLayout = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Staff Dashboard</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/staff/iot-devices"
                className="block p-2 hover:bg-purple-700 rounded"
              >
                IoT Devices
              </Link>
            </li>
            <li>
              <Link
                to="/staff/farming-tasks"
                className="block p-2 hover:bg-purple-700 rounded"
              >
                Farming Tasks
              </Link>
            </li>
            <li>
              <Link
                to="/staff/quality-control"
                className="block p-2 hover:bg-purple-700 rounded"
              >
                Quality Control
              </Link>
            </li>
            <li>
              <Link
                to="/staff/logistics"
                className="block p-2 hover:bg-purple-700 rounded"
              >
                Logistics
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full text-left p-2 hover:bg-purple-700 rounded"
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

export default StaffLayout;
