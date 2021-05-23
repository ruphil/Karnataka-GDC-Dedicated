import http from 'http';
import WebSocket, { Server } from 'ws';
import { handlews } from './wshandle';
import { checkuser } from './authenticator';

const server = http.createServer();
const wss = new Server({ noServer: true });

wss.on('connection', (ws: WebSocket, request: any) => {
    console.log('came here 1');
    handlews(ws, request);
});

server.on('upgrade', (request, socket, head) => {
    const reqUrl = new URL(request.url, request.headers.origin);
    // console.log(reqUrl);
    // console.log(reqUrl.searchParams);
    const { validuser, roles } = checkuser(reqUrl.searchParams);
    console.log(validuser, roles);
    
    if(validuser){
        console.log('came here 2');
        wss.handleUpgrade(request, socket, head, function done(ws) {
            console.log('came here 3');
            wss.emit('connection', ws, request);
        });
    } else {
        console.log('came here 12');
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
});

const port = 3010;
server.listen(port, () => {
    console.log(`Server listening On Port: ${port}`);
});