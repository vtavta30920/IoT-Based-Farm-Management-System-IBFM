// Staff/IotDevices.jsx
import React from "react";

const IotDevices = () => {
  // Sample device data
  const devices = [
    {
      id: 1,
      name: "Temperature Sensor 1",
      type: "Sensor",
      location: "Greenhouse A",
      status: "Active",
      battery: 85,
    },
    {
      id: 2,
      name: "Humidity Sensor 2",
      type: "Sensor",
      location: "Greenhouse B",
      status: "Active",
      battery: 72,
    },
    {
      id: 3,
      name: "Irrigation Controller",
      type: "Controller",
      location: "Field 1",
      status: "Maintenance",
      battery: 15,
    },
    {
      id: 4,
      name: "Soil Moisture Sensor",
      type: "Sensor",
      location: "Field 2",
      status: "Active",
      battery: 90,
    },
    {
      id: 5,
      name: "Weather Station",
      type: "Station",
      location: "Main Building",
      status: "Inactive",
      battery: 0,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        IoT Devices Management
      </h2>

      <div className="mb-6">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-3">
          Add New Device
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Run Diagnostics
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Battery
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {devices.map((device) => (
              <tr key={device.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {device.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{device.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{device.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      device.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : device.status === "Maintenance"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className={`h-2.5 rounded-full 
                          ${
                            device.battery > 50
                              ? "bg-green-600"
                              : device.battery > 20
                              ? "bg-yellow-500"
                              : "bg-red-600"
                          }`}
                        style={{ width: `${device.battery}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{device.battery}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    Details
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Device Status Overview</h3>
          <div className="h-64 bg-white rounded flex items-center justify-center">
            <p className="text-gray-500">
              Pie chart showing device status distribution
            </p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded shadow-sm flex items-start">
              <span className="w-3 h-3 bg-red-500 rounded-full mt-1 mr-3"></span>
              <div>
                <p className="font-medium">
                  Irrigation Controller needs attention
                </p>
                <p className="text-sm text-gray-500">
                  Low battery (15%) - Field 1
                </p>
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm flex items-start">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mt-1 mr-3"></span>
              <div>
                <p className="font-medium">Humidity Sensor 2 offline</p>
                <p className="text-sm text-gray-500">
                  Last seen 2 hours ago - Greenhouse B
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IotDevices;
