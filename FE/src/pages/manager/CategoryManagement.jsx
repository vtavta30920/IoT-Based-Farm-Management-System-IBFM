import React, { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "../../api/CategoryEndPoint";

const CategoryManagement = () => {
  const { data, isLoading, isError } = useCategories();
  const { mutate: createCategory, isLoading: isCreating } = useCreateCategory();
  const { mutate: deleteCategory, isLoading: isDeleting } = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    category: null,
  });

  if (isLoading) {
    return <div className="p-6">Loading categories...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load categories.</div>;
  }

  const categories = Array.isArray(data) ? data : data?.data || [];
  console.log("Categories:", categories);

  const handleCreate = () => {
    if (!newCategoryName.trim()) return;
    createCategory(newCategoryName, {
      onSuccess: () => {
        setIsModalOpen(false);
        setNewCategoryName("");
      },
    });
  };

  const handleDelete = () => {
    if (!deleteModal.category) return;
    deleteCategory(deleteModal.category.categoryId, {
      onSuccess: () => {
        setDeleteModal({ open: false, category: null });
      },
      onSettled: () => {
        setDeleteModal({ open: false, category: null });
      },
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        Category Management
      </h1>
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Create
        </button>
      </div>
      <div className="bg-gray-100 rounded-lg shadow p-4">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">No.</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="text-gray-500 px-4 py-2">
                  No categories found.
                </td>
              </tr>
            )}
            {categories.map((cat, idx) => (
              <tr key={cat.categoryId}>
                <td className="border-b border-gray-200 px-4 py-2">
                  {idx + 1}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 font-medium">
                  {cat.categoryName}
                </td>
                <td className="border-b border-gray-200 px-4 py-2">
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    disabled={isDeleting}
                    onClick={() =>
                      setDeleteModal({ open: true, category: cat })
                    }
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Create Category</h2>
            <input
              type="text"
              className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              disabled={isCreating}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewCategoryName("");
                }}
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleCreate}
                disabled={isCreating || !newCategoryName.trim()}
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirm Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4 text-red-600">
              Confirm Remove
            </h2>
            <p className="mb-6">
              Are you sure you want to remove category{" "}
              <span className="font-bold">
                {deleteModal.category?.categoryName}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300"
                onClick={() => setDeleteModal({ open: false, category: null })}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
