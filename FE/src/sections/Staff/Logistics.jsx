// Staff/Logistics.jsx
import React from "react";

const Logistics = () => {
  // Sample shipments data
  const shipments = [
    {
      id: 1,
      orderId: "ORD-1001",
      destination: "Local Market",
      products: "Tomatoes, Lettuce",
      status: "Delivered",
      date: "2023-05-03",
    },
    {
      id: 2,
      orderId: "ORD-1002",
      destination: "Restaurant Chain",
      products: "Basil, Mint",
      status: "In Transit",
      date: "2023-05-05",
    },
    {
      id: 3,
      orderId: "ORD-1003",
      destination: "Organic Store",
      products: "Strawberries",
      status: "Ready for Dispatch",
    },
    {
      id: 4,
      orderId: "ORD-1004",
      destination: "Farmers Market",
      products: "Mixed Vegetables",
      status: "Processing",
      date: "2023-05-07",
    },
    {
      id: 5,
      orderId: "ORD-1005",
      destination: "Wholesaler",
      products: "Lettuce, Herbs",
      status: "Scheduled",
      date: "2023-05-08",
    },
  ];

  // Sample storage data
  const storageAreas = [
    {
      id: 1,
      name: "Cold Storage A",
      temperature: "4°C",
      capacity: "80%",
      products: "Strawberries, Lettuce",
    },
    {
      id: 2,
      name: "Cold Storage B",
      temperature: "2°C",
      capacity: "65%",
      products: "Herbs",
    },
    {
      id: 3,
      name: "Warehouse A",
      temperature: "Ambient",
      capacity: "45%",
      products: "Tomatoes, Packaging",
    },
    {
      id: 4,
      name: "Packaging Area",
      temperature: "18°C",
      capacity: "30%",
      products: "Packaging Materials",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">
          Logistics Management
        </h2>
        <div className="space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            New Shipment
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Storage Report
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Shipments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {shipment.orderId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {shipment.destination}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {shipment.products}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        shipment.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : shipment.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : shipment.status === "Ready for Dispatch"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shipment.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      Details
                    </button>
                    {shipment.status !== "Delivered" && (
                      <button className="text-blue-600 hover:text-blue-900">
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Storage Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {storageAreas.map((area) => (
            <div
              key={area.id}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <h4 className="font-semibold text-lg mb-2">{area.name}</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Temperature:</span>
                  <span className="text-sm font-medium">
                    {area.temperature}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Capacity:</span>
                  <span className="text-sm font-medium">{area.capacity}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Products:</p>
                  <p className="text-sm">{area.products}</p>
                </div>
              </div>
              <button className="mt-3 w-full bg-white text-green-600 py-1 rounded border border-green-600 hover:bg-green-50 text-sm">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Recent Deliveries</h3>
          <div className="h-64 bg-white rounded flex items-center justify-center">
            <p className="text-gray-500">Delivery performance chart</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100">
              Schedule New Delivery
            </button>
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100">
              Check Storage Conditions
            </button>
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100">
              Update Inventory Levels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logistics;
