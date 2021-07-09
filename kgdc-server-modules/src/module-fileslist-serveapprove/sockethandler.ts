import WebSocket from 'ws';

import { checkValidUserNGetRoles } from '../common-ts/userRolesAdminCheck';
import { getFileList } from './getfilelist';
import { approveAbadiLimit, approveFileAttachment } from './filesapprover';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        checkValidUserNGetRoles(msgObj)
        .then(() => {
            if(msgObj.request == 'getfilelist'){
                getFileList(ws, msgObj);
            } else if (msgObj.request == 'approveabadilimit'){
                approveAbadiLimit(ws, msgObj);
            } else if (msgObj.request == 'approvefileattachment'){
                approveFileAttachment(ws, msgObj);
            } else {
                let responseObj = { response: 'fileserveapprove', requestStatus: 'failure', validUser: true, status: 'Invalid Request' };
                ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
            }
        })
        .catch(() => {
            let responseObj = { response: 'fileserveapprove', requestStatus: 'failure', validUser: false, status: 'Unauthorized Request' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
    });
}
