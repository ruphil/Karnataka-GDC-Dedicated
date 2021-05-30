import http from 'http';
import express from 'express';
import WebSocket, { Server } from 'ws';
import { checkuser } from './authenticator';
import { handleWebSocketConnection } from './sockethandler';

const app = express();
const server = new http.Server(app);

const staticAuthentication = (req: any, res: any, next: any) => {
    let searchParams = new URLSearchParams(req._parsedUrl.search)

    checkuser(searchParams)
    .then(() => {
        next();
    })
    .catch(() => {
        res.status(401).end();
    })
}

app.use('/files', [ staticAuthentication, express.static('static') ]);

app.get('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('WS Servers Running Fine!');
    res.end();
});

const wsserver = new Server({ noServer: true });
wsserver.on('connection', (ws: WebSocket, request: any) => {
    handleWebSocketConnection(ws);
});

server.on('upgrade', (request, socket, head) => {
    const reqUrl = new URL(request.url, request.headers.origin);
    const searchParams = reqUrl.searchParams;
    // console.log(searchParams, reqUrl);

    checkuser(searchParams)
    .then(() => {
        wsserver.handleUpgrade(request, socket, head, (ws: WebSocket) => { wsserver.emit('connection', ws, request); });
    })
    .catch(() => {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    })
});

const port = 3010;
server.listen(port, () => {
    console.log(`Server listening On Port: ${port}`);
});