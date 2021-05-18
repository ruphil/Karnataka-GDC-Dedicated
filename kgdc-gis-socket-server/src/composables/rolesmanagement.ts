import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

/* Admin Credentials:
    username    gisadmin
    password    kgdcgis
*/
const isAdmin = (msgObj: any) => {
    if(msgObj.username == 'gisadmin' && msgObj.password == 'kgdcgis'){
        return true;
    } else return false;
}

export const getRoles = (ws: WebSocket, msgObj: any) => {
    if(isAdmin(msgObj)){
        let responseObj = { requestStatus: 'success', isAdmin: true };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    } else {
        console.log('Not Admin');
    }
}

