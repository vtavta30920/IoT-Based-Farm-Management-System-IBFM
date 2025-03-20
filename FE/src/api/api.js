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

export const createVNPayPaymentUrl = async (
  orderId,
  orderType,
  amount,
  orderDescription,
  name,
  token
) => {
  const response = await fetch(`${API_BASE_URL}/vnpay/create-payment-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderId,
      orderType,
      amount,
      orderDescription,
      name,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create VNPay payment URL.");
  }

  return response.json();
};

export const handleVNPayCallback = async (queryParams) => {
  const response = await fetch(
    `${API_BASE_URL}/vnpay/callback?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to handle VNPay callback.");
  }

  return response.json();
};
