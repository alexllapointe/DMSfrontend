import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrackingPage from "./Components/TrackingPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Support from "./Components/Support";
import Login from "./Components/Auth/LoginPage";
import DeliveryManagerDashboard from "./Components/DeliveryManagerDashboard";
import Register from "./Components/Auth/RegisterPage";
import VerifyEmail from "./Components/Auth/VerifyEmail";
import LocationsMap from "./Components/LocationsMap";
import Chat from "./Components/Chat";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<TrackingPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/manager-dashboard" element={<DeliveryManagerDashboard />} />
        <Route path="/locations/:name" element={<LocationsMap />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;