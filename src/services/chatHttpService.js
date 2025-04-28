const API_BASE_URL = 'http://localhost:8080/api/chat';

const chatHttpService = {
    // Message operations
    sendMessage: async (message) => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message)
            });
            if (!response.ok) throw new Error('Failed to send message');
            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    getMessages: async (roomId, page = 0, size = 20) => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${roomId}?page=${page}&size=${size}`);
            if (!response.ok) throw new Error('Failed to fetch messages');
            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    markMessageDelivered: async (messageId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${messageId}/delivered`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to mark message as delivered');
        } catch (error) {
            console.error('Error marking message as delivered:', error);
            throw error;
        }
    },

    markMessageRead: async (messageId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to mark message as read');
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    },

    // Room operations
    createRoom: async (roomData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData)
            });
            if (!response.ok) throw new Error('Failed to create room');
            return await response.json();
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    },

    getUserRooms: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user rooms');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user rooms:', error);
            throw error;
        }
    },

    closeRoom: async (roomId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/close`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to close room');
        } catch (error) {
            console.error('Error closing room:', error);
            throw error;
        }
    },

    // Presence management
    markUserOnline: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/presence/${userId}/online`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to mark user as online');
        } catch (error) {
            console.error('Error marking user as online:', error);
            throw error;
        }
    },

    markUserOffline: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/presence/${userId}/offline`, {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to mark user as offline');
        } catch (error) {
            console.error('Error marking user as offline:', error);
            throw error;
        }
    }
};

export default chatHttpService; 