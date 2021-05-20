import WebSocket from 'ws';

import { userManager } from './composables/usersmanager';
import { getGeoJson } from './composables/getgeojsons';
import { managefileattachments } from './composables/fileattachmentsmanager';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        // console.log(msgObj);

        switch(msgObj.requesttype){
            case 'getgeojson':
                getGeoJson(ws, msgObj);
                break;
            case 'usermanagement':
                userManager(ws, msgObj);
                break;
            case 'filesattachment':
                managefileattachments(ws, msgObj);
                break;
            default:
                // To clearly inform the Unanonymous Users Requesting Without Base64 String
                ws.send('Invalid Request');
        }
    });
}