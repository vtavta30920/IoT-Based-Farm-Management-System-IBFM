import React, { useEffect, useState } from "react";
import {
  getBlynkData,
  getIotDevices,
  getAllIotDevices,
  createIotDevice,
  getAllFarms,
} from "../../api/api";

const IotDevices = ({ token }) => {
  const [blynkData, setBlynkData] = useState(null);
  const [iotDevices, setIotDevices] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    deviceName: "",
    deviceType: "",
    unit: "",
    expiryDate: "",
    farmId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blynkData, devicesData, farmsData] = await Promise.all([
          getBlynkData(token),
          getAllIotDevices(token), // Fetch all devices
          getAllFarms(token),
        ]);
        setBlynkData(blynkData);
        setIotDevices(devicesData); // Now receives the complete array
        setFarms(farmsData);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [token]);
  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      await createIotDevice(
        {
          deviceName: newDevice.deviceName,
          deviceType: newDevice.deviceType,
          unit: newDevice.unit,
          expiryDate: newDevice.expiryDate,
          farmDetailsId: parseInt(newDevice.farmId),
        },
        token
      );
      const devicesData = await getAllIotDevices(token); // Fetch all devices again

      setIotDevices(devicesData.data.items);
      setShowAddDevice(false);
      setNewDevice({
        deviceName: "",
        deviceType: "",
        unit: "",
        expiryDate: "",
        farmId: "",
      });
    } catch (err) {
      console.error("Error creating device:", err);
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFarmInfo = (farmId) => {
    const farm = farms.find((f) => f.farmId === farmId);
    return farm || { farmName: `Farm ID: ${farmId}`, location: "Unknown" };
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        IoT Devices Dashboard
      </h2>

      <div className="mb-6">
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-lg mb-2">Blynk Console</h3>
          <div className="text-gray-600 mb-2">IOT BaseFarm</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temperature Card */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Temperature</h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {blynkData.v0}°C
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${blynkData.v0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          {/* Humidity Card */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Humidity</h3>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {blynkData.v1}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${blynkData.v1}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          {/* Rainfall Card */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Rainfall</h3>
            <div className="text-2xl font-bold text-indigo-600 mb-2">
              {blynkData.v3}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${blynkData.v3}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          {/* Soil Moisture Card */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Soil Moisture</h3>
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {blynkData.v2}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${blynkData.v2}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Light Card */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Light</h3>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {blynkData.v4}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${(blynkData.v4 / 1095) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>1095</span>
            </div>
          </div>
        </div>
      </div>
      {/* IoT Devices Management Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Registered IoT Devices
            </h3>
            <p className="text-sm text-gray-500">
              Manage all connected IoT devices across your farms
            </p>
          </div>
          <button
            onClick={() => setShowAddDevice(!showAddDevice)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {showAddDevice ? "Cancel" : "Add Device"}
          </button>
        </div>

        {/* Add Device Form */}
        {showAddDevice && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
            <h4 className="font-semibold text-lg mb-4 text-gray-700">
              Register New IoT Device
            </h4>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Device Name*
                  </label>
                  <input
                    type="text"
                    name="deviceName"
                    value={newDevice.deviceName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="e.g., Thermocouple-1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Device Type*
                  </label>
                  <select
                    name="deviceType"
                    value={newDevice.deviceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select device type</option>
                    <option value="Temperature IC">Temperature IC</option>
                    <option value="Humidity measurement IC">Humidity IC</option>
                    <option value="Soil Moisture Sensor IC">
                      Soil Moisture IC
                    </option>
                    <option value="Rain Sensor">Rain Sensor</option>
                    <option value="Light Sensor">Light Sensor</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expiry Date*
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={newDevice.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit*
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={newDevice.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="e.g., °C, %"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Farm*
                  </label>
                  <select
                    name="farmId"
                    value={newDevice.farmId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select farm</option>
                    {farms.map((farm) => (
                      <option key={farm.farmId} value={farm.farmId}>
                        {farm.farmName} ({farm.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddDevice(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Register Device
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Devices Table */}
        <div className="overflow-hidden border border-gray-200 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Device
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Update
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expiry Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Farm
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {iotDevices.length > 0 ? (
                iotDevices.map((device, index) => {
                  const farm = getFarmInfo(device.farmDetailsId);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-blue-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {device.deviceName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {device.deviceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            device.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {device.status === 1 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(device.lastUpdate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(device.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {farm.farmName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {farm.location}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No IoT devices found. Add your first device to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IotDevices;
