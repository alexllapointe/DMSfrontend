import React, { useState, useEffect, useRef } from 'react';
import '../Styles/ChatBox.css';
import { getChatHistory, sendMessage, subscribeToMessages, markMessageDelivered, markMessageRead, sendTypingStatus } from '../lib/supabaseClient';
import { X, Send } from 'lucide-react';

const quickReplies = {
    managerToDriver: [
        'Order assigned. Please confirm.',
        'Update on delivery status?',
        'Customer not available?',
        'Contact customer if needed.',
        'Please share ETA.',
        'Is the customer location correct?'
    ],
    driverToManager: [
        'Order picked up and on the way',
        'Arrived at pickup location',
        'Arrived at delivery location',
        'Order delivered successfully',
        'Customer not available at location',
        'Facing traffic delay',
        'Need assistance with address',
        'Vehicle/technical issue',
        'ETA: 15 minutes',
        'ETA: 30 minutes'
    ],
    managerToCustomer: [
        'Your order is on the way! ETA: 3:00 PM.',
        'Your order was assigned to Alex.',
        'Please provide the new address and we will update it.',
        'Thank you for your patience!',
        'You can track your order in the app.',
        'Please rate your delivery experience.',
        'Expect delivery within 30 minutes.'
    ],
    managerGroup: [
        'Please update your delivery status.',
        'Anyone facing issues with deliveries?',
        'Share your current location.',
        'Remember to confirm order completion.',
        'Is anyone delayed?',
        'Let me know if you need help.'
    ]
};

const ChatBox = ({ roomId, senderId, senderRole, receiverRole, quickReplyType, onClose, receiverName, receiverAvatar }) => {
    // Show different mock messages for each room
    let initialMessages = [];
    if (roomId === 'driver-manager-ORD101') {
        initialMessages = [
            { id: 1, sender_id: 'manager456', content: 'New delivery assigned: Order #12345', created_at: new Date(Date.now() - 3600000).toISOString(), delivered: true, read: true },
            { id: 2, sender_id: 'driver123', content: 'Received. Heading to pickup location now.', created_at: new Date(Date.now() - 3300000).toISOString(), delivered: true, read: true },
            { id: 3, sender_id: 'manager456', content: 'Customer requested delivery before 5 PM', created_at: new Date(Date.now() - 3000000).toISOString(), delivered: true, read: true },
            { id: 4, sender_id: 'driver123', content: 'Will make it on time. Currently 15 minutes away.', created_at: new Date(Date.now() - 2700000).toISOString(), delivered: true, read: true },
            { id: 5, sender_id: 'manager456', content: 'Great! Keep me updated.', created_at: new Date(Date.now() - 2400000).toISOString(), delivered: true, read: false },
        ];
    } else if (roomId === 'driver-manager-ORD102') {
        initialMessages = [
            { id: 1, sender_id: senderId, content: 'Hi Spoorti, please update on your location.', created_at: new Date().toISOString(), delivered: true, read: true },
            { id: 2, sender_id: 'Spoorti', content: 'On my way to the customer.', created_at: new Date(Date.now() - 60000).toISOString(), delivered: true, read: true },
            { id: 3, sender_id: senderId, content: 'Please confirm pickup.', created_at: new Date(Date.now() - 120000).toISOString(), delivered: true, read: false },
        ];
    } else if (roomId === 'customer-ORD201') {
        initialMessages = [
            { id: 1, sender_id: 'Priya Sharma', content: 'When will my order arrive?', created_at: new Date().toISOString(), delivered: true, read: true },
            { id: 2, sender_id: senderId, content: 'Your order is on the way! ETA: 3:00 PM.', created_at: new Date(Date.now() - 60000).toISOString(), delivered: true, read: true },
            { id: 3, sender_id: senderId, content: 'Your order was assigned to Alex.', created_at: new Date(Date.now() - 120000).toISOString(), delivered: true, read: true },
        ];
    } else if (roomId === 'customer-ORD202') {
        initialMessages = [
            { id: 1, sender_id: 'Rahul Mehta', content: 'Can I change my delivery address?', created_at: new Date().toISOString(), delivered: true, read: true },
            { id: 2, sender_id: senderId, content: 'Please provide the new address and we will update it.', created_at: new Date(Date.now() - 60000).toISOString(), delivered: true, read: true },
            { id: 3, sender_id: senderId, content: 'Your order is pending and will be assigned soon.', created_at: new Date(Date.now() - 120000).toISOString(), delivered: true, read: true },
        ];
    } else if (roomId === 'customer-support') {
        initialMessages = [
            { id: 1, sender_id: senderId, content: 'Hello, I need help with an order.', created_at: new Date().toISOString(), delivered: true, read: true },
            { id: 2, sender_id: 'Support', content: 'How can I help you?', created_at: new Date(Date.now() - 60000).toISOString(), delivered: true, read: true },
        ];
    } else if (roomId === 'manager-group') {
        initialMessages = [
            { id: 1, sender_id: 'Alex', content: 'Order ORD101 delivered.', created_at: new Date(Date.now() - 120000).toISOString(), delivered: true, read: true },
            { id: 2, sender_id: 'Spoorti', content: 'On my way to the customer for ORD102.', created_at: new Date(Date.now() - 60000).toISOString(), delivered: true, read: true },
            { id: 3, sender_id: senderId, content: 'Please update your delivery status.', created_at: new Date().toISOString(), delivered: true, read: true },
        ];
    }
    const [messages, setMessages] = useState(initialMessages);
    const [messageInput, setMessageInput] = useState('');
    const [error, setError] = useState(null);
    const [typing, setTyping] = useState(false);
    const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);
    const chatMessagesRef = useRef(null);

    const handleSendMessage = async (msg) => {
        const content = msg || messageInput;
        if (!content.trim() || !roomId) return;
        // Add the new message to the chat at the end
        setMessages(prev => [
            ...prev,
            {
                id: prev.length + 1,
                sender_id: senderId,
                content,
                created_at: new Date().toISOString(),
                delivered: true,
                read: true
            }
        ]);
        setMessageInput('');
        setTyping(false);
    };

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
        setTyping(true);
        sendTypingStatus(roomId, senderId, true);
        setTimeout(() => {
            setTyping(false);
            sendTypingStatus(roomId, senderId, false);
        }, 2000);
    };

    const handleQuickReply = (qr) => {
        handleSendMessage(qr);
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-box">
            <div className="chat-header">
                {roomId === 'manager-group' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {['Alex', 'Spoorti'].map((name, idx) => (
                            <img key={name} src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0a3977&color=fff&size=32`} alt={name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', marginRight: 2, border: '2px solid #fff', zIndex: 10 - idx }} />
                        ))}
                        <span className="chat-title">Group Chat (All Drivers)</span>
                    </div>
                ) : receiverName ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {receiverAvatar && (
                            <img src={receiverAvatar} alt={receiverName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8 }} />
                        )}
                        <span className="chat-title">{receiverName}</span>
                    </div>
                ) : (
                    <span className="chat-title">Customer Support</span>
                )}
                <button className="chat-close" onClick={onClose}><X size={20} /></button>
            </div>
            <div className="chat-messages" ref={chatMessagesRef}>
                {error ? (
                    <div className="error">{error}</div>
                ) : (
                    <>
                        {isSomeoneTyping && <div className="typing-indicator">Someone is typing...</div>}
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={msg.sender_id === senderId ? 'msg-sent' : 'msg-received'}
                            >
                                <div className="message-bubble">
                                    {roomId === 'manager-group' && (
                                        <span style={{ fontWeight: 600, color: '#0a3977', marginRight: 6, fontSize: 13 }}>{msg.sender_id}:</span>
                                    )}
                                    {msg.content}
                                    <div className="timestamp">
                                        {new Date(msg.created_at || msg.timestamp).toLocaleString()}
                                        {msg.sender_id === senderId && (
                                            <>
                                                {msg.delivered && <span style={{ marginLeft: 8, color: '#2a72d4' }}>✓</span>}
                                                {msg.read && <span style={{ marginLeft: 2, color: 'green' }}>✓✓</span>}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="send-btn" onClick={() => handleSendMessage()}><Send size={20} /></button>
            </div>
            {(roomId === 'manager-group' && quickReplies.managerGroup) ? (
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {quickReplies.managerGroup.map((qr, idx) => (
                        <button
                            key={idx}
                            style={{ background: '#e6f0ff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}
                            onClick={() => handleQuickReply(qr)}
                        >
                            {qr}
                        </button>
                    ))}
                </div>
            ) : quickReplyType && quickReplies[quickReplyType] && (
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {quickReplies[quickReplyType].map((qr, idx) => (
                        <button
                            key={idx}
                            style={{ background: '#e6f0ff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}
                            onClick={() => handleQuickReply(qr)}
                        >
                            {qr}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatBox; 