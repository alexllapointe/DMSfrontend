import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Page Components
import TrackingPage from "./Components/TrackingPage";
import LandingPage from "./Components/LandingPage";
import CustomerDashboard from "./Components/CustomerDashboard";
import DeliveryManagerDashboard from "./Components/DeliveryManagerDashboard";

// Layout Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import SupportChatWidget from "./Components/SupportChatWidget";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/manager-dashboard" element={<DeliveryManagerDashboard />} />
      </Routes>
      <Footer />
      <SupportChatWidget customerId="64abc..." managerId="64def..." />
    </Router>
  );
}

export default App;
