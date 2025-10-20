// frontend/src/pages/CarForm.jsx - ENHANCED VERSION
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getCarById, createCar, updateCar } from "../services/api";

const CarForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    year: "",
    mileage: "",
    image: "",
    featured: false,
    description: "",
    engine: "",
    transmission: "",
    fuel: "",
    color: "", // NEW: Color field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Popular car colors
  const popularColors = [
    "Black",
    "White",
    "Silver",
    "Gray",
    "Blue",
    "Red",
    "Green",
    "Yellow",
    "Orange",
    "Brown",
    "Beige",
    "Gold",
    "Purple",
    "Pink",
  ];

  useEffect(() => {
    if (!user || (user.role !== "owner" && user.role !== "admin")) {
      navigate("/");
      return;
    }

    if (isEditMode) {
      loadCar();
    }
  }, [id, user, navigate]);

  const loadCar = async () => {
    try {
      const car = await getCarById(id);
      setFormData({
        name: car.name,
        price: car.price,
        year: car.year,
        mileage: car.mileage,
        image: car.image,
        featured: car.featured,
        description: car.description,
        engine: car.specs.engine,
        transmission: car.specs.transmission,
        fuel: car.specs.fuel,
        color: car.color || "", // NEW: Load color
      });
    } catch (err) {
      setError("Failed to load car details");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const carData = {
        name: formData.name,
        price: parseInt(formData.price),
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        image: formData.image,
        featured: formData.featured,
        description: formData.description,
        color: formData.color || null, // NEW: Include color
        specs: {
          engine: formData.engine,
          transmission: formData.transmission,
          fuel: formData.fuel,
        },
      };

      if (isEditMode) {
        await updateCar(id, carData);
        alert("Car updated successfully");
      } else {
        await createCar(carData);
        alert("Car added successfully");
      }

      navigate("/owner/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/owner/dashboard")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          {isEditMode ? "Edit Car" : "Add New Car"}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Car Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="e.g., Mercedes-Benz S-Class"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="95000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="2023"
                min="1900"
                max="2030"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mileage (miles) *
              </label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="5000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Engine *
              </label>
              <input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="e.g., 3.0L V6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              >
                <option value="">Select transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
                <option value="PDK">PDK</option>
                <option value="Single-Speed">Single-Speed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fuel Type *
              </label>
              <select
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              >
                <option value="">Select fuel type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
              </select>
            </div>

            {/* NEW: Color field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Color
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="">Select color (optional)</option>
                {popularColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Optional - helps buyers filter by color
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                required
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter car description..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                />
                <span className="text-sm font-medium text-slate-700">
                  Mark as featured (appears on home page)
                </span>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditMode ? "Update Car" : "Add Car"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/owner/dashboard")}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarForm;
