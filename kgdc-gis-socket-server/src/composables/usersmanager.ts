import WebSocket from 'ws';

import { getRoles, newregistration } from './usersdbhandler';
import { getUsersTable, assignRole, deleteUser,  } from './usersdbhandler';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const userManager = (ws: WebSocket, msgObj: any) => {
    switch(msgObj.request){
        case 'getroles':
            getRoles(ws, msgObj);
            break;
        case 'newregistration':
            newregistration(ws, msgObj);
            break;
        case 'userstable':
            getUsersTable(ws, msgObj);
            break;
        case 'assignrole':
            assignRole(ws, msgObj);
            break;
        case 'deleteuser':
            deleteUser(ws, msgObj);
            break;
        default:
            // To clearly inform the Unanonymous Users Requesting Without Base64 String
            respondWithFailureMsg(ws);
    }
}