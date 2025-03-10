import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";

const Profile = () => {
  const { user, updateProfile } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({
    accountId: user?.accountId || "",
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  // Sync updatedInfo with user only when not editing
  useEffect(() => {
    if (user && !isEditing) {
      setUpdatedInfo({
        accountId: user.accountId || "",
        fullname: user.fullname || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({
      ...updatedInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(updatedInfo); // Call updateProfile from UserContext
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile</h2>
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
              <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Save
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-gray-700 mb-2"><strong>Full Name:</strong> {user.fullname}</p>
            <p className="text-gray-700 mb-2"><strong>Phone:</strong> {user.phone}</p>
            <p className="text-gray-700 mb-2"><strong>Address:</strong> {user.address}</p>
            
            <button onClick={() => setIsEditing(true)} className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;