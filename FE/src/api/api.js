import axios from "axios";

const API_BASE_URL = "https://localhost:7067/api/v1";

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

export const register = async (email, password, confirmPassword) => {
  const response = await fetch(`${API_BASE_URL}/account/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, confirmPassword }), // Updated payload
  });

  if (!response.ok) {
    throw new Error("Registration failed. Please try again.");
  }

  return response.json();
};
export const getProducts = async (pageIndex = 0, pageSize = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/products/products-list?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }

  return response.json();
};
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

export const updateProfile = async (updatedInfo, token) => {
  const response = await fetch(`${API_BASE_URL}/account-profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedInfo),
  });

  console.log("Update Profile Response Status:", response.status);

  if (response.status === 204) {
    console.log("No content returned, assuming success.");
    return updatedInfo; // Return the same data for state update
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update profile: ${errorText || response.status}`
    );
  }

  // Handle non-JSON responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json(); // Parse JSON response
  } else {
    const text = await response.text(); // Handle plain text response
    console.log("Non-JSON response:", text);
    return updatedInfo; // Return the same data for state update
  }
};
export const createOrder = async (orderItems, shippingAddress, token) => {
  const response = await fetch(`${API_BASE_URL}/Order/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderItems,
      shippingAddress,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create order. Response:", errorText);
    throw new Error(errorText || "Failed to create order.");
  }

  return response.json();
};
export const createSchedule = async (scheduleData, token) => {
  const response = await fetch(`${API_BASE_URL}/Schedule/schedule-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scheduleData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create schedule");
  }

  return response.json();
};

export const getSchedules = async (pageIndex = 0, pageSize = 10, token) => {
  const response = await fetch(
    `${API_BASE_URL}/Schedule/schedule-list?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch schedules.");
  }

  return response.json();
};

export const updateSchedule = async (scheduleId, updatedData, token) => {
  const response = await fetch(
    `${API_BASE_URL}/Schedule/schedule-update?scheduleId=${scheduleId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update schedule");
  }

  return response.json();
};
export const updateScheduleStatus = async (scheduleId, newStatus, token) => {
  const response = await fetch(
    `${API_BASE_URL}/Schedule/schedule-update-status?scheduleId=${scheduleId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newStatus), // Send just the string value
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update schedule status");
  }

  return response.json();
};
export const getStaffAccounts = async (pageIndex = 0, pageSize = 10, token) => {
  const response = await fetch(
    `${API_BASE_URL}/account/get-all?pageSize=${pageSize}&pageIndex=${pageIndex}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch staff accounts.");
  }

  const data = await response.json();
  // Filter only staff accounts
  const staffAccounts = data.items.filter((item) => item.role === "Staff");
  // Return the filtered data with pagination metadata
  return {
    totalItemCount: staffAccounts.length, // Adjust total count to filtered items
    pageSize: data.pageSize,
    totalPagesCount: Math.ceil(staffAccounts.length / pageSize), // Recalculate pages
    pageIndex: data.pageIndex,
    next: data.next && staffAccounts.length === pageSize, // Adjust next based on filtered items
    previous: data.previous,
    items: staffAccounts,
  };
};

export const getAllFarms = async (token) => {
  const response = await fetch(`${API_BASE_URL}/farm/get-all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch farms.");
  }

  return response.json();
};

export const getAllFarmActivities = async (token) => {
  const response = await fetch(`${API_BASE_URL}/farm-activity/get-all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch farm activities.");
  }

  return response.json();
};

export const getAllCrops = async (token, pageIndex = 1, pageSize = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/crop/get-all?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch crops.");
  }

  return response.json();
};
export const getAllActive = async (token) => {
  const response = await fetch(`${API_BASE_URL}/crop/get-all-active`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch crops.");
  }

  return response.json();
};
