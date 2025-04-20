import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrackingPage from "./Components/TrackingPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Support from "./Components/Support";
import Login from "./Components/Auth/LoginPage";
import Register from "./Components/Auth/RegisterPage";
import LocationsMap from "./Components/LocationsMap"; // Make sure it's imported

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TrackingPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/locations/:name" element={<LocationsMap />} />
      </Routes>
      <Footer />
    </Router>
  );
}




export default App;