import React, { useState, useEffect, useRef } from 'react';
import { Send, Bell } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import '../Styles/DriverChat.css';

const DriverChat = ({ driverId, currentOrder }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  // Hardcoded manager ID - in production, this should come from environment variables
  const managerId = 'manager_001';
  const roomId = `driver_${driverId}_manager`;

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    // Join chat room
    socketRef.current.emit('joinRoom', { roomId, driverId, managerId });

    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/messages/${driverId}`);
        setMessages(response.data);
      } catch (err) {
        setError('Failed to load chat history');
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchChatHistory();
      setUnreadCount(0);
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [driverId, managerId, roomId, isOpen]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: driverId,
      receiverId: managerId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      roomId,
      orderDetails: currentOrder ? {
        orderId: currentOrder.id,
        pickup: currentOrder.pickup,
        dropoff: currentOrder.dropoff,
        status: currentOrder.status
      } : null
    };

    try {
      // Emit message through socket
      socketRef.current.emit('sendMessage', messageData);

      // Save message to backend
      await axios.post('/api/messages', messageData);

      // Update local state
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      <button 
        className="driver-chat-button"
        onClick={() => setIsOpen(true)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="driver-chat-interface">
          <div className="chat-header">
            <div className="chat-header-info">
              <h3>Chat with Manager</h3>
              {currentOrder && (
                <span className="order-info">
                  Order #{currentOrder.id}
                </span>
              )}
            </div>
            <button 
              className="close-chat"
              onClick={() => setIsOpen(false)}
            >
              <span>×</span>
            </button>
          </div>

          <div className="messages-container">
            {loading ? (
              <div className="chat-loading">Loading messages...</div>
            ) : error ? (
              <div className="chat-error">{error}</div>
            ) : messages.length === 0 ? (
              <div className="chat-loading">No messages yet</div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.senderId === driverId ? 'sent' : 'received'
                  }`}
                >
                  <div className="message-content">{message.message}</div>
                  {message.orderDetails && (
                    <div className="order-details">
                      <div>Order #{message.orderDetails.orderId}</div>
                      <div>Status: {message.orderDetails.status}</div>
                    </div>
                  )}
                  <div className="message-timestamp">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="message-input-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default DriverChat; 