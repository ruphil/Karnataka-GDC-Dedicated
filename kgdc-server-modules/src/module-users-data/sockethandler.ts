import WebSocket from 'ws';

import { getRoles, changePassword } from './dbhandlerusers';
import { newregistration, getUsersTable, updateUserCredentials, assignRole, deleteUser  } from './dbhandlerusers';
import { addDrone, removeDrone, getDrones  } from './dbhandlerdrones';
import { getJurisdictions } from './dbhandlerjurisdictions';

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
            case 'updateusercredentials':
                updateUserCredentials(ws, msgObj);
                break;
            case 'assignrole':
                assignRole(ws, msgObj);
                break;
            case 'deleteuser':
                deleteUser(ws, msgObj);
                break;
            case 'adddrone':
                addDrone(ws, msgObj);
                break;
            case 'deletedrone':
                removeDrone(ws, msgObj);
                break;
            case 'getdrones':
                getDrones(ws, msgObj);
                break;
            case 'getjurisdictions':
                getJurisdictions(ws, msgObj);
                break;
            default:
                // To clearly inform the Unanonymous Users Requesting Without Base64 String
                ws.send('invalidrequest');
        }
    });
}