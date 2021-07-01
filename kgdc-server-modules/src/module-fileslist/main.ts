import WebSocket, { Server } from 'ws';
import { handleWebSocketConnection } from './sockethandler';

const PORT = 3010;
const wss = new Server({ port: PORT });

wss.on('connection', (ws: WebSocket, roles: any) => {
    handleWebSocketConnection(ws);
});

console.log(`Server: Fileslist Module may have started on Port:${PORT}`);
