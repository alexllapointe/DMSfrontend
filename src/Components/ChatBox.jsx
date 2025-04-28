import React, { useState, useEffect } from 'react';
import '../Styles/ChatBox.css';
import { getChatHistory, sendMessage, subscribeToMessages } from '../lib/supabaseClient';

const quickReplies = {
  managerToDriver: [
    'Order assigned. Please confirm.',
    'Update on delivery status?',
    'Customer not available?',
    'Contact customer if needed.'
  ],
  driverToManager: [
    'Order picked up.',
    'Order delivered.',
    'Customer not available.',
    'Delay due to traffic.'
  ],
  managerToCustomer: [
    'Your order is assigned to a driver.',
    'Order is on the way!',
    'Contact us for any queries.'
  ]
};

const ChatBox = ({ roomId, senderId, senderRole, receiverRole, quickReplyType }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    const loadMessages = async () => {
      setLoading(true);
      const { data, error } = await getChatHistory(roomId);
      if (error) setError(error.message);
      else setMessages(data || []);
      setLoading(false);
    };
    loadMessages();
    const unsubscribe = subscribeToMessages(roomId, (newMessage) => {
      setMessages(prev => [newMessage, ...prev]);
    });
    return () => unsubscribe();
  }, [roomId]);

  const handleSendMessage = async (msg) => {
    const content = msg || messageInput;
    if (!content.trim() || !roomId) return;
    const { error } = await sendMessage({ roomId, senderId, content });
    if (error) setError(error.message);
    else setMessageInput('');
  };

  return (
    <div className="chat-box">
      <h4>Chat</h4>
      <div className="chat-messages">
        {loading ? (
          <div>Loading messages...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={msg.sender_id === senderId ? 'msg-sent' : 'msg-received'}
            >
              <div className="message-bubble">
                {msg.content}
                <div className="timestamp">{new Date(msg.created_at || msg.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          placeholder="Type a message"
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={() => handleSendMessage()}>Send</button>
      </div>
      {quickReplyType && quickReplies[quickReplyType] && (
        <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {quickReplies[quickReplyType].map((qr, idx) => (
            <button
              key={idx}
              style={{ background: '#e6f0ff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}
              onClick={() => handleSendMessage(qr)}
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