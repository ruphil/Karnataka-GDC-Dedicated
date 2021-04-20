import WebSocket, { Server } from 'ws';
import { join } from 'path';
import http from 'http'
import express from 'express';

import { checkAdmin } from './handlesockets';

const app: express.Application = express();

const staticDir: string = join(__dirname, 'frontend');

app.use('/', express.static(staticDir));

app.get('/', function(req, res) {
    res.sendFile(join(staticDir, 'index.html'));
});

const server: http.Server = http.createServer(app);
const wss: Server = new Server({ server });

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        if (msgObj.requesttype ==)
        checkAdmin(ws, msgObj)
    });
});

const port = 3010;

server.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
});