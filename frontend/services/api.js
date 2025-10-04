// frontend/src/services/api.js

const API_BASE_URL = "http://localhost:8000/api";

/**
 * Fetch all cars from the backend
 */
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

/**
 * Fetch a single car by ID
 */
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

/**
 * Fetch only featured cars
 */
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
