import WebSocket, { Server } from 'ws';
import { handleWebSocketConnection } from './sockethandler';

const PORT = 6010;
const wss = new Server({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
    handleWebSocketConnection(ws);
});

console.log(`Server: Attendance Module may have started on Port:${PORT}`);
