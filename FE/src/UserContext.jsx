import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially, no user is logged in

  // Fake login function
  const login = (email, password) => {
    // Simulate a fake user for demonstration purposes
    if (email === "user@example.com" && password === "password") {
      const fakeUser = {
        id: 1,
        name: "John Doe",
        email: "user@example.com",
        address: "123 Main St, City, Country",
        phone: "123-456-7890",
      };
      setUser(fakeUser); // Set the user as logged in
    } else {
      alert("Invalid email or password"); // Show an error for invalid credentials
    }
  };

  // Logout function
  const logout = () => {
    setUser(null); // Clear the user state
  };

  // Update profile function
  const updateProfile = (updatedInfo) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedInfo,
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};