import axios from "axios";

const API_BASE_URL = "https://webapi20250531180300.azurewebsites.net/api/v1";

// Thêm interceptor để tự động thêm token vào header nếu có
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/account/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // First try to parse as JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed. Please try again.");
      } else {
        // If not JSON, read as text
        const errorText = await response.text();
        // Handle specific .NET exception messages
        if (errorText.includes("UnauthorizedAccessException")) {
          if (errorText.includes("Invalid email")) {
            throw new Error("Invalid email.");
          } else if (errorText.includes("Invalid password")) {
            throw new Error("Invalid password.");
          } else if (errorText.includes("Account is not active")) {
            throw new Error("Account is not active.");
          }
        }
        throw new Error("Login failed. Please try again.");
      }
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message || "Login failed. Please try again.");
  }
};

export const register = async (email, password, confirmPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/account/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    if (!response.ok) {
      // First try to parse as JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Registration failed. Please try again."
        );
      } else {
        // If not JSON, read as text
        const errorText = await response.text();
        // Handle specific .NET exception messages
        if (errorText.includes("Email already exists")) {
          throw new Error("Email already exists.");
        }
        throw new Error("Registration failed. Please try again.");
      }
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || "Registration failed. Please try again.");
  }
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

export const getAllFarmActivities = async (
  token,
  pageIndex = 1,
  pageSize = 10
) => {
  const response = await fetch(
    `${API_BASE_URL}/farm-activity/get-active?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch farm activities.");
  }

  const data = await response.json();
  return data.status === 1 && data.data?.items ? data.data.items : [];
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

export const getBlynkData = async (token) => {
  const response = await fetch(
    `https://webapi20250531180300.azurewebsites.net/api/blynk/get-blynk-data`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Blynk data. Status: ${response.status}`);
  }

  return response.json();
};

export const getIotDevices = async (pageIndex = 0, pageSize = 100, token) => {
  const response = await fetch(
    `${API_BASE_URL}/iotDevices/iotDevices-list?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch IoT devices.");
  }

  return response.json();
};
export const getAllIotDevices = async (token, pageSize = 100) => {
  let allDevices = [];
  let currentPage = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await getIotDevices(currentPage, pageSize, token);
    const devices = response.data?.items || response.items || [];
    allDevices = [...allDevices, ...devices];

    // Check if we've fetched all items
    if (devices.length < pageSize) {
      hasMore = false;
    } else {
      currentPage++;
    }
  }

  return allDevices;
};

export const createIotDevice = async (deviceData, token) => {
  const response = await fetch(`${API_BASE_URL}/iotDevices/iotDevices-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      deviceName: deviceData.deviceName,
      deviceType: deviceData.deviceType,
      expiryDate: deviceData.expiryDate,
      farmDetailsId: deviceData.farmDetailsId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create IoT device. Response:", errorText);
    throw new Error(errorText || "Failed to create IoT device");
  }

  return response.json();
};

export const createFeedback = async (feedbackData, token) => {
  const response = await fetch(`${API_BASE_URL}/feedback/create-feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(feedbackData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to submit feedback");
  }

  return response.json();
};

export const getExcludingInactive = async (token) => {
  const response = await fetch(`${API_BASE_URL}/crop/get-excluding-inactive`, {
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
