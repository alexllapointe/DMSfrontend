import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';
import '../Styles/CustomerChat.css';
import ChatBox from './ChatBox';

const CustomerChatInterface = ({ customerId, managerId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    // Join chat room
    socketRef.current.emit('join', { customerId, managerId });

    // Listen for incoming messages
    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/chat/history/${customerId}/${managerId}`);
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
  }, [customerId, managerId, isOpen]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: customerId,
      receiverId: managerId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      senderType: 'customer'
    };

    try {
      // Emit message through socket
      socketRef.current.emit('message', messageData);

      // Save message to backend
      await axios.post('/api/chat/message', messageData);

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
        className="customer-chat-button"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="customer-chat-interface">
          <div className="chat-header">
            <h3>Chat with Delivery Manager</h3>
            <button 
              className="close-chat"
              onClick={() => setIsOpen(false)}
            >
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
                    message.senderId === customerId ? 'sent' : 'received'
                  }`}
                >
                  {message.content}
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

export default CustomerChatInterface; 