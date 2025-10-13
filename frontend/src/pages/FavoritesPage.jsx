// frontend/src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getFavorites, removeFavorite } from "../services/api";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadFavorites();
  }, [user, navigate]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      alert("Failed to load favorites: " + error.message);
    }
    setLoading(false);
  };

  const handleRemove = async (carId, carName) => {
    if (!window.confirm(`Remove ${carName} from favorites?`)) {
      return;
    }

    try {
      await removeFavorite(carId);
      loadFavorites();
    } catch (error) {
      alert("Failed to remove favorite: " + error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">Loading favorites...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/user/profile")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Profile
      </button>

      <div className="flex items-center space-x-3 mb-8">
        <Heart className="w-8 h-8 text-red-500" />
        <h1 className="text-4xl font-bold text-slate-900">My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-4">
            You haven't added any favorites yet
          </p>
          <button
            onClick={() => navigate("/inventory")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Inventory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((fav) => (
            <div
              key={fav.favorite_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={fav.car.image}
                  alt={fav.car.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemove(fav.car.id, fav.car.name)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {fav.car.name}
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                  {fav.car.description}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(fav.car.price)}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-500 pt-4 border-t mb-4">
                  <span>{fav.car.year}</span>
                  <span>{fav.car.mileage.toLocaleString()} mi</span>
                  <span>{fav.car.specs.fuel}</span>
                </div>
                <button
                  onClick={() => navigate(`/car/${fav.car.id}`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
  