import WebSocket from 'ws';

// import { checkUser, newregistration, logAttendance } from './handlerdb';
// import { checkAdmin,  getAttendanceRegister } from './handlerdb';
// import { displayUsersTable, assignRole, deleteUser,  } from './handlerdb';

import { getRoles } from './composables/rolesmanagement';

export const handleWebSocketConnection = (ws: WebSocket) => {
    ws.on('message', (data: WebSocket.Data)=>{
        let msgObj = JSON.parse(Buffer.from(data.toString(), 'base64').toString());
        console.log(msgObj);

        switch(msgObj.requesttype){
            case 'getroles':
                getRoles(ws, msgObj);
                break;
            // case 'checkuser':
            //     checkUser(ws, msgObj);
            //     break;
            // case 'newregistration':
            //     newregistration(ws, msgObj);
            //     break;
            // case 'logattendance':
            //     logAttendance(ws, msgObj);
            //     break;
            // case 'checkadmin':
            //     checkAdmin(ws, msgObj);
            //     break;
            // case 'userstable':
            //     displayUsersTable(ws, msgObj);
            //     break;
            // case 'attendanceregister':
            //     getAttendanceRegister(ws, msgObj);
            //     break;
            // case 'assignrole':
            //     assignRole(ws, msgObj);
            //     break;
            // case 'deleteuser':
            //     deleteUser(ws, msgObj);
            //     break;
            default:
                // To clearly inform the Unanonymous Users Without Base64 String
                ws.send('Invalid Request');
        }
    });
}