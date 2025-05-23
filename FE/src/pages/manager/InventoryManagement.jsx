// Manager/InventoryManagement.jsx
import React from "react";

const InventoryManagement = () => {
  // Sample inventory data
  const inventoryItems = [
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Vegetables",
      quantity: 150,
      unit: "kg",
      location: "Warehouse A",
    },
    {
      id: 2,
      name: "Basil",
      category: "Herbs",
      quantity: 30,
      unit: "kg",
      location: "Greenhouse 1",
    },
    {
      id: 3,
      name: "Strawberries",
      category: "Fruits",
      quantity: 45,
      unit: "kg",
      location: "Cold Storage",
    },
    {
      id: 4,
      name: "Lettuce",
      category: "Vegetables",
      quantity: 80,
      unit: "kg",
      location: "Warehouse B",
    },
    {
      id: 5,
      name: "Mint",
      category: "Herbs",
      quantity: 25,
      unit: "kg",
      location: "Greenhouse 2",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">
          Inventory Management
        </h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add New Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.quantity} {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Inventory Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Low Stock Items</p>
            <p className="text-2xl font-bold">2</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
