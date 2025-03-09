
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./Register.css"; // Reusing CSS

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
    // TODO: Implement login logic (API call)
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log("Google Login Success:", response);
    // TODO: Handle login using response.credential
  };

  const handleGoogleLoginFailure = () => {
    console.log("Google Login Failed");
  };

  return (
    <div className="register-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>

      <h3>OR</h3>
      <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginFailure} />
    </div>
  );
};

export default Login;
