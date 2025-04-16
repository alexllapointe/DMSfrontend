import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  AttachFile, 
  Close, 
  Person, 
  LocalShipping, 
  CheckCircle, 
  Schedule, 
  Error 
} from '@mui/icons-material';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Divider, 
  Badge, 
  CircularProgress, 
  Chip,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import io from 'socket.io-client';
import axios from 'axios';

// Styled components for USPS styling
const USPSBlue = '#004B87';
const USPSLightBlue = '#0077CC';
const USPSGray = '#333333';
const USPSLightGray = '#F5F5F5';
const USPSBorder = '#D1D1D1';

const MessagingPanel = styled(Paper)(({ theme }) => ({
  display: 'flex',
  height: '600px',
  maxWidth: '1000px',
  margin: '20px auto',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  border: `1px solid ${USPSBorder}`,
}));

const CustomerList = styled(Box)(({ theme }) => ({
  width: '300px',
  borderRight: `1px solid ${USPSBorder}`,
  backgroundColor: USPSLightGray,
  overflowY: 'auto',
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#ffffff',
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: '16px',
  backgroundColor: USPSBlue,
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const OrderInfo = styled(Box)(({ theme }) => ({
  padding: '12px 16px',
  backgroundColor: USPSLightGray,
  borderBottom: `1px solid ${USPSBorder}`,
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '16px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}));

const MessageBubble = styled(Box)(({ theme, sent }) => ({
  maxWidth: '70%',
  padding: '10px 16px',
  borderRadius: '12px',
  fontSize: '14px',
  lineHeight: 1.4,
  alignSelf: sent ? 'flex-end' : 'flex-start',
  backgroundColor: sent ? USPSBlue : 'white',
  color: sent ? 'white' : USPSGray,
  border: sent ? 'none' : `1px solid ${USPSBorder}`,
  borderBottomRightRadius: sent ? '4px' : '12px',
  borderBottomLeftRadius: sent ? '12px' : '4px',
}));

const MessageTime = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  opacity: 0.7,
  textAlign: 'right',
  marginTop: '4px',
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderTop: `1px solid ${USPSBorder}`,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '20px',
    '& fieldset': {
      borderColor: USPSBorder,
    },
    '&:hover fieldset': {
      borderColor: USPSLightBlue,
    },
    '&.Mui-focused fieldset': {
      borderColor: USPSBlue,
    },
  },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: USPSBlue,
  color: 'white',
  '&:hover': {
    backgroundColor: USPSLightBlue,
  },
}));

const AttachButton = styled(IconButton)(({ theme }) => ({
  color: USPSGray,
  '&:hover': {
    color: USPSBlue,
  },
}));

const CustomerMessagingPanel = ({ managerId }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    // Join manager room
    socketRef.current.emit('joinManagerRoom', { managerId });

    // Listen for incoming customer messages
    socketRef.current.on('customerToManager', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      
      // Update unread count if not viewing this customer's chat
      if (!selectedCustomer || selectedCustomer.id !== message.senderId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1
        }));
      }
    });

    // Fetch customers with active orders
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/customers/active');
        setCustomers(response.data);
      } catch (err) {
        setError('Failed to load customers');
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();

    return () => {
      socketRef.current.disconnect();
    };
  }, [managerId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Fetch chat history when selecting a customer
    const fetchChatHistory = async () => {
      if (!selectedCustomer) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/manager/messages/${selectedCustomer.id}`);
        setMessages(response.data);
        // Reset unread count for this customer
        setUnreadCounts((prev) => ({
          ...prev,
          [selectedCustomer.id]: 0
        }));
      } catch (err) {
        setError('Failed to load chat history');
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [selectedCustomer]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCustomer) return;

    const messageData = {
      senderId: managerId,
      receiverId: selectedCustomer.id,
      message: newMessage,
      timestamp: new Date().toISOString(),
      roomId: `manager_customer_${selectedCustomer.id}`,
      orderId: selectedCustomer.activeOrder?.id
    };

    try {
      // Emit message through socket
      socketRef.current.emit('managerToCustomer', messageData);

      // Save message to backend
      await axios.post('/api/manager/messages', messageData);

      // Update local state
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file.name);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle fontSize="small" color="success" />;
      case 'in_transit':
        return <LocalShipping fontSize="small" color="primary" />;
      case 'scheduled':
        return <Schedule fontSize="small" color="action" />;
      case 'delayed':
        return <Error fontSize="small" color="error" />;
      default:
        return <Schedule fontSize="small" color="action" />;
    }
  };

  return (
    <MessagingPanel elevation={3}>
      <CustomerList>
        <Box sx={{ p: 2, backgroundColor: USPSBlue, color: 'white' }}>
          <Typography variant="h6">Active Customers</Typography>
        </Box>
        <List>
          {loading && !selectedCustomer ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error && !selectedCustomer ? (
            <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
          ) : customers.length === 0 ? (
            <Typography sx={{ p: 2 }}>No active customers</Typography>
          ) : (
            customers.map((customer) => (
              <React.Fragment key={customer.id}>
                <ListItem 
                  button 
                  selected={selectedCustomer?.id === customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: USPSBlue }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={customer.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" component="span">
                          Order #{customer.activeOrder?.id}
                        </Typography>
                        <Chip 
                          size="small" 
                          icon={getStatusIcon(customer.activeOrder?.status)}
                          label={customer.activeOrder?.status}
                          sx={{ 
                            height: '20px', 
                            fontSize: '0.7rem',
                            backgroundColor: customer.activeOrder?.status === 'delivered' ? '#e8f5e9' : 
                                           customer.activeOrder?.status === 'in_transit' ? '#e3f2fd' :
                                           customer.activeOrder?.status === 'delayed' ? '#ffebee' : '#f5f5f5'
                          }}
                        />
                      </Box>
                    }
                  />
                  {unreadCounts[customer.id] > 0 && (
                    <Badge badgeContent={unreadCounts[customer.id]} color="error" />
                  )}
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </CustomerList>

      <ChatArea>
        {selectedCustomer ? (
          <>
            <ChatHeader>
              <Box>
                <Typography variant="h6">{selectedCustomer.name}</Typography>
                <Typography variant="body2">Customer ID: {selectedCustomer.id}</Typography>
              </Box>
              <IconButton 
                color="inherit" 
                onClick={() => setSelectedCustomer(null)}
              >
                <Close />
              </IconButton>
            </ChatHeader>

            {selectedCustomer.activeOrder && (
              <OrderInfo>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">
                    Order #{selectedCustomer.activeOrder.id}
                  </Typography>
                  <Chip 
                    icon={getStatusIcon(selectedCustomer.activeOrder.status)}
                    label={selectedCustomer.activeOrder.status}
                    color={
                      selectedCustomer.activeOrder.status === 'delivered' ? 'success' :
                      selectedCustomer.activeOrder.status === 'in_transit' ? 'primary' :
                      selectedCustomer.activeOrder.status === 'delayed' ? 'error' : 'default'
                    }
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Product: {selectedCustomer.activeOrder.product}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Typography variant="body2">
                    Pickup: {selectedCustomer.activeOrder.pickup}
                  </Typography>
                  <Typography variant="body2">
                    Dropoff: {selectedCustomer.activeOrder.dropoff}
                  </Typography>
                </Box>
              </OrderInfo>
            )}

            <MessagesContainer>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : error ? (
                <Typography color="error" sx={{ p: 2 }}>{error}</Typography>
              ) : messages.length === 0 ? (
                <Typography sx={{ p: 2, textAlign: 'center' }}>
                  No messages yet. Start a conversation!
                </Typography>
              ) : (
                messages.map((message, index) => (
                  <MessageBubble 
                    key={index} 
                    sent={message.senderId === managerId}
                  >
                    <Typography variant="body1">{message.message}</Typography>
                    <MessageTime variant="caption">
                      {formatTimestamp(message.timestamp)}
                    </MessageTime>
                  </MessageBubble>
                ))
              )}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <Box component="form" onSubmit={handleSendMessage}>
              <InputArea>
                <AttachButton onClick={handleFileAttach}>
                  <AttachFile />
                </AttachButton>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                />
                <StyledTextField
                  fullWidth
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Tooltip title="Send message">
                  <SendButton type="submit">
                    <Send />
                  </SendButton>
                </Tooltip>
              </InputArea>
            </Box>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            p: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Select a customer to start messaging
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Choose a customer from the list to view their chat history and send messages
            </Typography>
          </Box>
        )}
      </ChatArea>
    </MessagingPanel>
  );
};

export default CustomerMessagingPanel; 