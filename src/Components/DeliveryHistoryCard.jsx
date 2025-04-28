import React from "react";
import "../Styles/DriverProfileCard.css";

const DeliveryHistoryCard = ({ id, from, to, rating }) => {
    return (
        <div className="history-card">
            <p><strong>Order ID:</strong> {id}</p>
            <p><strong>From:</strong> {from}</p>
            <p><strong>To:</strong> {to}</p>
            <p>
                <strong>Rating:</strong> {"⭐".repeat(rating)} ({rating} / 5)
            </p>
        </div>
    );
};

export default DeliveryHistoryCard;