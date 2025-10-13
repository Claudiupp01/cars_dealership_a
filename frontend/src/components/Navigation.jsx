// frontend/src/components/Navigation.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Car, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">Elite Motors</span>
          </Link>

          <div className="flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-400 transition">
              Home
            </Link>
            <Link to="/inventory" className="hover:text-blue-400 transition">
              Inventory
            </Link>
            <Link to="/about" className="hover:text-blue-400 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-blue-400 transition">
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="hover:text-blue-400 transition"
                  >
                    Admin
                  </Link>
                )}
                {(user?.role === "owner" || user?.role === "admin") && (
                  <Link
                    to="/owner/dashboard"
                    className="hover:text-blue-400 transition"
                  >
                    Inventory
                  </Link>
                )}
                <Link
                  to="/user/profile"
                  className="flex items-center space-x-2 hover:text-blue-400 transition"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.username}</span>
                  {user?.role !== "user" && (
                    <span className="bg-blue-600 px-2 py-1 rounded text-xs">
                      {user?.role}
                    </span>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 hover:text-blue-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-blue-400 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
