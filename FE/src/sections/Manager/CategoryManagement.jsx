import React from "react";
import { useCategories } from "../../api/CategoryEndPoint";

const CategoryManagement = () => {
  const { data, isLoading, isError } = useCategories();

  if (isLoading) {
    return <div className="p-6">Loading categories...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load categories.</div>;
  }

  const categories = Array.isArray(data) ? data : data?.data || [];
  console.log("Categories:", categories);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Category Management
      </h1>
      <div className="bg-gray-100 rounded-lg shadow p-4">
        <ul>
          {categories.length === 0 && (
            <li className="text-gray-500">No categories found.</li>
          )}
          {categories.map((cat) => (
            <li
              key={cat.categoryId}
              className="border-b border-gray-200 py-2 px-1"
            >
              <span className="font-medium">{cat.categoryName}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManagement;
