// frontend/src/services/api.js
import { getToken } from "./auth";

const API_BASE_URL = "http://localhost:8000/api";

export const getAllCars = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars`);
    if (!response.ok) throw new Error("Failed to fetch cars");
    return await response.json();
  } catch (error) {
    console.error("Error fetching cars:", error);
    return [];
  }
};

export const getCarById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/${id}`);
    if (!response.ok) throw new Error("Failed to fetch car");
    return await response.json();
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
};

export const getFeaturedCars = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars/featured`);
    if (!response.ok) throw new Error("Failed to fetch featured cars");
    return await response.json();
  } catch (error) {
    console.error("Error fetching featured cars:", error);
    return [];
  }
};

export const createCar = async (carData) => {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/cars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(carData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create car");
  }

  return await response.json();
};

export const updateCar = async (id, carData) => {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(carData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update car");
  }

  return await response.json();
};

export const deleteCar = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}/cars/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete car");
  }

  return await response.json();
};
