// frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Star, Car, Phone, Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllCars,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/api";

const HomePage = () => {
  const [cars, setCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Define canFavorite here, inside the component
  const canFavorite = isAuthenticated && user?.role === "user";

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    if (canFavorite) {
      loadFavorites();
    }
  }, [canFavorite]);

  const loadCars = async () => {
    try {
      const data = await getAllCars();
      setCars(data.filter((car) => car.featured));
    } catch (error) {
      console.error("Error loading cars:", error);
    }
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
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "user") {
      alert("Only customers can save favorite cars");
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
    <div>
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Drive Your Dream</h1>
            <p className="text-xl mb-8">
              Discover our curated collection of luxury and performance vehicles
            </p>
            <button
              onClick={() => navigate("/inventory")}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition flex items-center space-x-2"
            >
              <span>Browse Inventory</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cars */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-slate-600 text-lg">
            Hand-picked selections from our premium collection
          </p>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Loading cars...</p>
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

                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>

                  {/* Favorite Button - Only show for regular users */}
                  {canFavorite && (
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
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {car.name}
                  </h3>
                  <p className="text-slate-600 mb-4">{car.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(car.price)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {car.year} · {car.mileage.toLocaleString()} mi
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Selection</h3>
              <p className="text-slate-600">
                Every vehicle carefully inspected and certified
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Test Drive</h3>
              <p className="text-slate-600">
                Experience your dream car before you buy
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-slate-600">
                Dedicated team to help you find the perfect match
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
