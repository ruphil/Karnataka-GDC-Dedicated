import WebSocket, { Server } from 'ws';
import { handleWebSocketConnection } from './sockethandler';

const PORT = 4020;
const wss = new Server({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
    handleWebSocketConnection(ws);
});

console.log(`Server: Fileslist Module may have started on Port:${PORT}`);
