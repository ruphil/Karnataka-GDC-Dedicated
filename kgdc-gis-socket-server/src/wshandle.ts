import WebSocket from 'ws';

export const handlews = (ws: WebSocket, request: any) => {
    const reqUrl = new URL(request.url, request.headers.origin);
    console.log(reqUrl);
    console.log(reqUrl.searchParams);

    console.log('came here 4');
    ws.send('jack');

    ws.on('message', (data: WebSocket.Data ) => {
        console.log('received: %s', data);
    });
}