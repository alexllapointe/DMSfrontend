import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link component
import "../../Styles/RegisterPage.css";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";



const RegisterPage = () => {
  // State for form fields
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();


  // Password validation
  const validatePassword = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (!validatePassword()) return;

    // Prepare data to be sent to the backend
    const formData = {
      firstname,
      lastname,
      email,
      password,
    };

    try {
      // Send POST request to the backend (Replace with your backend URL)
      const response = await fetch("https://dmsservice-latest.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("OTP sent! Please check your email to verify.");
        navigate('/verifyemail', { state: { email } });
        // Reset the form or redirect to another page
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Something went wrong.");
      }
    } catch (error) {
      setErrorMessage("Network error: Unable to contact the server.");
    }
  };

  const handleLoginSuccess = (response) => {
    console.log("Google Login Success:", response);
    const { credential } = response;

    // Send token to backend for authentication
    fetch("http://localhost:8080/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server Response:", data);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <h2 className="register-title">Delivery Management System</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">
              First Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">
              Last Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="form-group">
            <button type="submit" className="register-btn">
              Register
            </button>
          </div>
          <div className="form-group">

            <GoogleOAuthProvider clientId="125429871805-74d8nc2hbg1p3eucotjns1cfv07h1ntj.apps.googleusercontent.com" className="google-btn">
              <div style={{ textAlign: "center" }}>

                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => console.log("Login Failed")}
                />
              </div>
            </GoogleOAuthProvider>

          </div>
        </form>

        {/* Link to Login Page */}
        <div className="form-group">
          <p>
            Already registered?{" "}
            <Link to="/login" className="sign-in-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
