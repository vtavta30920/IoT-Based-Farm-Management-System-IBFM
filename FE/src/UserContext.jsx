import React, { createContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
  updateProfile as apiUpdateProfile,
} from "./api/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Login function
  const login = async (email, password) => {
    try {
      const { token, user } = await apiLogin(email, password); // Correct destructuring and await
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
    } catch (error) {
      throw error;
    }
  };
  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
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
        gender: updatedInfo.gender || 1,
        fullname: updatedInfo.fullname,
        phone: updatedInfo.phone,
        address: updatedInfo.address,
        images: updatedInfo.images || "",
      };

      console.log("Sending update data:", profileUpdateData); // Log outgoing data
      const updatedUser = await apiUpdateProfile(profileUpdateData, token);
      console.log("Received updated user:", updatedUser); // Log incoming data

      setUser(updatedUser); // Update state
      return updatedUser;
    } catch (error) {
      console.error("Error in updateProfile:", error.message); // Detailed error logging
      throw error; // Propagate the error to Profile.js
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
