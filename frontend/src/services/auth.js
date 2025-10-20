// frontend/src/services/auth.js - WITH DEBUG
const API_BASE_URL = "http://localhost:8000/api";

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    console.log("=== FRONTEND LOGIN DEBUG ===");
    console.log("Sending login request...");

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();

    console.log("Raw response from backend:", data);
    console.log("User object from response:", data.user);
    console.log("created_at from response:", data.user?.created_at);
    console.log("created_at type:", typeof data.user?.created_at);

    // Store token and user info
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // Verify what was stored
    const storedUser = localStorage.getItem("user");
    console.log("Stored in localStorage:", storedUser);
    console.log("Parsed back:", JSON.parse(storedUser));
    console.log("===========================");

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    console.log("getCurrentUser() returning:", user);
    return user;
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};
