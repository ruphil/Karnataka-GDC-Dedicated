import WebSocket from 'ws';

import { checkValidUserNGetRoles } from '../common-ts/usersdbhandler';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        checkValidUserNGetRoles(msgObj)
        .then(() => {
            if(msgObj.request == 'getgeojson'){
                let responseObj = { request: 'getgeojson', requestStatus: 'success', validUser: true, status: 'Valid Request' };
                ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
            } else {
                let responseObj = { request: 'getgeojson', requestStatus: 'success', validUser: true, status: 'Invalid Request' };
                ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
            }
        })
        .catch(() => {
            let responseObj = { request: 'getgeojson', requestStatus: 'failure', validUser: false, status: 'Unauthorized Request' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
    });
}
