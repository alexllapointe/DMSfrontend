import React, { useState, useEffect } from 'react';
import { MessagesSquare, Users } from 'lucide-react';
import ChatBox from './ChatBox';
import '../Styles/DriverChatWidget.css';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const DriverChatWidget = ({ driverData }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [chatRooms, setChatRooms] = useState([
        {
            id: 'driver-manager-ORD101',
            name: 'Delivery Manager',
            type: 'direct',
            unreadCount: 2,
            lastMessage: 'Great! Keep me updated.',
            avatar: "https://ui-avatars.com/api/?name=Delivery+Manager&background=0a3977&color=fff&size=32"
        },
        {
            id: 'manager-group',
            name: 'All Drivers Group',
            type: 'group',
            unreadCount: 1,
            lastMessage: 'Please update your delivery status.',
            isGroup: true
        }
    ]);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Connect to WebSocket
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            setStompClient(client);

            // Subscribe to personal messages
            client.subscribe(`/topic/user/${driverData.id}`, (message) => {
                handleNewMessage(JSON.parse(message.body));
            });

            // Subscribe to group messages
            client.subscribe('/topic/room/manager-group', (message) => {
                handleNewMessage(JSON.parse(message.body));
            });

            // Subscribe to message status updates
            client.subscribe(`/topic/status/${driverData.id}`, (status) => {
                handleMessageStatus(JSON.parse(status.body));
            });
        });

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, [driverData.id]);

    const handleNewMessage = (message) => {
        // Update chat rooms with new message
        setChatRooms(prevRooms => {
            return prevRooms.map(room => {
                if (room.id === message.roomId) {
                    return {
                        ...room,
                        lastMessage: message.content,
                        unreadCount: room.unreadCount + (message.senderId !== driverData.id ? 1 : 0)
                    };
                }
                return room;
            });
        });

        // If the message is for the currently selected room, mark it as read
        if (selectedRoom?.id === message.roomId) {
            markMessageRead(message.id);
        }
    };

    const handleMessageStatus = (status) => {
        // Update message status (delivered/read)
        if (selectedRoom?.id === status.roomId) {
            // Update the message status in the chat
            // This will be handled by the ChatBox component
        }
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        // Reset unread count for the selected room
        setChatRooms(prevRooms => {
            return prevRooms.map(r => {
                if (r.id === room.id) {
                    return { ...r, unreadCount: 0 };
                }
                return r;
            });
        });
    };

    const markMessageRead = async (messageId) => {
        try {
            await fetch(`http://localhost:8080/api/chat/messages/${messageId}/read`, {
                method: 'POST'
            });
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    };

    return (
        <div className="driver-chat-widget">
            <div className="chat-rooms-list">
                <h3>Chat Rooms</h3>
                {chatRooms.map((room) => (
                    <div 
                        key={room.id}
                        className={`chat-room-item ${selectedRoom?.id === room.id ? 'active' : ''}`}
                        onClick={() => handleRoomSelect(room)}
                    >
                        <div className="room-icon">
                            {room.isGroup ? (
                                <Users size={24} color="#7B4EF7" />
                            ) : (
                                <img 
                                    src={room.avatar} 
                                    alt={room.name}
                                    className="room-avatar"
                                />
                            )}
                        </div>
                        <div className="room-info">
                            <div className="room-name">{room.name}</div>
                            <div className="room-last-message">{room.lastMessage}</div>
                        </div>
                        {room.unreadCount > 0 && (
                            <div className="unread-count">{room.unreadCount}</div>
                        )}
                    </div>
                ))}
            </div>
            
            {selectedRoom && (
                <div className="active-chat">
                    <ChatBox 
                        roomId={selectedRoom.id}
                        senderId={driverData.id}
                        senderRole="driver"
                        receiverRole={selectedRoom.isGroup ? "group" : "manager"}
                        quickReplyType="driverToManager"
                        receiverName={selectedRoom.name}
                        receiverAvatar={selectedRoom.avatar}
                        onClose={() => setSelectedRoom(null)}
                        stompClient={stompClient}
                    />
                </div>
            )}
        </div>
    );
};

export default DriverChatWidget; 