// Staff/QualityControl.jsx
import React from "react";

const QualityControl = () => {
  // Sample quality checks data
  const qualityChecks = [
    {
      id: 1,
      product: "Organic Tomatoes",
      batch: "T-2023-05-01",
      inspector: "Jane Smith",
      date: "2023-05-03",
      status: "Passed",
      issues: 0,
    },
    {
      id: 2,
      product: "Basil",
      batch: "B-2023-04-28",
      inspector: "John Doe",
      date: "2023-04-30",
      status: "Passed",
      issues: 1,
    },
    {
      id: 3,
      product: "Strawberries",
      batch: "S-2023-05-02",
      inspector: "You",
      date: "2023-05-04",
      status: "Pending",
      issues: null,
    },
    {
      id: 4,
      product: "Lettuce",
      batch: "L-2023-04-25",
      inspector: "Mike Johnson",
      date: "2023-04-27",
      status: "Failed",
      issues: 3,
    },
    {
      id: 5,
      product: "Mint",
      batch: "M-2023-05-01",
      inspector: "You",
      date: "2023-05-05",
      status: "In Progress",
      issues: null,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Quality Control</h2>
        <div className="space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            New Quality Check
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Generate Report
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">Passed Checks</p>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">Failed Checks</p>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">Pending Checks</p>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">In Progress</p>
          <p className="text-2xl font-bold">1</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inspector
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issues
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {qualityChecks.map((check) => (
              <tr key={check.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {check.product}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{check.batch}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{check.inspector}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{check.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      check.status === "Passed"
                        ? "bg-green-100 text-green-800"
                        : check.status === "Failed"
                        ? "bg-red-100 text-red-800"
                        : check.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {check.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {check.issues !== null ? check.issues : "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    View
                  </button>
                  {check.status === "In Progress" && (
                    <button className="text-blue-600 hover:text-blue-900">
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Quality Trends</h3>
          <div className="h-64 bg-white rounded flex items-center justify-center">
            <p className="text-gray-500">Quality trends over time chart</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Common Issues</h3>
          <div className="bg-white rounded p-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>Size Variation</span>
              <span className="font-medium">4 occurrences</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span>Color Imperfections</span>
              <span className="font-medium">3 occurrences</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Packaging Damage</span>
              <span className="font-medium">2 occurrences</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControl;
