import React, { useState } from 'react';
import '../../Styles/ForgotPassword.css';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const validateEmail = () => {
        if (email !== confirmEmail) {
            setErrorMessage("Email Id do not match.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail()) return;

        const formData = {
            email
        };

        try {
            const response = await fetch('http://localhost:8080/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // On success, redirect to OTP verification page
                navigate("/verify-email-password-page", { state: { email: formData.email } });
            } else {
                setErrorMessage(data.message || "Something went wrong.");
            }
        } catch (error) {
            setErrorMessage("Error occurred while sending OTP.");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email *</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Confirm Email *</label>
                    <input
                        type="email"
                        placeholder="Re-enter your email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        required
                    />
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className="verify-button">Verify Email</button>
                </form>
                <p>Remember your password? <a href="/login">Log in</a></p>
            </div>
        </div>
    );
};

export default ForgotPassword;