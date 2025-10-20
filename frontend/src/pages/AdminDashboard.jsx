import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Users, Car, Shield, Search } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated || !user) {
      navigate("/", { replace: true });
      return;
    }

    if (user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    setIsChecking(false);
  }, [user, isAuthenticated, navigate]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        Admin Dashboard
      </h1>
      <p className="text-slate-600 mb-8">Manage your platform</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management Card */}
        <Link
          to="/admin/users"
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-blue-500"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                User Management
              </h2>
              <p className="text-slate-600">View and manage all users</p>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            • Change user roles
            <br />
            • View user details
            <br />• Search and filter users
          </div>
        </Link>

        {/* Car Inventory Card */}
        <Link
          to="/owner/dashboard"
          className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-green-500"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Car Inventory
              </h2>
              <p className="text-slate-600">Manage car listings</p>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            • Add new cars
            <br />
            • Edit existing cars
            <br />• Delete cars
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
