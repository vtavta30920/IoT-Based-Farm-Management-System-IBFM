import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import defaultAvatar from "../../assets/avatardefault.jpg"; // Import ảnh mặc định

const AccountDetail = () => {
  const { user } = useContext(UserContext);

  const [isPasswordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    // You can add logic here to fetch account details if needed
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
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
              {/* Left Column - Profile Image and Info */}
              <div className="col-span-1">
                <div className="flex flex-col items-center space-y-4 border p-4 rounded-lg shadow-md">
                  <img
                    src={user?.accountProfile?.image || defaultAvatar} // Nếu không có ảnh của người dùng, dùng ảnh mặc định
                    alt="Profile"
                    className="w-48 h-48 object-cover rounded-full border-2 border-gray-300"
                  />
                  <div className="space-y-2 text-center">
                    {/* Display Fullname */}
                    <div className="flex justify-between">
                      <label className="font-semibold text-gray-600">
                        Fullname
                      </label>
                      <span>{user?.accountProfile?.fullname || "N/A"}</span>
                    </div>

                    {/* Display Status */}
                    <div className="flex justify-between">
                      <label className="font-semibold text-gray-600">
                        Status
                      </label>
                      <span>{user?.status || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Other Account Details */}
              <div className="col-span-2">
                <div className="space-y-4">
                  {/* Display Email */}
                  <div className="flex justify-between">
                    <label className="font-semibold text-gray-600">Email</label>
                    <span>{user?.email || "N/A"}</span>
                  </div>

                  {/* Display Password (hidden by default, toggle visibility) */}
                  <div className="flex justify-between">
                    <label className="font-semibold text-gray-600">
                      Password
                    </label>
                    <div>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        value={user?.password || "********"}
                        readOnly
                        className="w-48 px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
                      />
                      <button
                        onClick={togglePasswordVisibility}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        {isPasswordVisible ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Display Role */}
                  <div className="flex justify-between">
                    <label className="font-semibold text-gray-600">Role</label>
                    <span>{user?.role || "N/A"}</span>
                  </div>

                  {/* Display Creation and Update Date */}
                  <div className="flex justify-between">
                    <label className="font-semibold text-gray-600">
                      Created At
                    </label>
                    <span>{user?.createdAt || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <label className="font-semibold text-gray-600">
                      Updated At
                    </label>
                    <span>{user?.updatedAt || "N/A"}</span>
                  </div>

                  {/* Display Gender */}
                  <div className="flex justify-between">
                    <label className="font-semibold text-gray-600">
                      Gender
                    </label>
                    <span>{user?.gender || "N/A"}</span>
                  </div>

                  {/* Display Phone */}
                  <div className="flex justify-between">
                    <label className="font-semibold text-gray-600">Phone</label>
                    <span>{user?.phone || "N/A"}</span>
                  </div>

                  {/* Display Address */}
                  <div className="flex justify-between">
                    <label className="font-semibold text-gray-600">
                      Address
                    </label>
                    <span>{user?.accountProfile?.address || "N/A"}</span>
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
