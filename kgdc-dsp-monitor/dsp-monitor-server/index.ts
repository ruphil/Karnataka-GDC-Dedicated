import { Server } from 'ws';
import { URL } from 'url';
import { join } from 'path';
import http from 'http'
import express from 'express';

const app: express.Application = express();

const staticDir: string = join(__dirname, 'frontend');
app.use('/', express.static(staticDir));
app.get('/', function(req, res) {
    res.sendFile(join(staticDir, 'index.html'));
});

const server: http.Server = http.createServer(app);
const wss: Server = new Server({ server });

wss.on('connection', (ws) => {
    if(ws.readyState){
        ws.send('Welcome To WS Chat Server');
    }

    ws.on('message', (data)=>{
        wss.clients.forEach((clientws) => {
            clientws.send(data);
        });
    });
});

const port = process.env.PORT || 8080;

server.listen(port, ()=> {
    console.log(`Server listening on port ${port}`);
});