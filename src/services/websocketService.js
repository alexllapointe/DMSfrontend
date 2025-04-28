import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.connected = false;
        this.messageHandlers = new Set();
        this.typingHandlers = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
        this.reconnectDelay = 2000;
    }

    connect(userId) {
        return new Promise((resolve, reject) => {
            try {
                const socket = new SockJS('http://localhost:8080/ws');
                this.stompClient = Stomp.over(socket);
                
                this.stompClient.connect(
                    {},
                    () => {
                        this.connected = true;
                        this.reconnectAttempts = 0;
                        console.log('WebSocket Connected');
                        this.subscribeToUserQueue(userId);
                        resolve();
                    },
                    (error) => {
                        console.error('WebSocket connection error:', error);
                        this.connected = false;
                        this.handleConnectionError(userId, reject);
                    }
                );
            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                this.connected = false;
                reject(error);
            }
        });
    }

    handleConnectionError(userId, reject) {
        this.connected = false;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => {
                this.connect(userId).catch(reject);
            }, this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
            reject(new Error('Failed to establish WebSocket connection after multiple attempts'));
        }
    }

    disconnect() {
        if (this.stompClient && this.connected) {
            this.stompClient.disconnect();
            this.connected = false;
            this.messageHandlers.clear();
            this.typingHandlers.clear();
        }
    }

    subscribeToUserQueue(userId) {
        if (!this.connected) {
            throw new Error('WebSocket not connected');
        }

        // Subscribe to user-specific queue
        this.stompClient.subscribe(`/user/${userId}/queue/messages`, (message) => {
            const messageData = JSON.parse(message.body);
            this.messageHandlers.forEach(handler => handler(messageData));
        });

        // Subscribe to typing notifications
        this.stompClient.subscribe(`/user/${userId}/queue/typing`, (message) => {
            const [senderId, status] = message.body.split(':');
            this.typingHandlers.forEach(handler => handler(senderId, status === 'typing'));
        });
    }

    joinRoom(roomId, userId) {
        if (!this.connected) {
            throw new Error('WebSocket not connected');
        }
        this.stompClient.send('/app/chat.join', {}, JSON.stringify({ roomId, userId }));
    }

    leaveRoom(roomId) {
        if (this.connected) {
            this.stompClient.send('/app/chat.leave', {}, roomId);
        }
    }

    sendMessage(roomId, message) {
        if (!this.connected) {
            throw new Error('WebSocket not connected');
        }
        this.stompClient.send('/app/chat.send', {}, JSON.stringify(message));
    }

    sendTypingStatus(roomId, userId, isTyping) {
        if (!this.connected) {
            throw new Error('WebSocket not connected');
        }
        this.stompClient.send('/app/chat.typing', {}, `${userId}:${roomId}:${isTyping ? 'typing' : 'stopped'}`);
    }

    onMessage(handler) {
        this.messageHandlers.add(handler);
    }

    onTypingStatus(handler) {
        this.typingHandlers.add(handler);
    }

    removeMessageHandler(handler) {
        this.messageHandlers.delete(handler);
    }

    removeTypingHandler(handler) {
        this.typingHandlers.delete(handler);
    }
}

export default new WebSocketService(); 