// frontend/src/pages/TestDrivesPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Clock, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getTestDrives } from "../services/api";

const TestDrivesPage = () => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadTestDrives();
  }, [user, navigate]);

  const loadTestDrives = async () => {
    setLoading(true);
    try {
      const data = await getTestDrives();
      setTestDrives(data);
    } catch (error) {
      alert("Failed to load test drives: " + error.message);
    }
    setLoading(false);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">Loading test drives...</div>
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
        <Calendar className="w-8 h-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-slate-900">My Test Drives</h1>
      </div>

      {testDrives.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-4">
            You haven't requested any test drives yet
          </p>
          <button
            onClick={() => navigate("/inventory")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Cars
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {testDrives.map((td) => (
            <div
              key={td.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={td.car.image}
                      alt={td.car.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {td.car.name}
                      </h3>
                      <p className="text-slate-600">
                        {td.car.year} • {td.car.mileage.toLocaleString()} mi
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      td.status
                    )}`}
                  >
                    {td.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <div className="text-xs text-slate-500">
                        Preferred Date
                      </div>
                      <div className="font-semibold">{td.preferred_date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-5 h-5" />
                    <div>
                      <div className="text-xs text-slate-500">
                        Preferred Time
                      </div>
                      <div className="font-semibold">{td.preferred_time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Phone className="w-5 h-5" />
                    <div>
                      <div className="text-xs text-slate-500">Phone</div>
                      <div className="font-semibold">{td.phone}</div>
                    </div>
                  </div>
                </div>

                {td.message && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Message</div>
                    <p className="text-slate-700">{td.message}</p>
                  </div>
                )}

                <div className="mt-4 text-sm text-slate-500">
                  Requested on {new Date(td.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestDrivesPage;
