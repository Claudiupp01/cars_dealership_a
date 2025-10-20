// frontend/src/pages/OwnerDashboard.jsx - ENHANCED VERSION
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Car,
  Calendar,
  User,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getAllCars, deleteCar } from "../services/api";

const OwnerDashboard = () => {
  const [cars, setCars] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("cars"); // "cars" or "test-drives"
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/", { replace: true });
      return;
    }

    if (user.role !== "owner" && user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    setIsChecking(false);
    loadData();
  }, [user, isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadCars(), loadTestDrives()]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const loadCars = async () => {
    const data = await getAllCars();
    setCars(data);
  };

  const loadTestDrives = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/api/owner/test-drives",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTestDrives(data);
      }
    } catch (error) {
      console.error("Error loading test drives:", error);
    }
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

  const updateTestDriveStatus = async (testDriveId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/owner/test-drives/${testDriveId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        loadTestDrives();
        alert(`Test drive ${newStatus} successfully`);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Error updating test drive: " + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isChecking || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Manage your inventory and appointments
          </p>
        </div>
        <button
          onClick={() => navigate("/owner/cars/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Car</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Car className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">
              {cars.length}
            </span>
          </div>
          <p className="text-slate-700 font-semibold">Total Cars</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            <span className="text-3xl font-bold text-purple-600">
              {testDrives.length}
            </span>
          </div>
          <p className="text-slate-700 font-semibold">Test Drives</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
            <span className="text-3xl font-bold text-yellow-600">
              {testDrives.filter((td) => td.status === "pending").length}
            </span>
          </div>
          <p className="text-slate-700 font-semibold">Pending</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-green-600">
              {testDrives.filter((td) => td.status === "approved").length}
            </span>
          </div>
          <p className="text-slate-700 font-semibold">Approved</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("cars")}
          className={`pb-3 px-4 font-semibold transition ${
            activeTab === "cars"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Car className="w-5 h-5 inline mr-2" />
          Car Inventory ({cars.length})
        </button>
        <button
          onClick={() => setActiveTab("test-drives")}
          className={`pb-3 px-4 font-semibold transition ${
            activeTab === "test-drives"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-5 h-5 inline mr-2" />
          Test Drive Requests ({testDrives.length})
        </button>
      </div>

      {/* Cars Table */}
      {activeTab === "cars" && (
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
      )}

      {/* Test Drives Table */}
      {activeTab === "test-drives" && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {testDrives.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">
                No test drive requests yet
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {testDrives.map((td) => (
                <div key={td.id} className="p-6 hover:bg-slate-50">
                  <div className="flex items-start space-x-4">
                    {/* Car Image */}
                    <img
                      src={td.car?.image || "https://via.placeholder.com/150"}
                      alt={td.car?.name || "Car"}
                      className="w-32 h-32 object-cover rounded-lg"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {td.car?.name || "Unknown Car"}
                          </h3>
                          <p className="text-slate-600">
                            {formatPrice(td.car?.price || 0)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            td.status
                          )}`}
                        >
                          {td.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="flex items-center text-slate-500 text-sm mb-1">
                            <User className="w-4 h-4 mr-1" />
                            Customer
                          </div>
                          <div className="font-semibold">
                            {td.user?.full_name || td.user?.username || "N/A"}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center text-slate-500 text-sm mb-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            Date
                          </div>
                          <div className="font-semibold">
                            {td.preferred_date}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center text-slate-500 text-sm mb-1">
                            <Clock className="w-4 h-4 mr-1" />
                            Time
                          </div>
                          <div className="font-semibold">
                            {td.preferred_time}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center text-slate-500 text-sm mb-1">
                            <Phone className="w-4 h-4 mr-1" />
                            Phone
                          </div>
                          <div className="font-semibold">{td.phone}</div>
                        </div>
                      </div>

                      {td.message && (
                        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                          <div className="text-xs text-slate-500 mb-1">
                            Message
                          </div>
                          <p className="text-slate-700">{td.message}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {td.status === "pending" && (
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() =>
                              updateTestDriveStatus(td.id, "approved")
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() =>
                              updateTestDriveStatus(td.id, "cancelled")
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
