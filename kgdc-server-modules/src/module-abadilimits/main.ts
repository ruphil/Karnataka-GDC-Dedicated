import WebSocket, { Server } from 'ws';
import { handleWebSocketConnection } from './sockethandler';

const PORT = 3030;
const wss = new Server({ port: PORT });

wss.on('connection', (ws: WebSocket, roles: any) => {
    handleWebSocketConnection(ws);
});

console.log(`Server: Abadi Limits Module may have started on Port:${PORT}`);
