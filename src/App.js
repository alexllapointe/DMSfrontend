import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrackingPage from "./Components/TrackingPage";
import LandingPage from "./Components/LandingPage";
import Navbar from "./Components/Navbar";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;