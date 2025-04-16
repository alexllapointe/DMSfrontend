import React, { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import socket from '../socket';
import '../Styles/ChatInterface.css';

const ChatInterface = ({ managerId, driverId, driverName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch chat history when component mounts
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`/api/chat/history/${managerId}/${driverId}`);
        if (!response.ok) throw new Error('Failed to fetch chat history');
        const data = await response.json();
        setMessages(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load chat history');
        setIsLoading(false);
      }
    };

    fetchChatHistory();
    scrollToBottom();

    // Set up socket listeners
    socket.on('connect', () => {
      console.log('Connected to socket server');
      // Join the specific chat room
      socket.emit('join-chat', { managerId, driverId });
    });

    socket.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Cleanup on unmount
    return () => {
      socket.off('receive-message');
      socket.emit('leave-chat', { managerId, driverId });
    };
  }, [managerId, driverId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: managerId,
      receiverId: driverId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      senderType: 'manager'
    };

    try {
      // Send message through socket
      socket.emit('send-message', messageData);

      // Optimistically add message to UI
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      scrollToBottom();

      // Save message to backend
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error('Failed to save message');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (isLoading) return <div className="chat-loading">Loading chat history...</div>;
  if (error) return <div className="chat-error">{error}</div>;

  return (
    <div className="chat-interface" ref={chatContainerRef}>
      <div className="chat-header">
        <h3>Chat with {driverName}</h3>
        <button className="close-chat" onClick={() => window.location.href = '/manager-dashboard'}>
          <X size={20} />
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.senderType === 'manager' ? 'sent' : 'received'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
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
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface; 