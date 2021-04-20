import WebSocket, { Server } from 'ws';
import { join } from 'path';
import http from 'http'
import express from 'express';

import { handleWebSocketConnection } from './handlesockets';

const staticDir: string = join(__dirname, 'frontend');
const app: express.Application = express();
app.use('/', express.static(staticDir));
app.get('/', function(req, res) {
    res.sendFile(join(staticDir, 'index.html'));
});

const server: http.Server = http.createServer(app);
const wss: Server = new Server({ server });
wss.on('connection', (ws: WebSocket) => {
    handleWebSocketConnection(ws);
});

const PORT = 3010;
server.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`);
});