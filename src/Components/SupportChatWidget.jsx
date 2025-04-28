// src/Components/SupportChatWidget.jsx
import React, { useState } from "react";
import ChatBox from "./ChatBox";
import { MessageCircle } from "lucide-react";
import "../Styles/SupportChat.css";

const SupportChatWidget = ({ roomId, senderId, senderRole, receiverId, receiverRole, quickReplyType }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="support-chat-button" onClick={() => setIsOpen(!isOpen)}>
                <MessageCircle size={28} />
            </div>

            {isOpen && (
                <div className="support-chat-popup">
                    <ChatBox
                        roomId={roomId}
                        senderId={senderId}
                        senderRole={senderRole}
                        receiverRole={receiverRole}
                        quickReplyType={quickReplyType}
                    />
                </div>
            )}
        </>
    );
};

export default SupportChatWidget;
