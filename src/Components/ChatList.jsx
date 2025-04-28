import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Paper,
    Typography,
    Box,
    Avatar,
    Badge
} from '@mui/material';
import { getChatRooms, getUserPresence } from '../lib/supabaseClient';

const ChatList = ({ onSelectRoom, unreadCounts = {} }) => {
    // Hardcoded mock chat rooms for testing
    const [rooms] = useState([
        // Driver chats
        {
            id: 'driver-manager-ORD101',
            type: 'driver-manager',
            participant1Id: 'manager-1',
            participant2Id: 'Alex',
            last_message: 'Order delivered. Thank you!'
        },
        {
            id: 'driver-manager-ORD102',
            type: 'driver-manager',
            participant1Id: 'manager-1',
            participant2Id: 'Spoorti',
            last_message: 'On my way to the customer.'
        },
        // Customer chats
        {
            id: 'customer-ORD201',
            type: 'customer',
            customerName: 'Priya Sharma',
            orderId: 'ORD201',
            orderStatus: 'In Progress',
            driverAssigned: 'Alex',
            expectedDelivery: '2025-04-29 15:00',
            last_message: 'When will my order arrive?'
        },
        {
            id: 'customer-ORD202',
            type: 'customer',
            customerName: 'Rahul Mehta',
            orderId: 'ORD202',
            orderStatus: 'Pending',
            driverAssigned: 'Spoorti',
            expectedDelivery: '2025-04-29 17:00',
            last_message: 'Can I change my delivery address?'
        }
    ]);
    const [onlineStatus] = useState({ Alex: true, Spoorti: false, Support: true });
    const currentUserId = 'manager-1';

    useEffect(() => {
        // Fetch online status for each participant
        const fetchPresence = async () => {
            const statusMap = {};
            for (const room of rooms) {
                const other = getOtherParticipant(room);
                try {
                    const presence = await getUserPresence(other);
                    statusMap[other] = presence?.online;
                } catch {
                    statusMap[other] = false;
                }
            }
            // Update onlineStatus state
            // Note: This is a placeholder. In a real application, you would update the onlineStatus state
            // based on the result of getUserPresence calls.
        };
        if (rooms.length > 0) fetchPresence();
    }, [rooms]);

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
            <List>
                {/* Group Chat entry for manager */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => onSelectRoom({ id: 'manager-group', type: 'manager-group', participants: ['Alex', 'Spoorti'] })}>
                        <ListItemText primary="Group Chat (All Drivers)" secondary="Alex, Spoorti" />
                    </ListItemButton>
                </ListItem>
                {/* Driver chats */}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: '#0a3977', fontWeight: 700 }}>Driver Chats</Typography>
                {rooms.filter(room => room.type === 'driver-manager').map((room) => {
                    const other = getOtherParticipant(room);
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(other)}&background=0a3977&color=fff&size=64`;
                    const lastMessage = room.last_message || '';
                    const hasUnread = unreadCounts[room.id] && unreadCounts[room.id] > 0;
                    return (
                        <ListItem key={room.id} disablePadding>
                            <ListItemButton onClick={() => onSelectRoom(room)}>
                                <Badge
                                    color={onlineStatus[other] ? 'success' : 'default'}
                                    variant="dot"
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                >
                                    <Avatar src={avatarUrl} sx={{ width: 28, height: 28, mr: 1 }}>{other.charAt(0)}</Avatar>
                                </Badge>
                                <ListItemText
                                    primary={<span style={{ fontWeight: hasUnread ? 700 : 400 }}>{`Chat with ${other}`}{hasUnread && <span style={{ color: '#2a72d4', marginLeft: 6, fontSize: 14 }}>•</span>}</span>}
                                    secondary={lastMessage || room.type}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                {/* Customer chats */}
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: '#0a3977', fontWeight: 700 }}>Customer Chats</Typography>
                {rooms.filter(room => room.type === 'customer').map((room) => {
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(room.customerName)}&background=0a3977&color=fff&size=64`;
                    const hasUnread = unreadCounts[room.id] && unreadCounts[room.id] > 0;
                    return (
                        <ListItem key={room.id} disablePadding>
                            <ListItemButton onClick={() => onSelectRoom(room)}>
                                <Avatar src={avatarUrl} sx={{ width: 28, height: 28, mr: 1 }}>{room.customerName.charAt(0)}</Avatar>
                                <ListItemText
                                    primary={<span style={{ fontWeight: hasUnread ? 700 : 400 }}>{room.customerName}{hasUnread && <span style={{ color: '#2a72d4', marginLeft: 6, fontSize: 14 }}>•</span>}</span>}
                                    secondary={<>
                                        <span>Order: <b>{room.orderId}</b> ({room.orderStatus})<br /></span>
                                        <span>Driver: <b>{room.driverAssigned}</b><br /></span>
                                        <span>ETA: <b>{room.expectedDelivery}</b><br /></span>
                                        <span style={{ color: '#555' }}>{room.last_message}</span>
                                    </>}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};
export default ChatList;