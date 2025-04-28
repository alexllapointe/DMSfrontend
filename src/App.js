import React, { useState, useEffect } from "react";
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
import DriverDashboard from "./Components/DriverDashboard";
import PaymentSuccess from "./Components/PaymentSuccess";

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode the JWT manually
        setUserRole(decoded.scope); // Assuming the role is in `scope`
      } catch (err) {
        console.error('Invalid token format:', err);
      }
    }
  }, []);

  return (
    <Router>
      <Navbar userRole={userRole} setUserRole={setUserRole} />
      <Routes>
        <Route path="/" element={<TrackingPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/register" element={<Register setUserRole={setUserRole} />} />
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/manager-dashboard" element={<DeliveryManagerDashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/locations/:name" element={<LocationsMap />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;