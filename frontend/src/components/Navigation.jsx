import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Car } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">Elite Motors</span>
          </Link>
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`hover:text-blue-400 transition ${
                isActive("/") ? "text-blue-400" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/inventory"
              className={`hover:text-blue-400 transition ${
                isActive("/inventory") ? "text-blue-400" : ""
              }`}
            >
              Inventory
            </Link>
            <Link
              to="/about"
              className={`hover:text-blue-400 transition ${
                isActive("/about") ? "text-blue-400" : ""
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`hover:text-blue-400 transition ${
                isActive("/contact") ? "text-blue-400" : ""
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
