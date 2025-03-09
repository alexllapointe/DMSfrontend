// src/App.js
import React, { useState } from "react";
import Register from "./Register";
import Login from "./login";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="App">
      <h1>{showLogin ? "User Login" : "User Registration"}</h1>
      {showLogin ? <Login /> : <Register />}
      <button onClick={() => setShowLogin(!showLogin)} className="toggle-button">
        {showLogin ? "Go to Register" : "Go to Login"}
      </button>
    </div>
  );
}

export default App;
