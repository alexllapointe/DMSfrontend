import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map();
        this.messageHandlers = new Map();
        this.connected = false;
    }

    connect(userId, onConnect = () => {}) {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, () => {
            this.connected = true;
            console.log('WebSocket Connected');

            // Subscribe to personal messages
            this.subscribe(`/topic/user/${userId}`, (message) => {
                this.handleMessage(JSON.parse(message.body));
            });

            // Subscribe to presence updates
            this.subscribe('/topic/presence', (message) => {
                const [userId, status] = message.body.split(':');
                this.handlePresenceUpdate(userId, status);
            });

            onConnect();
        }, this.onError);

        // Reconnect on connection loss
        socket.onclose = () => {
            this.connected = false;
            console.log('WebSocket Connection Lost. Reconnecting...');
            setTimeout(() => this.connect(userId, onConnect), 5000);
        };
    }

    subscribe(destination, callback) {
        if (!this.stompClient) return;

        const subscription = this.stompClient.subscribe(destination, callback);
        this.subscriptions.set(destination, subscription);
        return () => this.unsubscribe(destination);
    }

    unsubscribe(destination) {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
        }
    }

    // Send a chat message
    sendMessage(roomId, message) {
        if (!this.stompClient || !this.connected) return;

        this.stompClient.send('/app/chat.send', {}, JSON.stringify({
            roomId,
            ...message
        }));
    }

    // Send typing status
    sendTypingStatus(roomId, userId, isTyping) {
        if (!this.stompClient || !this.connected) return;

        this.stompClient.send('/app/chat.typing', {}, 
            `${userId}:${roomId}:${isTyping ? 'typing' : 'stopped'}`
        );
    }

    // Join a chat room
    joinRoom(roomId, userId) {
        if (!this.stompClient || !this.connected) return;

        // Subscribe to room messages
        this.subscribe(`/topic/room/${roomId}`, (message) => {
            this.handleMessage(JSON.parse(message.body));
        });

        // Subscribe to typing indicators for this room
        this.subscribe(`/topic/room/${roomId}/typing`, (message) => {
            const [userId, status] = message.body.split(':');
            this.handleTypingStatus(roomId, userId, status === 'typing');
        });
    }

    // Leave a chat room
    leaveRoom(roomId) {
        this.unsubscribe(`/topic/room/${roomId}`);
        this.unsubscribe(`/topic/room/${roomId}/typing`);
    }

    // Register message handler
    onMessage(handler) {
        this.messageHandlers.set('message', handler);
    }

    // Register presence update handler
    onPresenceUpdate(handler) {
        this.messageHandlers.set('presence', handler);
    }

    // Register typing status handler
    onTypingStatus(handler) {
        this.messageHandlers.set('typing', handler);
    }

    // Internal message handler
    handleMessage(message) {
        const handler = this.messageHandlers.get('message');
        if (handler) handler(message);
    }

    // Internal presence update handler
    handlePresenceUpdate(userId, status) {
        const handler = this.messageHandlers.get('presence');
        if (handler) handler(userId, status);
    }

    // Internal typing status handler
    handleTypingStatus(roomId, userId, isTyping) {
        const handler = this.messageHandlers.get('typing');
        if (handler) handler(roomId, userId, isTyping);
    }

    // Handle connection errors
    onError(error) {
        console.error('WebSocket Error:', error);
        this.connected = false;
    }

    // Disconnect
    disconnect() {
        if (this.stompClient) {
            this.subscriptions.forEach(sub => sub.unsubscribe());
            this.subscriptions.clear();
            this.stompClient.disconnect();
            this.connected = false;
        }
    }
}

// Create a singleton instance
const websocketService = new WebSocketService();
export default websocketService; 