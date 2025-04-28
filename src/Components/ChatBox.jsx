import React, { useState, useEffect, useRef } from 'react';
import '../Styles/ChatBox.css';
import { X, Send } from 'lucide-react';
import websocketService from '../services/websocketService';
import chatHttpService from '../services/chatHttpService';

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
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [error, setError] = useState(null);
    const [typing, setTyping] = useState(false);
    const [isSomeoneTyping, setIsSomeoneTyping] = useState(false);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(true);
    const chatMessagesRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const pollIntervalRef = useRef(null);

    useEffect(() => {
        let wsConnected = false;
        
        // Try WebSocket connection
        try {
            if (!websocketService.connected) {
                websocketService.connect(senderId);
            }
            websocketService.joinRoom(roomId, senderId);
            wsConnected = true;
            setIsWebSocketConnected(true);
        } catch (err) {
            console.error('WebSocket connection failed:', err);
            setIsWebSocketConnected(false);
            wsConnected = false;
        }

        // Set up message handler for WebSocket
        if (wsConnected) {
            websocketService.onMessage((message) => {
                if (message.roomId === roomId) {
                    setMessages(prev => [...prev, message]);
                    if (message.senderId !== senderId) {
                        websocketService.sendMessage(roomId, {
                            messageId: message.id,
                            status: 'delivered'
                        });
                    }
                }
            });

            // Set up typing status handler
            websocketService.onTypingStatus((roomId, userId, isTyping) => {
                if (roomId === roomId && userId !== senderId) {
                    setIsSomeoneTyping(isTyping);
                }
            });
        }

        // Load initial messages
        loadMessages();

        // If WebSocket is not connected, set up polling
        if (!wsConnected) {
            pollIntervalRef.current = setInterval(loadMessages, 3000);
        }

        // Cleanup
        return () => {
            if (wsConnected) {
                websocketService.leaveRoom(roomId);
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [roomId, senderId]);

    const loadMessages = async () => {
        try {
            const data = await chatHttpService.getMessages(roomId);
            setMessages(data);
            setError(null);
        } catch (err) {
            setError('Failed to load messages');
            console.error('Error loading messages:', err);
        }
    };

    const handleSendMessage = async (msg) => {
        const content = msg || messageInput;
        if (!content.trim() || !roomId) return;

        const message = {
            senderId,
            senderRole,
            content,
            roomId,
            created_at: new Date().toISOString()
        };

        try {
            if (isWebSocketConnected) {
                websocketService.sendMessage(roomId, message);
            } else {
                await chatHttpService.sendMessage(message);
                // Immediately load messages to show the new message
                await loadMessages();
            }
            setMessageInput('');
            setTyping(false);
        } catch (err) {
            setError('Failed to send message');
            console.error('Error sending message:', err);
        }
    };

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
        if (!typing && isWebSocketConnected) {
            setTyping(true);
            websocketService.sendTypingStatus(roomId, senderId, true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (isWebSocketConnected) {
            typingTimeoutRef.current = setTimeout(() => {
                setTyping(false);
                websocketService.sendTypingStatus(roomId, senderId, false);
            }, 2000);
        }
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
                                className={msg.senderId === senderId ? 'msg-sent' : 'msg-received'}
                            >
                                <div className="message-bubble">
                                    {roomId === 'manager-group' && (
                                        <span style={{ fontWeight: 600, color: '#0a3977', marginRight: 6, fontSize: 13 }}>{msg.senderId}:</span>
                                    )}
                                    {msg.content}
                                    <div className="timestamp">
                                        {new Date(msg.created_at).toLocaleString()}
                                        {msg.senderId === senderId && (
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