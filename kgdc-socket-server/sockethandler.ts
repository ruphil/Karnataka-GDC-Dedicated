import WebSocket, { Server } from 'ws';

import { newregistration, checkUser, logAttendance } from './attendancedbmanager';
import { displayUsersTable, assignRole, deleteUser, checkAdmin, getAttendanceRegister } from './attendancedbmanager';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        switch(msgObj.purpose){
            case 'attendance':
                handleAttendanceConnections(ws, msgObj)
            default:
                // To clearly inform the Unanonymous Users Without Base64 String
                ws.send('Invalid Request');
        }
    });
}

const handleAttendanceConnections = (ws: WebSocket, msgObj: any) => {
    switch(msgObj.requesttype){
        case 'newregistration':
            newregistration(ws, msgObj);
            break;
        case 'checkuser':
            checkUser(ws, msgObj);
            break;
        case 'logattendance':
            logAttendance(ws, msgObj);
            break;
        case 'userstable':
            displayUsersTable(ws, msgObj);
            break;
        case 'deleteuser':
            deleteUser(ws, msgObj);
            break;
        case 'assignrole':
            assignRole(ws, msgObj);
            break;
        case 'checkadmin':
            checkAdmin(ws, msgObj);
            break;
        case 'attendanceregister':
            getAttendanceRegister(ws, msgObj);
            break;
    }
}