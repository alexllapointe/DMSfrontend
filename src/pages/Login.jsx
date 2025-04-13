import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Using the new library
import "../Styles/Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google login success:", credentialResponse);
  };

  const handleGoogleError = () => {
    console.log("Google login error");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="loginPassword">Password</label>
          <input
            type="password"
            id="loginPassword"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Login</button>
        </form>
        <div className="divider"><span>or</span></div>
        <div className="google-auth">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </div>
    </div>
  );
}

export default Login;
