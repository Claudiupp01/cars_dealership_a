// frontend/src/pages/InventoryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllCars,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/api";

const InventoryPage = () => {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCars();
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadCars = async () => {
    const data = await getAllCars();
    setCars(data);
  };

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data.map((fav) => fav.car.id));
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleFavoriteToggle = async (e, carId) => {
    e.stopPropagation(); // Prevent navigation to car details

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      if (favorites.includes(carId)) {
        await removeFavorite(carId);
        setFavorites(favorites.filter((id) => id !== carId));
      } else {
        await addFavorite(carId);
        setFavorites([...favorites, carId]);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Our Inventory</h1>
      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No cars available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer relative"
              onClick={() => navigate(`/car/${car.id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
                {/* Favorite Button */}
                <button
                  onClick={(e) => handleFavoriteToggle(e, car.id)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition z-10"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      favorites.includes(car.id)
                        ? "fill-red-500 text-red-500"
                        : "text-slate-400"
                    }`}
                  />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {car.name}
                </h3>
                <p className="text-slate-600 mb-4 text-sm">{car.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(car.price)}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-500 pt-4 border-t">
                  <span>{car.year}</span>
                  <span>{car.mileage.toLocaleString()} mi</span>
                  <span>{car.specs.fuel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
