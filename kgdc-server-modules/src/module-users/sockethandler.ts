import WebSocket from 'ws';

import { getRoles, newregistration } from '../common-ts/usersdbhandler';
// import { getUsersTable, assignRole, deleteUser,  } from './usersdbhandler';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'invalidrequest' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        switch(msgObj.request){
            case 'getroles':
                getRoles(ws, msgObj);
                break;
            case 'newregistration':
                newregistration(ws, msgObj);
                break;
            // case 'userstable':
            //     getUsersTable(ws, msgObj);
            //     break;
            // case 'assignrole':
            //     assignRole(ws, msgObj);
            //     break;
            // case 'deleteuser':
            //     deleteUser(ws, msgObj);
            //     break;
            default:
                // To clearly inform the Unanonymous Users Requesting Without Base64 String
                respondWithFailureMsg(ws);
        }
    });
}