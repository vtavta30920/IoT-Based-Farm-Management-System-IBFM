import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAccount } from "../api/AccountEndPoint";
import defaultAvatar from "../assets/avatardefault.jpg";
import { uploadImageToFirebase } from "../api/firebase.js";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState({});
  const [newImageFile, setNewImageFile] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "", // "success" | "error"
  });

  const [formData, setFormData] = useState({
    email: "",
    fullname: "",
    gender: "",
    phone: "",
    address: "",
    role: "0",
    image: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.fullname) newErrors.fullname = "Fullname is required";

    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10,11}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10-11 digits";

    if (!formData.address) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createData = {
    email: formData.email,
    gender:
      formData.gender === "Male" ? 0 : formData.gender === "Female" ? 1 : 2,
    phone: formData.phone,
    fullname: formData.fullname,
    address: formData.address,
    images: formData.image || "string",
    role: parseInt(formData.role),
  };

  const { mutateAsync, isPending } = useCreateAccount(createData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const handlePasteImage = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          setNewImageFile(file);
          setFormData((prev) => ({
            ...prev,
            image: URL.createObjectURL(file),
          }));
          break;
        }
      }
    }
  };

  const handleImageSave = async () => {
    if (newImageFile) {
      try {
        setFormData((prev) => ({ ...prev, image: "Uploading..." }));
        const url = await uploadImageToFirebase(newImageFile, "avatars");
        setFormData((prev) => ({ ...prev, image: url }));
        setShowImageModal(false);
        setNewImageFile(null);
      } catch {
        setFormData((prev) => ({ ...prev, image: "" }));
        alert("Upload image failed!");
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    let imageToSend = formData.image;

    // Nếu không có file ảnh mới và imageToSend là null/rỗng, dùng defaultAvatar và upload lên Firebase
    if (!newImageFile && (!imageToSend || imageToSend.trim() === "")) {
      try {
        // Fetch defaultAvatar as blob
        const response = await fetch(defaultAvatar);
        const blob = await response.blob();
        // Tạo file từ blob
        const file = new File([blob], "default-avatar.png", {
          type: blob.type,
        });
        imageToSend = await uploadImageToFirebase(file, "avatars");
      } catch {
        setNotification({
          show: true,
          message: "Upload default avatar failed!",
          type: "error",
        });
        return;
      }
    }

    // Nếu có file ảnh mới, upload lên Firebase trước
    if (newImageFile) {
      try {
        imageToSend = await uploadImageToFirebase(newImageFile, "avatars");
      } catch {
        setNotification({
          show: true,
          message: "Upload image failed!",
          type: "error",
        });
        return;
      }
    }

    try {
      await mutateAsync({
        ...createData,
        images: imageToSend || "string",
      });
      setNotification({
        show: true,
        message: "Create account successfully!",
        type: "success",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        navigate("/admin");
      }, 1200);
    } catch (err) {
      setNotification({
        show: true,
        message: "Create account failed!",
        type: "error",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        {/* Notification Modal */}
        {notification.show && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 w-80 flex flex-col items-center">
              <span
                className={`text-2xl mb-2 ${
                  notification.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {notification.type === "success" ? "✔️" : "❌"}
              </span>
              <div className="text-center mb-4">{notification.message}</div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setNotification({ show: false, message: "", type: "" });
                  if (notification.type === "success") navigate("/admin");
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
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
              {/* LEFT: Avatar */}
              <div className="col-span-1 space-y-4">
                <div
                  className="flex flex-col items-center space-y-4 border p-4 rounded-lg shadow-md cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                  title="Click to change image URL"
                >
                  <img
                    src={formData.image || defaultAvatar}
                    alt="Profile"
                    className="w-48 h-48 object-cover rounded-full border-2 border-gray-300"
                  />
                  <span className="text-sm text-gray-500">
                    Click to change avatar
                  </span>
                </div>
              </div>

              {/* RIGHT: Form */}
              <div className="col-span-2 space-y-4">
                {[
                  { label: "Email", name: "email" },
                  { label: "Fullname", name: "fullname" },
                  { label: "Phone", name: "phone" },
                  { label: "Address", name: "address" },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-gray-600 w-1/4">
                        {label}
                      </label>
                      <input
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className={`border px-2 py-2 rounded-md w-3/4 ${
                          errors[name] ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors[name] && (
                      <p className="text-red-500 text-sm ml-[25%]">
                        {errors[name]}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-600 w-1/4">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`border px-2 py-2 rounded-md w-3/4 ${
                        errors.gender ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-sm ml-[25%]">
                      {errors.gender}
                    </p>
                  )}
                </div>

                <div>
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
                      <option value="0">Customer</option>
                      <option value="2">Manager</option>
                      <option value="3">Staff</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    onClick={() => navigate("/admin")}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
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

        {/* MODAL */}
        {showImageModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-96 space-y-4">
              <h3 className="text-xl font-bold mb-2">Change Avatar</h3>
              <div
                tabIndex={0}
                onPaste={handlePasteImage}
                className="w-full h-20 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center mb-2 text-gray-500 focus:outline-none"
                style={{ cursor: "pointer" }}
                title="Paste image here"
              >
                Paste image here (Ctrl+V)
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full border px-3 py-2 rounded-md mb-2"
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowImageModal(false);
                    setNewImageFile(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  disabled={!newImageFile}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateAccount;
