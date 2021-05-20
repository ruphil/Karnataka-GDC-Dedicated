import WebSocket from 'ws';

import { getfilelist, uploadfile } from './filesdbhandler';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const managefileattachments = (ws: WebSocket, msgObj: any) => {
    switch(msgObj.request){
        case 'getfilelist':
            getfilelist(ws, msgObj);
            break;
        case 'uploadfile':
            uploadfile(ws, msgObj);
            break;
        
        default:
            // To clearly inform the Unanonymous Users Requesting Without Base64 String
            respondWithFailureMsg(ws);
    }
}