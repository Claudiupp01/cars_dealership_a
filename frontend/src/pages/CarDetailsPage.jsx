import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Heart, Calendar, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  getCarById,
  addFavorite,
  removeFavorite,
  getFavorites,
  requestTestDrive,
} from "../services/api";

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [car, setCar] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCar();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && car) {
      checkFavorite();
    }
  }, [isAuthenticated, car]);

  const loadCar = async () => {
    const data = await getCarById(id);
    setCar(data);
  };

  const checkFavorite = async () => {
    try {
      const favs = await getFavorites();
      setIsFavorite(favs.some((f) => f.car.id === parseInt(id)));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite(parseInt(id));
        setIsFavorite(false);
      } else {
        await addFavorite(parseInt(id));
        setIsFavorite(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openTestDriveModal = () => {
    if (!isAuthenticated) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!car) return <div className="text-center py-12">Loading...</div>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate("/inventory")}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          Back to Inventory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
            <button
              onClick={toggleFavorite}
              className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition"
            >
              <Heart
                className={`w-7 h-7 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"
                }`}
              />
            </button>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {car.name}
            </h1>
            <div className="text-4xl font-bold text-blue-600 mb-6">
              {formatPrice(car.price)}
            </div>

            <p className="text-slate-600 text-lg mb-8">{car.description}</p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500 text-sm">Year</div>
                  <div className="font-semibold">{car.year}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Mileage</div>
                  <div className="font-semibold">
                    {car.mileage.toLocaleString()} miles
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Engine</div>
                  <div className="font-semibold">{car.specs.engine}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Transmission</div>
                  <div className="font-semibold">{car.specs.transmission}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Fuel Type</div>
                  <div className="font-semibold">{car.specs.fuel}</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={openTestDriveModal}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Test Drive</span>
              </button>
              <button
                onClick={toggleFavorite}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${
                  isFavorite
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                />
                <span>{isFavorite ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            <TestDriveForm car={car} onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};

const TestDriveForm = ({ car, onClose }) => {
  const [formData, setFormData] = useState({
    preferred_date: "",
    preferred_time: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestTestDrive({
        car_id: car.id,
        ...formData,
      });
      alert("Test drive request submitted!");
      onClose();
      navigate("/user/test-drives");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Schedule Test Drive</h2>
      <p className="text-slate-600 mb-6">Request a test drive for {car.name}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input
              type="date"
              required
              value={formData.preferred_date}
              onChange={(e) =>
                setFormData({ ...formData, preferred_date: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time *</label>
            <select
              required
              value={formData.preferred_time}
              onChange={(e) =>
                setFormData({ ...formData, preferred_time: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="2:00 PM">2:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:00 PM">4:00 PM</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea
            rows="3"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-200 hover:bg-slate-300 py-3 rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarDetailsPage;
