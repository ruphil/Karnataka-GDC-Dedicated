import WebSocket from 'ws';
import { Client } from 'pg';

import { getRoles, newregistration } from './usersdbhandler';
import { checkAdmin,  getAttendanceRegister } from './usersdbhandler';
import { displayUsersTable, assignRole, deleteUser,  } from './usersdbhandler';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

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
        case 'checkadmin':
            checkAdmin(ws, msgObj);
            break;
        case 'userstable':
            displayUsersTable(ws, msgObj);
            break;
        case 'attendanceregister':
            getAttendanceRegister(ws, msgObj);
            break;
        case 'assignrole':
            assignRole(ws, msgObj);
            break;
        case 'deleteuser':
            deleteUser(ws, msgObj);
            break;
    }
}