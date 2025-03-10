import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister, getProfile, updateProfile as apiUpdateProfile } from "./api/api";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Login function
  const login = async (email, password) => {
    try {
      const { token, user } = await apiLogin(email, password);
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const { token, user } = await apiRegister(name, email, password);
      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
    } catch (error) {
      throw error;
    }
  };

  // Fetch profile function
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

  // **Update Profile Function**
  const updateProfile = async (updatedInfo) => {
    try {
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      const profileUpdateData = {
        accountId: user?.accountId, // Ensure correct accountId is sent
        fullname: updatedInfo.fullname, // Use "fullname" instead of "name"
        phone: updatedInfo.phone,
        address: updatedInfo.address,
      };
  
      const updatedUser = await apiUpdateProfile(profileUpdateData, token);
      
      // Ensure the state is updated immediately
      setUser(updatedUser); 
      
      return updatedUser; // Return updated user data
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Fetch profile on component mount
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, login, register, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};