// Manager/Reports.jsx
import React from "react";

const Reports = () => {
  // Sample report data
  const reports = [
    {
      id: 1,
      name: "Monthly Production Report",
      type: "Production",
      date: "2023-05-01",
      status: "Generated",
    },
    {
      id: 2,
      name: "Q1 Revenue Analysis",
      type: "Financial",
      date: "2023-04-15",
      status: "Pending Review",
    },
    {
      id: 3,
      name: "Harvest Yield Comparison",
      type: "Performance",
      date: "2023-03-28",
      status: "Generated",
    },
    {
      id: 4,
      name: "Annual Sales Summary",
      type: "Sales",
      date: "2023-01-10",
      status: "Archived",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Farm Reports</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Generate New Report
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">This Month's Production</p>
            <p className="text-2xl font-bold">1,250 kg</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold">$8,750</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Expenses</p>
            <p className="text-2xl font-bold">$3,200</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500">Yield Rate</p>
            <p className="text-2xl font-bold">92%</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {report.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{report.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        report.status === "Generated"
                          ? "bg-green-100 text-green-800"
                          : report.status === "Pending Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-3">
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
