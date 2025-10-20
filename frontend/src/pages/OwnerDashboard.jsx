import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Car } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getAllCars, deleteCar } from "../services/api";

const OwnerDashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated || !user) {
      navigate("/", { replace: true });
      return;
    }

    if (user.role !== "owner" && user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    setIsChecking(false);
    loadCars();
  }, [user, isAuthenticated, navigate]);

  const loadCars = async () => {
    setLoading(true);
    try {
      const data = await getAllCars();
      setCars(data);
    } catch (error) {
      console.error("Error loading cars:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (carId, carName) => {
    if (!window.confirm(`Are you sure you want to delete ${carName}?`)) {
      return;
    }

    try {
      await deleteCar(carId);
      loadCars();
      alert("Car deleted successfully");
    } catch (error) {
      alert("Failed to delete car: " + error.message);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Show loading while checking auth
  if (isChecking || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Car Inventory Management
          </h1>
          <p className="text-slate-600 mt-2">Manage your car listings</p>
        </div>
        <button
          onClick={() => navigate("/owner/cars/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Car</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                Car
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                Price
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                Year
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                Mileage
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                Featured
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">
                        {car.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {car.specs.engine}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-900">
                  {formatPrice(car.price)}
                </td>
                <td className="px-6 py-4 text-slate-600">{car.year}</td>
                <td className="px-6 py-4 text-slate-600">
                  {car.mileage.toLocaleString()} mi
                </td>
                <td className="px-6 py-4">
                  {car.featured ? (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                      Standard
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/owner/cars/edit/${car.id}`)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id, car.name)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cars.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No cars in inventory</p>
            <button
              onClick={() => navigate("/owner/cars/new")}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Add your first car
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
