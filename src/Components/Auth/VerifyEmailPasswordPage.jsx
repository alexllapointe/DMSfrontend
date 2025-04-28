import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../../Styles/VerifyEmailPasswordPage.css';

const VerifyEmailPasswordPage = () => {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const handleVerify = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/verifyemailpassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, password }),
            });

            if (response.ok) {
                alert("Email verified and password updated successfully!");
                navigate("/login");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Invalid code.");
            }
        } catch (err) {
            setError("Network error.");
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-form-container">
                <h2 className="verify-title">Email Verification</h2>
                <p className="timer">
                    This code will expire in {timeLeft} seconds.
                    We've sent a 6-digit code to <strong>{email}</strong>
                </p>
                <input
                    className="otp-input"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                />
                <input
                    className="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                />
                <input
                    className="password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                />
                {error && <div className="error-message">{error}</div>}
                <button className="verify-btn" onClick={handleVerify}>
                    Verify
                </button>
            </div>
        </div>
    );
};

export default VerifyEmailPasswordPage;