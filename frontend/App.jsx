// At the top of App.jsx, add this import:
import { getAllCars } from "./services/api";

// Then replace the useEffect with:
useEffect(() => {
  // Fetch cars from FastAPI backend
  getAllCars().then((data) => setCars(data));
}, []);
