import React, { useEffect, useState } from "react";

const PaymentSuccess = () => {
    const [trackingInfo, setTrackingInfo] = useState(null);

    useEffect(() => {
        const storedTracking = localStorage.getItem('trackingInfo');
        if (storedTracking) {
            setTrackingInfo(JSON.parse(storedTracking));
            // Optional: clear it after loading to keep storage clean
            localStorage.removeItem('trackingInfo');
        }
    }, []);

    if (!trackingInfo) {
        return (
            <div style={styles.container}>
                <h2>Loading your order details...</h2>
            </div>
        );
    }

    return (
        <div style={styles.fullScreenContainer}>
            <div style={styles.container}>
                <h1 style={styles.title}>🎉 Payment Successful!</h1>
                <p style={styles.subtitle}>Thank you for your order. Your payment has been successfully processed.</p>

                <div style={styles.detailsBox}>
                    <h3 style={styles.detailsTitle}>Order Details</h3>
                    <p><strong>Order ID:</strong> {trackingInfo.orderId}</p>
                    <p><strong>Tracking ID:</strong> {trackingInfo.trackingId}</p>
                    <p><strong>Current Status:</strong> {trackingInfo.currentLocation}</p>
                </div>

                <button style={styles.button}>
                    Track Your Order
                </button>
            </div>
        </div>
    );
};

const styles = {
    fullScreenContainer: {
        minHeight: "100vh", // 👈 Full screen height
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
    },
    container: {
        textAlign: "center",
        padding: "50px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "32px",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "18px",
        marginBottom: "30px",
        color: "#555",
    },
    detailsBox: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "30px",
        backgroundColor: "#f9f9f9",
        display: "inline-block",
    },
    detailsTitle: {
        marginBottom: "15px",
    },
    button: {
        padding: "12px 24px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
    }
};

export default PaymentSuccess;