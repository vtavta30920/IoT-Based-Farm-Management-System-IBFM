const API_BASE_URL = "https://localhost:7067/api/v1";

// Login API
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/account/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed. Please check your credentials.");
  }

  return response.json();
};

// Register API
export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/account/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed. Please try again.");
  }

  return response.json();
};

// Get Profile API
export const getProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/account-profile/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile.");
  }

  return response.json();
};

// **Update Profile API using PUT**
export const updateProfile = async (updatedInfo, token) => {
    const response = await fetch(`${API_BASE_URL}/account-profile/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedInfo), // Send updated profile data
    });
  
    if (!response.ok) {
      throw new Error("Failed to update profile.");
    }
  
    return response.json();
  };