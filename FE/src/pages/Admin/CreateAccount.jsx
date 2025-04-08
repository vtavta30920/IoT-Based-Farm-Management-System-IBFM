import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAccount } from "../../api/AccountEndPoint";
import defaultAvatar from "../../assets/avatardefault.jpg";

const CreateAccount = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    gender: "",
    phone: "",
    address: "",
    role: 0,
    images: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    const link = prompt("Enter image URL:");
    if (link) {
      setFormData((prev) => ({ ...prev, image: link }));
    }
  };

  const createData = {
    email: formData.email,
    gender:
      formData.gender === "Male" ? 0 : formData.gender === "Female" ? 1 : 2,
    phone: formData.phone,
    fullname: formData.fullname,
    address: formData.address,
    images: formData.images || "string",
    role: parseInt(formData.role),
  };

  const { mutateAsync, isPending } = useCreateAccount(createData);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-center items-center">
            <h2 className="text-3xl font-bold text-green-600 border-b-2 border-gray-300 pb-2 mb-6 text-center">
              Create New Account
            </h2>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-6">
              {/* LEFT: Avatar & Email */}
              <div className="col-span-1 space-y-4">
                <div
                  className="flex flex-col items-center space-y-4 border p-4 rounded-lg shadow-md cursor-pointer"
                  onClick={handleImageClick}
                  title="Click to change image URL"
                >
                  <img
                    src={formData.image || defaultAvatar}
                    alt="Profile"
                    className="w-48 h-48 object-cover rounded-full border-2 border-gray-300"
                  />
                </div>
              </div>

              {/* RIGHT: Form */}
              <div className="col-span-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Email
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border px-2 py-2 rounded-md w-3/4"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Fullname
                    </label>
                    <input
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      className="border px-2 py-2 rounded-md w-3/4"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border px-2 py-2 rounded-md w-3/4"
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border px-2 py-2 rounded-md w-3/4"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="border px-2 py-2 rounded-md w-3/4"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="border px-2 py-2 rounded-md w-3/4"
                    >
                      <option value={0}>Customer</option>
                      <option value={2}>Manager</option>
                      <option value={3}>Staff</option>
                    </select>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    onClick={() => navigate("/admin")}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      await mutateAsync(createData);
                      navigate("/admin");
                    }}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                    disabled={isPending}
                  >
                    {isPending ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateAccount;
