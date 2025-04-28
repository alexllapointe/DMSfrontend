import React, { useState } from "react";
import "../Styles/DriverProfileCard.css";
import DeliveryHistoryCard from "../Components/DeliveryHistoryCard";
import ChatBox from "./ChatBox";

import { PackageCheck, MessagesSquare, Clock, User2 } from "lucide-react";

const DriverDashboard = () => {
    const [activeSection, setActiveSection] = useState("");
    
    // Mock driver data
    const driverData = {
        id: "driver123",
        name: "Alex Driver",
        role: "driver"
    };

    const renderDeliveries = () => (
        <div className="section-box">
            <h3>My Deliveries</h3>
            <ul>
                <li>Order #12345 – Pending Pickup</li>
                <li>Order #12321 – In Transit</li>
            </ul>
        </div>
    );

    const renderChat = () => (
        <div className="section-box chat-section">
            <h3>Chat with Manager</h3>
            <ChatBox 
                roomId="driver-manager-ORD101"
                senderId={driverData.id}
                senderRole="driver"
                receiverRole="manager"
                quickReplyType="driverToManager"
                receiverName="Delivery Manager"
                receiverAvatar="https://ui-avatars.com/api/?name=Delivery+Manager&background=0a3977&color=fff&size=32"
            />
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case "deliveries":
                return renderDeliveries();
            case "chat":
                return renderChat();
            // case "history":
            //     return renderHistory();
            // case "info":
            //     return renderInfo();
            default:
                return (
                    <div className="section-box">
                        <p>Select a section from the left.</p>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-cards">
                <div className="dashboard-card" onClick={() => setActiveSection("deliveries")}>
                    <PackageCheck size={32} color="#7B4EF7" />
                    <p>My Deliveries</p>
                </div>
                <div className="dashboard-card" onClick={() => setActiveSection("chat")}>
                    <MessagesSquare size={32} color="#7B4EF7" />
                    <p>Chat</p>
                </div>
                <div className="dashboard-card" onClick={() => setActiveSection("history")}>
                    <Clock size={32} color="#7B4EF7" />
                    <p>History</p>
                </div>
                <div className="dashboard-card" onClick={() => setActiveSection("info")}>
                    <User2 size={32} color="#7B4EF7" />
                    <p>My Info</p>
                </div>
            </div>
            {renderContent()}
        </div>
    );
};

export default DriverDashboard; 