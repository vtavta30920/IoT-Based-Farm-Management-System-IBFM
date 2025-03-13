import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";

const Profile = () => {
  const { user, updateProfile } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    accountId: user?.accountId || 0,
    gender: user?.gender || 1, // Default to current user's gender
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    address: user?.address || "",
    images: user?.images || "", // Default to current user's images
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUpdatedInfo({
        accountId: user.accountId || 0,
        gender: user.gender || 1,
        fullname: user.fullname || "",
        phone: user.phone || "",
        address: user.address || "",
        images: user.images || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({
      ...updatedInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous message
    try {
      console.log("Submitting updated info:", updatedInfo);
      const updatedUser = await updateProfile(updatedInfo);
      console.log("Updated User:", updatedUser);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error in handleSubmit:", error.message);
      setMessage(`Failed to update profile: ${error.message}`);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile</h2>
        {message && (
          <div
            className={`mb-4 p-2 rounded text-white ${
              message.includes("success") ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={updatedInfo.fullname}
                onChange={handleInputChange}
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={updatedInfo.phone}
                onChange={handleInputChange}
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={updatedInfo.address}
                onChange={handleInputChange}
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Exit
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-gray-700 mb-2">
              <strong>Full Name:</strong> {user.fullname}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> {user.phone}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> {user.address}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;