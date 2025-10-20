// frontend/src/pages/InventoryPage.jsx - ENHANCED VERSION
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, SlidersHorizontal, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllCars,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/api";

const InventoryPage = () => {
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Filter states with NEW additions
  const [filters, setFilters] = useState({
    brand: "all",
    priceMin: "",
    priceMax: "",
    yearMin: "",
    yearMax: "",
    mileageMax: "",
    fuelType: "all",
    transmission: "all",
    engineSize: "all", // NEW: small, medium, large
    color: "all", // NEW: color filter
    sortBy: "newest",
  });

  const canFavorite = isAuthenticated && user?.role === "user";

  useEffect(() => {
    loadCars();
    if (canFavorite) {
      loadFavorites();
    }
  }, [canFavorite]);

  useEffect(() => {
    applyFilters();
  }, [filters, allCars]);

  const loadCars = async () => {
    const data = await getAllCars();
    setAllCars(data);
    setFilteredCars(data);
  };

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data.map((fav) => fav.car.id));
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  // Extract unique brands from car names
  const extractBrand = (carName) => {
    const brands = [
      "Mercedes-Benz",
      "BMW",
      "Audi",
      "Porsche",
      "Tesla",
      "Range Rover",
      "Lamborghini",
      "Ferrari",
      "McLaren",
      "Bentley",
      "Lexus",
      "Jaguar",
      "Maserati",
      "Aston Martin",
      "Volkswagen",
      "Seat",
      "Renault",
      "Peugeot",
      "Ford",
      "Skoda",
      "KIA",
      "Dacia",
      "Toyota",
      "Honda",
      "Nissan",
      "Mazda",
      "Chevrolet",
      "Dodge",
      "Jeep",
    ];
    const brand = brands.find((b) => carName.includes(b));
    return brand || "Other";
  };

  const getUniqueBrands = () => {
    const brands = allCars.map((car) => extractBrand(car.name));
    return ["all", ...new Set(brands)].sort();
  };

  const getFuelTypes = () => {
    const types = allCars.map((car) => car.specs.fuel);
    return ["all", ...new Set(types)].sort();
  };

  const getTransmissions = () => {
    const transmissions = allCars.map((car) => car.specs.transmission);
    return ["all", ...new Set(transmissions)].sort();
  };

  // NEW: Get unique colors
  const getColors = () => {
    const colors = allCars.map((car) => car.color).filter((color) => color); // Filter out null/undefined
    return ["all", ...new Set(colors)].sort();
  };

  const applyFilters = () => {
    let filtered = [...allCars];

    // Brand filter
    if (filters.brand !== "all") {
      filtered = filtered.filter(
        (car) => extractBrand(car.name) === filters.brand
      );
    }

    // NEW: Engine size filter
    if (filters.engineSize !== "all") {
      filtered = filtered.filter((car) => {
        const engine = car.specs.engine.toLowerCase();
        if (filters.engineSize === "small") {
          return (
            engine.includes("1.") ||
            engine.includes("2.0") ||
            engine.includes("2.2")
          );
        }
        if (filters.engineSize === "medium") {
          return (
            engine.includes("2.5") ||
            engine.includes("3.") ||
            engine.includes("4.")
          );
        }
        if (filters.engineSize === "large") {
          return (
            engine.includes("5.") ||
            engine.includes("6.") ||
            engine.includes("v8") ||
            engine.includes("v10") ||
            engine.includes("v12") ||
            engine.includes("w12")
          );
        }
        return true;
      });
    }

    // NEW: Color filter
    if (filters.color !== "all") {
      filtered = filtered.filter((car) => car.color === filters.color);
    }

    // Price filter
    if (filters.priceMin) {
      filtered = filtered.filter(
        (car) => car.price >= parseInt(filters.priceMin)
      );
    }
    if (filters.priceMax) {
      filtered = filtered.filter(
        (car) => car.price <= parseInt(filters.priceMax)
      );
    }

    // Year filter
    if (filters.yearMin) {
      filtered = filtered.filter(
        (car) => car.year >= parseInt(filters.yearMin)
      );
    }
    if (filters.yearMax) {
      filtered = filtered.filter(
        (car) => car.year <= parseInt(filters.yearMax)
      );
    }

    // Mileage filter
    if (filters.mileageMax) {
      filtered = filtered.filter(
        (car) => car.mileage <= parseInt(filters.mileageMax)
      );
    }

    // Fuel type filter
    if (filters.fuelType !== "all") {
      filtered = filtered.filter((car) => car.specs.fuel === filters.fuelType);
    }

    // Transmission filter
    if (filters.transmission !== "all") {
      filtered = filtered.filter(
        (car) => car.specs.transmission === filters.transmission
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "year-new":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "year-old":
        filtered.sort((a, b) => a.year - b.year);
        break;
      case "mileage-low":
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
      case "mileage-high":
        filtered.sort((a, b) => b.mileage - a.mileage);
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredCars(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      brand: "all",
      priceMin: "",
      priceMax: "",
      yearMin: "",
      yearMax: "",
      mileageMax: "",
      fuelType: "all",
      transmission: "all",
      engineSize: "all",
      color: "all",
      sortBy: "newest",
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.brand !== "all") count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.yearMin || filters.yearMax) count++;
    if (filters.mileageMax) count++;
    if (filters.fuelType !== "all") count++;
    if (filters.transmission !== "all") count++;
    if (filters.engineSize !== "all") count++;
    if (filters.color !== "all") count++;
    return count;
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
    <div className="flex gap-8 max-w-7xl mx-auto px-4 py-12">
      {/* STICKY SIDEBAR - Desktop Only */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Filters</h2>
            {getActiveFiltersCount() > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-semibold text-sm transition"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Brand
              </label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              >
                {getUniqueBrands().map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === "all" ? "All Brands" : brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.priceMin}
                  onChange={(e) =>
                    handleFilterChange("priceMin", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.priceMax}
                  onChange={(e) =>
                    handleFilterChange("priceMax", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="From (e.g., 2020)"
                  value={filters.yearMin}
                  onChange={(e) =>
                    handleFilterChange("yearMin", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="To (e.g., 2024)"
                  value={filters.yearMax}
                  onChange={(e) =>
                    handleFilterChange("yearMax", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Max Mileage
              </label>
              <input
                type="number"
                placeholder="Any"
                value={filters.mileageMax}
                onChange={(e) =>
                  handleFilterChange("mileageMax", e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Engine Size - NEW */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Engine Size
              </label>
              <select
                value={filters.engineSize}
                onChange={(e) =>
                  handleFilterChange("engineSize", e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              >
                <option value="all">All Sizes</option>
                <option value="small">Small (≤ 2.2L)</option>
                <option value="medium">Medium (2.5-4.0L)</option>
                <option value="large">Large (≥ 5.0L / V8+)</option>
              </select>
            </div>

            {/* Color - NEW */}
            {getColors().length > 1 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Color
                </label>
                <select
                  value={filters.color}
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                >
                  {getColors().map((color) => (
                    <option key={color} value={color}>
                      {color === "all" ? "All Colors" : color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fuel Type
              </label>
              <select
                value={filters.fuelType}
                onChange={(e) => handleFilterChange("fuelType", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              >
                {getFuelTypes().map((type) => (
                  <option key={type} value={type}>
                    {type === "all" ? "All Fuel Types" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Transmission
              </label>
              <select
                value={filters.transmission}
                onChange={(e) =>
                  handleFilterChange("transmission", e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              >
                {getTransmissions().map((trans) => (
                  <option key={trans} value={trans}>
                    {trans === "all" ? "All Transmissions" : trans}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest</option>
                <option value="year-old">Year: Oldest</option>
                <option value="mileage-low">Mileage: Low to High</option>
                <option value="mileage-high">Mileage: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {/* Header with Mobile Filter Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Our Inventory</h1>
            <p className="text-slate-600 mt-2">
              {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"}{" "}
              available
              {getActiveFiltersCount() > 0 && (
                <span className="text-blue-600 ml-2">
                  ({getActiveFiltersCount()}{" "}
                  {getActiveFiltersCount() === 1 ? "filter" : "filters"} active)
                </span>
              )}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {getActiveFiltersCount() > 0 && (
              <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden animate-fade-in">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setShowFilters(false)}
            />
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto animate-slide-up">
              {/* Copy same filters as sidebar here */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Use same filter controls as sidebar */}
              <div className="space-y-4">
                {/* All filters go here - same as sidebar */}
              </div>
            </div>
          </div>
        )}

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-slate-600 text-lg mb-4">
              No cars match your filters
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer relative transform hover:-translate-y-1"
                onClick={() => navigate(`/car/${car.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
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
                  {/* Color badge if available */}
                  {car.color && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                      {car.color}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {car.name}
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm line-clamp-2">
                    {car.description}
                  </p>
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
    </div>
  );
};

export default InventoryPage;
