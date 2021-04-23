import WebSocket, { Server } from 'ws';

import { newregistration, checkUser, logAttendance } from './dbtasks-attendance';
import { displayUsersTable, assignRole, deleteUser, checkAdmin, getAttendanceRegister } from './dbtasks-attendance';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        switch(msgObj.purpose){
            case 'commontask':
                handleCommonTasks(ws, msgObj);
                break;
            case 'attendance':
                handleAttendanceUserConnections(ws, msgObj);
                break;
            case 'attendanceadmin':
                handleAttendanceAdminConnection(ws, msgObj);
                break;
            case 'dspprogress':
                handleDSPProgressConnection(ws, msgObj);
                break;
            default:
                // To clearly inform the Unanonymous Users Without Base64 String
                ws.send('Invalid Request');
        }
    });
}

// Handle Common Tasks  -------------------------------------------------------------------------------------------
const handleCommonTasks = (ws: WebSocket, msgObj: any) => {
    switch(msgObj.requesttype){
        case 'newregistration':
            newregistration(ws, msgObj);
            break;
    }
}

// Handle Attendance Taks   -------------------------------------------------------------------------------------
const handleAttendanceUserConnections = (ws: WebSocket, msgObj: any) => {
    switch(msgObj.requesttype){
        case 'checkuser':
            checkUser(ws, msgObj);
            break;
        case 'logattendance':
            logAttendance(ws, msgObj);
            break;
    }
}

const handleAttendanceAdminConnection = (ws: WebSocket, msgObj: any) => {
    if(msgObj.user == 'admin' && msgObj.pass == 'dbadminkgdc'){
        switch(msgObj.requesttype){
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
    } else {
        let responseObj = { requestStatus: 'success', adminuser: false, action: 'ignored' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    }
}

// Handle Drone Survey Project Progress Taks   -------------------------------------------------------------------------------------
const handleDSPProgressConnection = (ws: WebSocket, msgObj: any) => {
    switch(msgObj.requesttype){
        case 'checkuser':
            newregistration(ws, msgObj);
            break;
    }
}