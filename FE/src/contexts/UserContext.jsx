import React, { createContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
  updateProfile as apiUpdateProfile,
} from "../api/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const decodeJWT = (token) => {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  };

  // Login function
  const login = async (email, password) => {
    try {
      const { token } = await apiLogin(email, password);
      setToken(token);
      const role = decodeJWT(token).role;
      setUser(role);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      return role;
    } catch (error) {
      throw error;
    }
  };
  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  // Register function
  const register = async (email, password, confirmPassword) => {
    try {
      const { token, user } = await apiRegister(
        email,
        password,
        confirmPassword
      ); // Pass confirmPassword
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
    } catch (error) {
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      if (token) {
        const profileData = await getProfile(token);
        setUser(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateProfile = async (updatedInfo) => {
    try {
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const profileUpdateData = {
        accountId: user?.accountId || 0,
        gender: updatedInfo.gender || 0,
        fullname: updatedInfo.fullname,
        phone: updatedInfo.phone,
        address: updatedInfo.address,
        images: updatedInfo.images || "",
      };

      console.log("Sending update data:", profileUpdateData);

      const updatedUser = await apiUpdateProfile(profileUpdateData, token);
      console.log("Received updated user:", updatedUser);

      // Kết hợp user cũ + user mới (merge)
      const fullUpdatedUser = {
        ...user, // giữ lại tất cả dữ liệu cũ
        ...updatedUser, // ghi đè những field mới
      };

      setUser(fullUpdatedUser); // cập nhật với dữ liệu đầy đủ

      return fullUpdatedUser;
    } catch (error) {
      console.error("Error in updateProfile:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{ user, token, login, register, logout, updateProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};
