import React, { useState } from "react";
import '../../Styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginPage = ({ setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[handleSubmit] Submit button clicked");

    if (!validatePassword()) {
      console.log("[handleSubmit] Password validation failed");
      return;
    }

    const formData = { email, password };

    try {
      const response = await fetch("https://dmsservice-latest.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("[handleSubmit] Received response:", response);

      if (response.ok) {
        const token = await response.text();
        console.log("[handleSubmit] Login successful, token received:", token);

        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);
        console.log("[handleSubmit] Decoded JWT:", decoded);

        localStorage.setItem('userEmail', decoded.sub);
        setUserRole(decoded.scope);

        alert("Login successful!");
        navigate('/');
      } else {
        console.log("[handleSubmit] Login failed, parsing error response...");
        const errorData = await response.json();
        console.log("[handleSubmit] Error data from server:", errorData);

        if (errorData.message === "Bad credentials") {
          setErrorMessage("Invalid email or password. If you're new, please register first.");
        } else {
          setErrorMessage(errorData.message || "Login failed.");
        }
      }

    } catch (error) {
      console.error("[handleSubmit] Network or unexpected error:", error);
      setErrorMessage("Network error: Unable to contact the server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="form-group">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
          <div className="form-group">
            <a href="#forgot-password" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>
          <div className="form-group">
            <button type="button" className="google-btn">
              Continue with Google
            </button>
          </div>
          <div className="form-group">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="sign-up-link">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;