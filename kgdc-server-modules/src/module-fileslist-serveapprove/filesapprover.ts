import WebSocket from 'ws';
import { Client } from 'pg';

import { checkValidUserNGetRoles } from '../common-ts/userRolesAdminCheck';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const approveAbadiLimit = (ws: WebSocket, msgObj: any) => {
    
    const { gid } = msgObj;

    checkValidUserNGetRoles(msgObj)
    .then((res: any) => {
        // console.log(res);
        const client = new Client({ connectionString });
        client.connect();

        let approverInfo = res.username + ' <' + res.description + '>,';
        console.log(approverInfo);

        let sqlQuery = `UPDATE abadilimits SET APPROVERINFO = APPROVERINFO || E'${approverInfo}' WHERE GID = '${gid}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'approveabadilimit', requestStatus: 'success', action: 'approved' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            console.log(err);
            let responseObj = { response: 'approveabadilimit', requestStatus: 'failure', action: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'approveabadilimit', requestStatus: 'failure', error: 'Usercheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const approveFileAttachment = (ws: WebSocket, msgObj: any) => {
    
    const { id } = msgObj;

    checkValidUserNGetRoles(msgObj)
    .then((res: any) => {
        // console.log(res);
        const client = new Client({ connectionString });
        client.connect();

        let approverInfo = res.username + ' <' + res.description + '>,';
        console.log(approverInfo);

        let sqlQuery = `UPDATE filesattachment SET APPROVERINFO = APPROVERINFO || E'${approverInfo}' WHERE ID = '${id}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'approvefile', requestStatus: 'success', action: 'approved' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            console.log(err);
            let responseObj = { response: 'approvefile', requestStatus: 'failure', action: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'approvefile', requestStatus: 'failure', error: 'Usercheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}