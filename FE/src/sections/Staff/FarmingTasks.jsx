// Staff/FarmingTasks.jsx
import React from "react";

const FarmingTasks = () => {
  // Sample tasks data
  const tasks = [
    {
      id: 1,
      name: "Tomato Planting",
      type: "Planting",
      area: "Greenhouse A",
      assignedTo: "John Doe",
      dueDate: "2023-05-15",
      status: "In Progress",
    },
    {
      id: 2,
      name: "Lettuce Harvest",
      type: "Harvesting",
      area: "Field 2",
      assignedTo: "Jane Smith",
      dueDate: "2023-05-10",
      status: "Completed",
    },
    {
      id: 3,
      name: "Basil Pruning",
      type: "Maintenance",
      area: "Greenhouse B",
      assignedTo: "Mike Johnson",
      dueDate: "2023-05-12",
      status: "Pending",
    },
    {
      id: 4,
      name: "Strawberry Fertilization",
      type: "Fertilizing",
      area: "Field 1",
      assignedTo: "You",
      dueDate: "2023-05-08",
      status: "Overdue",
    },
    {
      id: 5,
      name: "Irrigation Check",
      type: "Inspection",
      area: "All Fields",
      assignedTo: "Team",
      dueDate: "2023-05-05",
      status: "Completed",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Farming Tasks</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Create New Task
        </button>
      </div>

      <div className="mb-6 flex space-x-4">
        <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
          All Tasks
        </button>
        <button className="px-4 py-2 text-gray-600 rounded-lg font-medium">
          Pending
        </button>
        <button className="px-4 py-2 text-gray-600 rounded-lg font-medium">
          In Progress
        </button>
        <button className="px-4 py-2 text-gray-600 rounded-lg font-medium">
          Completed
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
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
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {task.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{task.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.area}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.assignedTo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.dueDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : task.status === "Overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    View
                  </button>
                  {task.status !== "Completed" && (
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Task Completion</h3>
          <div className="h-48 bg-white rounded flex items-center justify-center">
            <p className="text-gray-500">Completion rate chart</p>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Upcoming Tasks</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">Tomato Planting</p>
              <p className="text-sm text-gray-500">
                Due: 2023-05-15 (in 3 days)
              </p>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">Basil Pruning</p>
              <p className="text-sm text-gray-500">
                Due: 2023-05-12 (tomorrow)
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100">
              Mark Irrigation Check as Complete
            </button>
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100">
              Request Assistance with Strawberry Fertilization
            </button>
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100">
              Report Issue with Greenhouse A
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmingTasks;
