// Manager/IotMonitoring.jsx
import React from "react";

const IotMonitoring = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        IoT Monitoring Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Temperature Monitoring */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Temperature Sensors</h3>
          <div className="h-40 bg-white rounded flex items-center justify-center">
            <p className="text-gray-500">Temperature Data Visualization</p>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Last updated: 5 minutes ago</p>
            <p className="mt-1">Average: 24°C</p>
          </div>
        </div>

        {/* Humidity Monitoring */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Humidity Sensors</h3>
          <div className="h-40 bg-white rounded flex items-center justify-center">
            <p className="text-gray-500">Humidity Data Visualization</p>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Last updated: 5 minutes ago</p>
            <p className="mt-1">Average: 65% RH</p>
          </div>
        </div>

        {/* Irrigation Systems */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Irrigation Systems</h3>
          <div className="h-40 bg-white rounded flex items-center justify-center">
            <p className="text-gray-500">Irrigation Status</p>
          </div>
          <div className="mt-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Schedule Irrigation
            </button>
          </div>
        </div>

        {/* System Alerts */}
        <div className="md:col-span-2 lg:col-span-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">System Alerts</h3>
          <div className="bg-white rounded p-4">
            <div className="flex items-center p-2 border-b border-gray-100">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
              <p>High temperature detected in Greenhouse 2</p>
            </div>
            <div className="flex items-center p-2 border-b border-gray-100">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
              <p>Irrigation system in North field needs maintenance</p>
            </div>
            <div className="flex items-center p-2">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <p>All systems normal in Greenhouse 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IotMonitoring;
