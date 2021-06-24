import WebSocket from 'ws';

import { getRoles, changePassword } from '../common-ts/usersdbhandler';
import { newregistration, getUsersTable, assignRole, deleteUser  } from '../common-ts/usersdbhandler';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        switch(msgObj.request){
            case 'getroles':
                getRoles(ws, msgObj);
                break;
            case 'changepassword':
                changePassword(ws, msgObj);
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
                ws.send('invalidrequest');
        }
    });
}