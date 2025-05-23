// Staff/DeviceDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

const DeviceDetails = () => {
  const { id } = useParams();

  // Sample device data - in a real app, this would come from an API
  const device = {
    id: id,
    name: "Temperature Sensor 1",
    type: "Sensor",
    model: "TS-2000",
    location: "Greenhouse A",
    status: "Active",
    battery: 85,
    lastReading: "24°C",
    lastUpdated: "2023-05-05 14:30",
    installDate: "2023-01-15",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Device Details</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Edit Device
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Device Name:</span>
              <span className="font-medium">{device.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{device.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model:</span>
              <span className="font-medium">{device.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{device.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Installation Date:</span>
              <span className="font-medium">{device.installDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Status Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Status:</span>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  device.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {device.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Battery Level:</span>
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
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Reading:</span>
              <span className="font-medium">{device.lastReading}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{device.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4">Recent Readings</h3>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">
            Temperature readings chart for the last 7 days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Maintenance History</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">Battery Replacement</p>
              <p className="text-sm text-gray-500">2023-03-15 by John Doe</p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">Calibration Check</p>
              <p className="text-sm text-gray-500">2023-02-28 by Jane Smith</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Device Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100 border border-blue-200">
              Calibrate Device
            </button>
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100 border border-yellow-200">
              Run Diagnostic Test
            </button>
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100 border border-red-200 text-red-600">
              Decommission Device
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
