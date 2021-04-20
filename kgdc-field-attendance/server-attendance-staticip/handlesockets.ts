import WebSocket, { Server } from 'ws';

import { newregistration, checkUser, logAttendance } from './dbmanager';
import { displayUsersTable, approveBanUser, deleteUser, checkAdmin, getAttendanceRegister } from './dbmanager';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        if(msgObj.requesttype == 'newregistration'){
            newregistration(ws, msgObj);
        } else if (msgObj.requesttype == 'checkuser'){
            checkUser(ws, msgObj);
        } else if (msgObj.requesttype == 'logattendance'){
            logAttendance(ws, msgObj);
        } else if (msgObj.requesttype == 'userstable'){
            displayUsersTable(ws, msgObj);
        } else if (msgObj.requesttype == 'deleteuser'){
            deleteUser(ws, msgObj);
        } else if (msgObj.requesttype == 'approvebanuser'){
            approveBanUser(ws, msgObj);
        } else if (msgObj.requesttype == 'checkadmin'){
            checkAdmin(ws, msgObj);
        } else if (msgObj.requesttype == 'attendanceregister'){
            getAttendanceRegister(ws, msgObj);
        } else {
            ws.send('Invalid Request');
        }
    });
}