import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getCarById } from "../services/api";

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);

  useEffect(() => {
    getCarById(id).then((data) => setCar(data));
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!car) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate("/inventory")}
        className="text-blue-600 hover:text-blue-700 mb-6 flex items-center"
      >
        <ChevronRight className="w-5 h-5 rotate-180" />
        Back to Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img
            src={car.image}
            alt={car.name}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{car.name}</h1>
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
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
              Schedule Test Drive
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 px-6 py-3 rounded-lg font-semibold transition"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
