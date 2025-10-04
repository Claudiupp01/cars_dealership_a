import React, { useState, useEffect } from "react";
import { Car, Phone, Mail, MapPin, ChevronRight, Star } from "lucide-react";

// Mock data - this will come from your FastAPI backend later
const mockCars = [
  {
    id: 1,
    name: "Mercedes-Benz S-Class",
    price: 95000,
    year: 2023,
    mileage: 5000,
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
    featured: true,
    description: "Luxury sedan with cutting-edge technology and comfort",
    specs: { engine: "3.0L V6", transmission: "Automatic", fuel: "Gasoline" },
  },
  {
    id: 2,
    name: "BMW M4 Competition",
    price: 78000,
    year: 2023,
    mileage: 3000,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    featured: true,
    description: "High-performance sports coupe with racing DNA",
    specs: {
      engine: "3.0L Twin-Turbo I6",
      transmission: "Automatic",
      fuel: "Gasoline",
    },
  },
  {
    id: 3,
    name: "Audi e-tron GT",
    price: 105000,
    year: 2023,
    mileage: 2000,
    image:
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&h=600&fit=crop",
    featured: false,
    description:
      "Electric gran turismo combining performance and sustainability",
    specs: { engine: "Electric", transmission: "Automatic", fuel: "Electric" },
  },
  {
    id: 4,
    name: "Porsche 911 Carrera",
    price: 115000,
    year: 2023,
    mileage: 4000,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
    featured: true,
    description: "Iconic sports car with timeless design",
    specs: {
      engine: "3.0L Twin-Turbo Flat-6",
      transmission: "PDK",
      fuel: "Gasoline",
    },
  },
  {
    id: 5,
    name: "Tesla Model S Plaid",
    price: 89000,
    year: 2023,
    mileage: 6000,
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    featured: false,
    description: "Fastest accelerating production car with autopilot",
    specs: {
      engine: "Electric Tri-Motor",
      transmission: "Single-Speed",
      fuel: "Electric",
    },
  },
  {
    id: 6,
    name: "Range Rover Sport",
    price: 92000,
    year: 2023,
    mileage: 7000,
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
    featured: false,
    description: "Luxury SUV with exceptional off-road capability",
    specs: {
      engine: "3.0L Supercharged V6",
      transmission: "Automatic",
      fuel: "Gasoline",
    },
  },
];

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Simulate API call - replace with actual fetch to FastAPI
    setCars(mockCars);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const Navigation = () => (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            <Car className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">Elite Motors</span>
          </div>
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentPage("home")}
              className={`hover:text-blue-400 transition ${
                currentPage === "home" ? "text-blue-400" : ""
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("inventory")}
              className={`hover:text-blue-400 transition ${
                currentPage === "inventory" ? "text-blue-400" : ""
              }`}
            >
              Inventory
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`hover:text-blue-400 transition ${
                currentPage === "about" ? "text-blue-400" : ""
              }`}
            >
              About
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className={`hover:text-blue-400 transition ${
                currentPage === "contact" ? "text-blue-400" : ""
              }`}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const HomePage = () => (
    <div>
      <div className="relative h-96 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Drive Your Dream</h1>
            <p className="text-xl mb-8">
              Discover our curated collection of luxury and performance vehicles
            </p>
            <button
              onClick={() => setCurrentPage("inventory")}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition flex items-center space-x-2"
            >
              <span>Browse Inventory</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-slate-600 text-lg">
            Hand-picked selections from our premium collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars
            .filter((car) => car.featured)
            .map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
                onClick={() => {
                  setSelectedCar(car);
                  setCurrentPage("details");
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {car.name}
                  </h3>
                  <p className="text-slate-600 mb-4">{car.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(car.price)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {car.year} · {car.mileage.toLocaleString()} mi
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Selection</h3>
              <p className="text-slate-600">
                Every vehicle carefully inspected and certified
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Test Drive</h3>
              <p className="text-slate-600">
                Experience your dream car before you buy
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Support</h3>
              <p className="text-slate-600">
                Dedicated team to help you find the perfect match
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const InventoryPage = () => (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Our Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
            onClick={() => {
              setSelectedCar(car);
              setCurrentPage("details");
            }}
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
    </div>
  );

  const CarDetailsPage = () => {
    if (!selectedCar) return <div>Car not found</div>;

    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <button
          onClick={() => setCurrentPage("inventory")}
          className="text-blue-600 hover:text-blue-700 mb-6 flex items-center"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          Back to Inventory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <img
              src={selectedCar.image}
              alt={selectedCar.name}
              className="w-full h-96 object-cover rounded-xl shadow-lg"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              {selectedCar.name}
            </h1>
            <div className="text-4xl font-bold text-blue-600 mb-6">
              {formatPrice(selectedCar.price)}
            </div>

            <p className="text-slate-600 text-lg mb-8">
              {selectedCar.description}
            </p>

            <div className="bg-slate-50 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-500 text-sm">Year</div>
                  <div className="font-semibold">{selectedCar.year}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Mileage</div>
                  <div className="font-semibold">
                    {selectedCar.mileage.toLocaleString()} miles
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Engine</div>
                  <div className="font-semibold">
                    {selectedCar.specs.engine}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Transmission</div>
                  <div className="font-semibold">
                    {selectedCar.specs.transmission}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-sm">Fuel Type</div>
                  <div className="font-semibold">{selectedCar.specs.fuel}</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Schedule Test Drive
              </button>
              <button
                onClick={() => setCurrentPage("contact")}
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

  const AboutPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        About Elite Motors
      </h1>

      <div className="prose prose-lg">
        <p className="text-slate-600 text-lg mb-6">
          Welcome to Elite Motors, your premier destination for luxury and
          performance vehicles. With over 20 years of experience in the
          automotive industry, we've built our reputation on trust, quality, and
          exceptional customer service.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          Our Mission
        </h2>
        <p className="text-slate-600 mb-6">
          We're passionate about connecting discerning buyers with their dream
          vehicles. Every car in our inventory is meticulously inspected,
          certified, and prepared to exceed your expectations.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          Why Choose Us
        </h2>
        <ul className="text-slate-600 space-y-3 mb-6">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Carefully curated selection of premium vehicles</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Comprehensive vehicle inspections and certifications</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Transparent pricing with no hidden fees</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Expert financing options tailored to your needs</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Worldwide delivery available</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Phone className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <div className="font-semibold">Phone</div>
                <div className="text-slate-600">+1 (555) 123-4567</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-slate-600">sales@elitemotors.com</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <div className="font-semibold">Address</div>
                <div className="text-slate-600">
                  123 Luxury Lane
                  <br />
                  Beverly Hills, CA 90210
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Business Hours</h3>
            <div className="text-slate-600 space-y-1">
              <div>Monday - Friday: 9:00 AM - 7:00 PM</div>
              <div>Saturday: 10:00 AM - 6:00 PM</div>
              <div>Sunday: 12:00 PM - 5:00 PM</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  const Footer = () => (
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

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {currentPage === "home" && <HomePage />}
      {currentPage === "inventory" && <InventoryPage />}
      {currentPage === "details" && <CarDetailsPage />}
      {currentPage === "about" && <AboutPage />}
      {currentPage === "contact" && <ContactPage />}
      <Footer />
    </div>
  );
};

export default App;
