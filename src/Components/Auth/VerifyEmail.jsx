import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../Styles/VerifyEmail.css";

const VerifyEmail = () => {
    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrorMessage("Email not found. Please try registering again.");
            return;
        }

        try {
            const response = await fetch("https://dmsservice-latest.onrender.com/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            if (response.ok) {
                alert("Email verified successfully! You can now login.");
                navigate("/login");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Verification failed. Please try again.");
            }
        } catch (error) {
            setErrorMessage("Network error: Unable to contact the server.");
        }
    };

    return (
        <div className="verify-email-container">
            <div className="verify-email-form-container">
                <h2 className="verify-email-title">Verify Your Email</h2>
                <form className="verify-email-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="otp">
                            Enter OTP <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="Enter the 6-digit OTP sent to your email"
                        />
                    </div>

                    {errorMessage && <div className="error-message">{errorMessage}</div>}

                    <div className="form-group">
                        <button type="submit" className="verify-btn">
                            Verify Email
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail; 