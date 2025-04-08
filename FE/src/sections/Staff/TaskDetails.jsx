// Staff/TaskDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

const TaskDetails = () => {
  const { id } = useParams();

  // Sample task data - in a real app, this would come from an API
  const task = {
    id: id,
    name: "Tomato Planting",
    type: "Planting",
    area: "Greenhouse A",
    assignedTo: "John Doe",
    dueDate: "2023-05-15",
    status: "In Progress",
    priority: "High",
    description:
      "Plant new batch of organic tomatoes in Greenhouse A. Follow spacing guidelines of 45cm between plants.",
    createdBy: "Farm Manager",
    createdDate: "2023-05-01",
    comments: [
      {
        id: 1,
        author: "John Doe",
        date: "2023-05-03",
        text: "Started preparing the soil. Will complete by Friday.",
      },
      {
        id: 2,
        author: "Farm Manager",
        date: "2023-05-04",
        text: "Remember to use the new organic fertilizer mix.",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-green-700">{task.name}</h2>
          <p className="text-gray-500">Task ID: {task.id}</p>
        </div>
        <div className="space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Update Status
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Edit Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Task Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{task.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Area:</span>
              <span className="font-medium">{task.area}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Assigned To:</span>
              <span className="font-medium">{task.assignedTo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Priority:</span>
              <span
                className={`font-medium 
                ${
                  task.priority === "High"
                    ? "text-red-600"
                    : task.priority === "Medium"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {task.priority}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Timeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{task.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
                  task.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : task.status === "In Progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created By:</span>
              <span className="font-medium">{task.createdBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created Date:</span>
              <span className="font-medium">{task.createdDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Task Progress</h3>
          <div className="h-36 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold">65%</span>
              </div>
              <p className="text-sm text-gray-500">Completion</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Task Description</h3>
        <p className="text-gray-700">{task.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Comments</h3>
          <div className="space-y-3">
            {task.comments.map((comment) => (
              <div key={comment.id} className="bg-white p-3 rounded shadow-sm">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
            <div className="mt-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                placeholder="Add a comment..."
              ></textarea>
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Post Comment
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Task Resources</h3>
          <div className="space-y-3">
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100 border border-blue-200 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Tomato Planting Guidelines.pdf</span>
            </button>
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100 border border-blue-200 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Greenhouse A Layout.jpg</span>
            </button>
            <button className="w-full bg-white p-3 rounded shadow-sm text-left hover:bg-gray-100 border border-blue-200 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Organic Fertilizer Instructions.pdf</span>
            </button>
          </div>
          <button className="mt-4 w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Upload Additional Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
