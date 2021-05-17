import WebSocket, { Server } from 'ws';
import http from 'http';
import express from 'express';

import { handleWebSocketConnection } from './handlersocket';

const app: express.Application = express();
app.get('*', function(req, res) {
    res.send('Message from HTTP Server: DSP Socket Server Running Fine!');
});

const server: http.Server = http.createServer(app);
const wss: Server = new Server({ server });
wss.on('connection', (ws: WebSocket) => {
    handleWebSocketConnection(ws);
});

const PORT = 4010;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});