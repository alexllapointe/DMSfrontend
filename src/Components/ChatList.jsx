import React, { useState, useEffect } from 'react';
import { 
    List, 
    ListItem, 
    ListItemText, 
    ListItemButton, 
    Paper, 
    Typography, 
    Box 
} from '@mui/material';
import { getChatRooms } from '../lib/supabaseClient';

const ChatList = ({ onSelectRoom }) => {
    const [rooms, setRooms] = useState([]);
    const currentUserId = '1'; // Should come from your auth system

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data, error } = await getChatRooms(currentUserId);
            if (error) throw error;
            setRooms(data || []);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const getOtherParticipant = (room) => {
        return room.participant1Id === currentUserId 
            ? room.participant2Id 
            : room.participant1Id;
    };

    return (
        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Chat Rooms
            </Typography>
            {rooms.length === 0 ? (
                <Box sx={{ p: 2 }}>
                    <Typography color="text.secondary">
                        No active chat rooms
                    </Typography>
                </Box>
            ) : (
                <List>
                    {rooms.map((room) => (
                        <ListItem key={room.id} disablePadding>
                            <ListItemButton onClick={() => onSelectRoom(room)}>
                                <ListItemText
                                    primary={`Chat with ${getOtherParticipant(room)}`}
                                    secondary={room.type}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};
export default ChatList;