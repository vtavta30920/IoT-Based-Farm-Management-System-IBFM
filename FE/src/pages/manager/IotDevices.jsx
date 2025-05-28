import React, { useEffect, useState } from "react";
import { getBlynkData } from "../../api/api";

const IotDevices = ({ token }) => {
  const [blynkData, setBlynkData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        const data = await getBlynkData(token);
        setBlynkData(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [token]);

  if (loading) return <div className="p-6">Loading IoT data...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

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
              {blynkData.v2}%
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
              {blynkData.v3}%
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
                style={{ width: `${(blynkData.v4 / 6000) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>6000</span>
            </div>
          </div>

          {/* Messages Card */}
          {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-2">Messages used</h3>
            <div className="text-lg mb-2">
              <span className="font-bold">0</span> of 30%
            </div>
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
              Add Tag
            </button>
          </div> */}
        </div>

        {/* <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2">Device Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded text-center">
              Automations
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded text-center">
              Users
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded text-center">
              Organizations
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded text-center">
              Locations
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default IotDevices;
