import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { getChatHistory, sendMessage, subscribeToMessages } from '../lib/supabaseClient';

const Chat = ({ roomId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!roomId) return;

        const loadMessages = async () => {
            setLoading(true);
            const { data, error } = await getChatHistory(roomId);
            if (error) {
                setError(error.message);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
        };

        loadMessages();

        const unsubscribe = subscribeToMessages(roomId, (newMessage) => {
            setMessages(prev => [newMessage, ...prev]);
        });

        return () => {
            unsubscribe();
        };
    }, [roomId]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !roomId) return;

        const { error } = await sendMessage({
            roomId,
            senderId: currentUserId,
            content: messageInput
        });

        if (error) {
            setError(error.message);
        } else {
            setMessageInput('');
        }
    };

    if (loading) {
        return <Box sx={{ p: 2 }}>Loading messages...</Box>;
    }

    if (error) {
        return <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>;
    }

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', p: 2 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Chat Room {roomId}
                </Typography>
                <Box sx={{ height: 400, overflow: 'auto', mb: 2 }}>
                    <List>
                        {messages.map((msg) => (
                            <ListItem key={msg.id}>
                                <ListItemText
                                    primary={msg.content}
                                    secondary={`From: ${msg.sender_id}`}
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
                        placeholder="Type a message"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        sx={{ minWidth: '100px' }}
                    >
                        Send
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Chat;
