import WebSocket from 'ws';
import { Client } from 'pg';

import { checkValidUserNGetRoles, checkAdminUser } from '../common-ts/userRolesAdminCheck';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const approveAbadiLimit = (ws: WebSocket, msgObj: any) => {
    
    const { validateusername, oldpassword, newpassword } = msgObj;

    checkValidUserNGetRoles(msgObj)
    .then((res: any) => {
        console.log(res);
        const client = new Client({ connectionString });
        client.connect();

        let sqlQuery = `UPDATE userstable SET PASSWORD = '${newpassword}' WHERE USERNAME = '${validateusername}' AND PASSWORD = '${oldpassword}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'changepassword', requestStatus: 'success', action: 'passwordchanged' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            console.log(err);
            let responseObj = { response: 'changepassword', requestStatus: 'failure', action: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'changepassword', requestStatus: 'failure', error: 'Usercheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}