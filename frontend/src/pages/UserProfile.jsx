// frontend/src/pages/UserProfile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Calendar, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">My Profile</h1>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {user.full_name || user.username}
            </h2>
            <p className="text-slate-600">@{user.username}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                user.role === "admin"
                  ? "bg-red-100 text-red-700"
                  : user.role === "owner"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
            <Mail className="w-5 h-5 text-slate-600" />
            <div>
              <div className="text-sm text-slate-500">Email</div>
              <div className="font-semibold text-slate-900">{user.email}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
            <Calendar className="w-5 h-5 text-slate-600" />
            <div>
              <div className="text-sm text-slate-500">Member Since</div>
              <div className="font-semibold text-slate-900">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
            <Shield className="w-5 h-5 text-slate-600" />
            <div>
              <div className="text-sm text-slate-500">Account Status</div>
              <div className="font-semibold text-green-600">
                {user.is_active ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/user/favorites")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            My Favorites
          </button>
          <button
            onClick={() => navigate("/user/test-drives")}
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-6 py-3 rounded-lg font-semibold transition"
          >
            My Test Drives
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
