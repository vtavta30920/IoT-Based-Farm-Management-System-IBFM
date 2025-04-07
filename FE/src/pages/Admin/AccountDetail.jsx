import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/avatardefault.jpg";

const AccountDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    status: "",
    email: "",
    password: "",
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
      setFormData({
        fullname: user.accountProfile?.fullname || "",
        status: user.status || "",
        email: user.email || "",
        password: user.password || "",
        role: user.role || "",
        createdAt: user.accountProfile?.createdAt || "",
        updatedAt: user.accountProfile?.updatedAt || "",
        gender: user.accountProfile?.gender || "",
        phone: user.accountProfile?.phone || "",
        address: user.accountProfile?.address || "",
        image: user.accountProfile?.image || "",
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

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
                    <div className="flex justify-center">
                      <span className="text-gray-800 font-bold uppercase bg-green-100 px-3 py-1 rounded-full">
                        {formData.role}
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

                  {/* Password */}
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Password
                    </label>
                    <div className="flex items-center w-3/4">
                      <input
                        name="password"
                        type={isPasswordVisible ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                      />
                      <button
                        onClick={togglePasswordVisibility}
                        className="ml-3 text-blue-500 hover:text-blue-700"
                      >
                        {isPasswordVisible ? "Hide" : "Show"}
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountDetail;
