import React from "react";
import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Car className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Elite Motors</span>
            </div>
            <p className="text-slate-400">
              Your trusted partner in luxury automotive excellence.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <div className="space-y-2 text-slate-400">
              <Link to="/" className="block hover:text-white transition">
                Home
              </Link>
              <Link
                to="/inventory"
                className="block hover:text-white transition"
              >
                Inventory
              </Link>
              <Link to="/about" className="block hover:text-white transition">
                About
              </Link>
              <Link to="/contact" className="block hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-slate-400">
              <a
                href="tel:+15551234567"
                className="block hover:text-white transition"
              >
                +1 (555) 123-4567
              </a>
              <a
                href="mailto:sales@elitemotors.com"
                className="block hover:text-white transition"
              >
                sales@elitemotors.com
              </a>
              <p>123 Luxury Lane, Beverly Hills</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>&copy; 2023 Elite Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
