import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Using the new library
import "../Styles/Auth.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google register success:", credentialResponse);
  };

  const handleGoogleError = () => {
    console.log("Google register error");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering with:", { email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 className="auth-title">Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="registerEmail">Email</label>
          <input
            type="email"
            id="registerEmail"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="registerPassword">Password</label>
          <input
            type="password"
            id="registerPassword"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Register</button>
        </form>
        <div className="divider"><span>or</span></div>
        <div className="google-auth">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>
      </div>
    </div>
  );
}

export default Register;
