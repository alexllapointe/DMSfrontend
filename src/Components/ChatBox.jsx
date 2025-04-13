// src/Components/ChatBox.jsx
import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import axios from "axios";
import "../Styles/ChatBox.css";

const ChatBox = ({ senderId, receiverId, senderRole, receiverRole }) => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const roomId = `${senderId}_${receiverId}`;

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        socket.emit("joinRoom", { roomId });

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/chat/history/${roomId}`);
                setMessages(res.data);
            } catch (err) {
                console.error("Failed to load chat history:", err);
            }
        };

        fetchMessages();
        return () => socket.off("receiveMessage");
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim() && !file) return;

        let fileUrl = null;

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const uploadRes = await axios.post("http://localhost:5000/upload", formData);
                fileUrl = uploadRes.data.filePath;
            } catch (err) {
                console.error("File upload failed", err);
            }
        }

        const msgObj = {
            roomId,
            sender: senderId,
            receiver: receiverId,
            message: message || (fileUrl ? "📎 File Sent" : ""),
            fileUrl,
        };

        socket.emit("sendMessage", msgObj);

        try {
            await axios.post("http://localhost:5000/api/chat/message", msgObj);
        } catch (err) {
            console.error("Failed to save message:", err);
        }

        setMessage("");
        setFile(null);
    };

    const handleFileClick = () => fileInputRef.current.click();
    const handleFileChange = (e) => setFile(e.target.files[0]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    return (
        <div className="chat-box">
            <h4>Chat with {receiverRole.charAt(0).toUpperCase() + receiverRole.slice(1)}</h4>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sender === senderId ? "msg-sent" : "msg-received"}
                    >
                        <div className="message-bubble">
                            {msg.message && <span>{msg.message}</span>}
                            {msg.fileUrl && (
                                <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noreferrer">
                                    📎 View Attachment
                                </a>
                            )}
                            <div className="timestamp">{formatTime(msg.timestamp)}</div>
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleFileClick}>📎</button>
                <button onClick={handleSend}>Send</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default ChatBox;
