// client/src/socket.js or client/src/socket.ts
import { io } from 'socket.io-client';

// Initialize the socket connection
const socket = io('http://localhost:4000', { path: '/socket.io' });

// Listen for connection success
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

export default socket;