import WebSocket from 'ws';


export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        if(msgObj.request == 'getfilelist'){
            
        } else {
            ws.send('invalidrequest');
        }
    });
}
