import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCars } from "../services/api";

const InventoryPage = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCars().then((data) => setCars(data));
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Our Inventory</h1>
      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">No cars available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
              onClick={() => navigate(`/car/${car.id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {car.name}
                </h3>
                <p className="text-slate-600 mb-4 text-sm">{car.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(car.price)}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-500 pt-4 border-t">
                  <span>{car.year}</span>
                  <span>{car.mileage.toLocaleString()} mi</span>
                  <span>{car.specs.fuel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
