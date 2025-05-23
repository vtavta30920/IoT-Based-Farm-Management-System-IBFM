import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import defaultAvatar from "../assets/avatardefault.jpg";
import { useUpdateAccount, useUpdateRole } from "../api/AccountEndPoint";

const AccountDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [roleId, setRoleId] = useState(user?.role || 0); // Sửa đổi giá trị ban đầu của roleId

  const [formData, setFormData] = useState({
    fullname: "",
    status: "",
    email: "",
    role: "",
    createdAt: "",
    updatedAt: "",
    gender: "",
    phone: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/admin");
    } else {
      let roleNum = 0;
      switch (user.role) {
        case "Manager":
          roleNum = 2;
          break;
        case "Staff":
          roleNum = 3;
          break;
        default:
          roleNum = 0;
      }

      setRoleId(roleNum); // cập nhật role ID đúng

      setFormData({
        fullname: user.accountProfile?.fullname || "",
        status: user.status || "",
        email: user.email || "",
        role: roleNum, // dùng số ở đây
        createdAt: user.accountProfile?.createdAt || "",
        updatedAt: user.accountProfile?.updatedAt || "",
        gender: user.accountProfile?.gender || "",
        phone: user.accountProfile?.phone || "",
        address: user.accountProfile?.address || "",
        image: user.accountProfile?.images || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRoleId(value);
  };

  const { mutateAsync, isPending } = useUpdateRole(user.accountId, roleId);
  const { mutateAsync: updateAccountAsync, isPending: isUpdating } =
    useUpdateAccount();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-center items-center">
            <h2 className="text-3xl font-bold text-green-600 border-b-2 border-gray-300 pb-2 mb-6 text-center">
              Manage Account Detail
            </h2>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-6">
              {/* LEFT: Avatar & Info */}
              <div className="col-span-1 space-y-4">
                <div className="flex flex-col items-center space-y-4 border p-4 rounded-lg shadow-md">
                  <img
                    src={formData.image || defaultAvatar}
                    alt="Profile"
                    className="w-48 h-48 object-cover rounded-full border-2 border-gray-300"
                  />
                  <div className="space-y-1 text-center w-full">
                    <div className="flex justify-center">
                      <span className="text-gray-700 font-semibold text-lg">
                        {formData.email}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full font-medium text-white ${
                          formData.status === "ACTIVE"
                            ? "bg-green-500"
                            : formData.status === "BANNED"
                            ? "bg-red-500"
                            : "bg-gray-400"
                        }`}
                      >
                        {formData.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CreatedAt & UpdatedAt */}
                <div className="border p-4 rounded-lg shadow-md space-y-2">
                  <div className="flex justify-between">
                    <label className="text-gray-600 font-medium">
                      Created At:
                    </label>
                    <span className="text-gray-800">{formData.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <label className="text-gray-600 font-medium">
                      Updated At:
                    </label>
                    <span className="text-gray-800">
                      {formData.updatedAt || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Info Fields */}
              <div className="col-span-2">
                <div className="space-y-4">
                  {/* Fullname */}
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

                  {/* Role */}
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Role
                    </label>
                    <div className="flex items-center w-3/4">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={(e) => {
                          handleChange(e); // cập nhật formData.role
                          setRoleId(parseInt(e.target.value)); // đảm bảo roleId cũng cập nhật đúng
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                      >
                        <option value={2}>Manager</option>
                        <option value={3}>Staff</option>
                        <option value={0}>Customer</option>
                      </select>

                      <button
                        onClick={async () => await mutateAsync()}
                        className="ml-3 text-red-400 hover:text-red-600 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-md"
                      >
                        {isPending ? "loading..." : "Change"}
                      </button>
                    </div>
                  </div>

                  {/* Gender */}
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

                  {/* Phone */}
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

                  {/* Address */}
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
                </div>

                {/* Nút Update Account Info */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={async () => {
                      const updateData = {
                        email: formData.email,
                        gender:
                          formData.gender === "Male"
                            ? 0
                            : formData.gender === "Female"
                            ? 1
                            : 2,
                        phone: formData.phone,
                        fullname: formData.fullname,
                        address: formData.address,
                        images: formData.image || "string",
                      };

                      try {
                        await updateAccountAsync({
                          userId: user.accountId,
                          updateData,
                        });
                        alert("Update Succeed!");
                      } catch (err) {
                        alert("Update Failed!");
                      }
                    }}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "loading..." : "Update"}
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

export default AccountDetail;
