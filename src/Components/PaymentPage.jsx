import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import "../Styles/PaymentPage.css";

const stripePromise = loadStripe("pk_test_51REn9g4F19d3jQ1bvt9vYtgb2JyHAqJ9oDu2ltCpVKucGFRL3lFVHhywllXP007aTxRMOUhYEKSNtjRc1rCYJtlD00MqBcTNhq");

const PaymentPage = ({ order }) => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");

    const providerName = order.deliverytype?.split('_')[0]; // fedex, ups, etc.
    const capitalizedProvider = providerName ? providerName.charAt(0).toUpperCase() + providerName.slice(1) : '';

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login");

        const email = localStorage.getItem("userEmail");
        if (email) setUserEmail(email);
    }, [navigate]);

    if (!order) {
        return (
            <div className="payment-container">
                <h2>Error: No order found. Please go back and try again.</h2>
            </div>
        );
    }

    const handlePayment = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Session expired. Please login again.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("https://dmsservice-latest.onrender.com/api/payment/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(order),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Payment error:", errorText);
                alert("Payment failed: " + errorText);
                return;
            }

            const data = await response.json();
            const stripe = await stripePromise;
            console.log(data);


            if (data.tracking) {
                localStorage.setItem('trackingInfo', JSON.stringify(data.tracking));
            }
            window.location.href = data.url;

        } catch (err) {
            console.error("Network error:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="payment-container">
            <h1>Complete Your Payment</h1>
            <p>Please review your delivery details and complete payment.</p>

            <div className="payment-box">
                <h2>Order Summary</h2>
                <p><strong>Destination Address:</strong> {order.destinationaddress}</p>
                <p><strong>Provider:</strong> {capitalizedProvider}</p>
                <p><strong>Price:</strong> ${order.totalPrice.toFixed(2)}</p>
                <p><strong>Your Email:</strong> {userEmail}</p>
            </div>

            <button onClick={handlePayment} className="pay-btn">
                Proceed to Payment
            </button>
        </div>
    );
};

export default PaymentPage;