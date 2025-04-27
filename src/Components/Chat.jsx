import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Box, TextField, Button, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);
    const roomId = '123'; // For testing, we'll use a hardcoded room ID

    useEffect(() => {
        // Connect to WebSocket
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            onConnect: () => {
                console.log('Connected to WebSocket');
                setConnected(true);
                
                // Subscribe to the chat room
                client.subscribe(`/topic/chat/${roomId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages(prev => [...prev, receivedMessage]);
                });
            },
            onDisconnect: () => {
                console.log('Disconnected from WebSocket');
                setConnected(false);
            },
            onError: (error) => {
                console.error('WebSocket Error:', error);
                setConnected(false);
            }
        });

        clientRef.current = client;
        client.activate();

        // Load chat history
        fetchChatHistory();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, []);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/rooms/${roomId}/messages`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.content || []);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const sendMessage = () => {
        if (!messageInput.trim() || !connected) return;

        const message = {
            roomId,
            content: messageInput,
            attachmentUrl: null,
            attachmentType: null
        };

        clientRef.current.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(message)
        });

        setMessageInput('');
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Chat Room {roomId}
                </Typography>
                <Box sx={{ height: 400, overflow: 'auto', mb: 2 }}>
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={msg.content}
                                    secondary={`From: ${msg.senderId}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button
                        variant="contained"
                        onClick={sendMessage}
                        disabled={!connected}
                    >
                        Send
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Chat;
