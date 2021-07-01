import WebSocket from 'ws';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        switch(msgObj.request){
            case 'file':
                // managefileattachments(ws, msgObj);
                break;
            default:
                // To clearly inform the Unanonymous Users Requesting Without Base64 String
                ws.send('Invalid Request');
        }
    });
}