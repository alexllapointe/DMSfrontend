import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import '../Styles/ChatWithDriver.css';

const ChatWithDriver = ({ driverId, managerId, orderDetails, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  const roomId = `${managerId}_${driverId}`;

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    // Join chat room
    socketRef.current.emit('joinRoom', { roomId, managerId, driverId });

    // Listen for incoming messages
    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/messages/${roomId}`);
        setMessages(response.data);
      } catch (err) {
        setError('Failed to load chat history');
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, managerId, driverId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: managerId,
      receiverId: driverId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      roomId,
      orderDetails
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
    <div className="chat-with-driver">
      <div className="chat-header">
        <div className="chat-header-info">
          <h3>Chat with Driver</h3>
          {orderDetails && (
            <span className="order-info">
              Order #{orderDetails.orderId}
            </span>
          )}
        </div>
        <button className="close-chat" onClick={onClose}>
          <X size={20} />
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
                message.senderId === managerId ? 'sent' : 'received'
              }`}
            >
              <div className="message-content">{message.message}</div>
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
  );
};

export default ChatWithDriver; 