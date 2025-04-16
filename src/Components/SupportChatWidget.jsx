// src/Components/SupportChatWidget.jsx
import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import "../Styles/SupportChat.css";

const SupportChatWidget = ({ customerId, managerId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! How can I assist you today?",
            type: "received",
            timestamp: new Date(),
        }
    ]);

    const handleSendMessage = (e) => {
        e?.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: message,
            type: "sent",
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setMessage("");

        // Simulate received message
        setTimeout(() => {
            const receivedMessage = {
                id: messages.length + 2,
                text: "Thank you for your message. A customer service representative will respond shortly.",
                type: "received",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, receivedMessage]);
        }, 1000);
    };

    return (
        <>
            <div className="support-chat-button" onClick={() => setIsOpen(!isOpen)}>
                <MessageCircle size={28} color="white" />
            </div>

            {isOpen && (
                <div className="support-chat-popup">
                    <div className="chat-header">
                        <h3>Customer Support</h3>
                        <button className="chat-close-button" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.type}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <form className="chat-input-container" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="chat-send-button">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default SupportChatWidget;
