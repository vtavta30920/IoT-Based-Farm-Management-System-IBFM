import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext.jsx";
import defaultAvatar from "../assets/avatardefault.jpg";

const Profile = () => {
  const { user, updateProfile } = useContext(UserContext);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    status: "",
    createdAt: "",
    updatedAt: "",
    gender: "",
    phone: "",
    address: "",
    image: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        fullname: user.fullname || "",
        status: user.status || "",
        createdAt: user.createdAt || "",
        updatedAt: user.updatedAt || "",
        gender: user.gender || "",
        phone: user.phone || "",
        address: user.address || "",
        image: user.images || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) {
      setMessage("❌ Fullname is required.");
      return false;
    }
    if (!formData.gender) {
      setMessage("❌ Please select your gender.");
      return false;
    }
    if (!formData.phone.trim()) {
      setMessage("❌ Phone number is required.");
      return false;
    }
    if (!/^\d{9,}$/.test(formData.phone)) {
      setMessage("❌ Phone number must be at least 9 digits.");
      return false;
    }
    if (!formData.address.trim()) {
      setMessage("❌ Address is required.");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const updateData = {
      email: formData.email,
      gender:
        formData.gender === "Male" ? 0 : formData.gender === "Female" ? 1 : 2,
      phone: formData.phone,
      fullname: formData.fullname,
      address: formData.address,
      images: formData.image || "string",
    };

    try {
      await updateProfile(updateData);
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      setMessage("❌ Update failed: " + err.message);
    }
  };

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-6 flex justify-center items-center">
            <h2 className="text-3xl font-bold text-green-600 border-b-2 border-gray-300 pb-2 mb-6 text-center">
              My Profile
            </h2>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-3 gap-6">
              {/* LEFT: Avatar & Info */}
              <div className="col-span-1 space-y-4">
                <div className="w-full bg-gradient-to-br from-green-400 to-green-600 text-white flex flex-col items-center justify-center p-6 space-y-3 rounded-lg shadow-md">
                  <img
                    src={formData.image || defaultAvatar}
                    alt="Avatar"
                    onClick={() => setShowModal(true)}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition"
                  />
                  <div className="px-3 py-1 bg-white text-green-700 rounded-full text-sm font-medium shadow-sm">
                    {formData.email}
                  </div>
                </div>

                <div className="border p-4 rounded-lg shadow-md space-y-2">
                  <div className="flex justify-between">
                    <label className="text-gray-600 font-medium">
                      Created At:
                    </label>
                    <span className="text-gray-800">
                      {formData.createdAt || "N/A"}
                    </span>
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
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Update
                  </button>
                </div>

                {message && (
                  <div className="mt-4 text-center text-sm text-red-500">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Modal nhập link ảnh */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Enter new image URL
              </h3>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full border px-3 py-2 rounded-md mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: newImageUrl }));
                    setShowModal(false);
                    setNewImageUrl("");
                    setMessage("Press Update To Save Image!");
                  }}
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Set Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
