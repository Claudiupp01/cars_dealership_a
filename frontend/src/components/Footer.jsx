import React from "react";
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
              <div className="hover:text-white cursor-pointer">Home</div>
              <div className="hover:text-white cursor-pointer">Inventory</div>
              <div className="hover:text-white cursor-pointer">About</div>
              <div className="hover:text-white cursor-pointer">Contact</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-slate-400">
              <div>+1 (555) 123-4567</div>
              <div>sales@elitemotors.com</div>
              <div>123 Luxury Lane, Beverly Hills</div>
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
