import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

import { checkValidUserNGetRoles, checkAdminUser } from '../common-ts/userRolesAdminCheck';

//  All User Logics

export const getJurisdictions = (ws: WebSocket, msgObj: any) => {
    checkValidUserNGetRoles(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT * FROM jurisdictions`;
        client.query(getQuery)
        .then((res) => {
            let jurisdictionslist = res.rows;

            let responseObj = {
                response: 'getjurisdictions', requestStatus: 'success', jurisdictionslist
            };

            // console.log(responseObj);
    
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'getjurisdictions', requestStatus: 'failure', error: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'getjurisdictions', requestStatus: 'failure', error: 'Usercheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

//  Admin Logics

export const addDrone = async (ws: WebSocket, msgObj: any) => {
    let insertQuery = `INSERT INTO drones (DRONENUMBER) VALUES ($1)`;
    let { newdronenumber } = msgObj;
    let insertData = [ newdronenumber ];

    checkAdminUser(msgObj)
    .then((res: any) => {
    
        const client = new Client({ connectionString });
        client.connect();

        client.query(insertQuery, insertData)
        .then(() => {
            let responseObj = {
                response: 'adddrone', requestStatus: 'success', action: 'droneadded'
            };

            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'adddrone', requestStatus: 'failure', action: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((err) => {
        // console.log(err);
        let responseObj = { response: 'adddrone', requestStatus: 'failure', error: 'Admincheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
}

export const removeDrone = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let { dronetodelete } = msgObj;

        let sqlQuery = `DELETE FROM drones WHERE DRONENUMBER='${dronetodelete}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'deletedrone', requestStatus: 'success', adminuser: true, action: 'deleted' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'deletedrone', requestStatus: 'failure', error: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'deletedrone', requestStatus: 'failure', error: 'Admincheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}
