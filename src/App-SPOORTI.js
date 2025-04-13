import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrackingPage from "./Components/TrackingPage";
import LandingPage from "./Components/LandingPage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;