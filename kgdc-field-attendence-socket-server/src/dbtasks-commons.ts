import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:philosopher@localhost:5432/kgdcdb';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const newregistration = async (ws: WebSocket, msgObj: any) => {
    let insertQuery = `INSERT INTO kgdcusers (Name, MobileNumber, Password, UUID, ROLES) VALUES ($1, $2, $3, $4, $5)`;
    let { name, mobilenumber, password, UUID } = msgObj;
    let insertData = [name, mobilenumber, password, UUID, ''];
    
    const client = new Client({ connectionString });
    client.connect();

    client.query(insertQuery, insertData)
    .then(() => {
        let responseObj = { requestStatus: 'success', action: 'registered' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .catch((err) => {
        console.log(err);
        respondWithFailureMsg(ws);
        return 0;
    })
    .finally(() => {
        client.end();
    });
}

export const checkAdmin = (ws: WebSocket, msgObj: any) => {
    if(msgObj.user == 'admin' && msgObj.pass == 'dbadminkgdc'){
        let responseObj = { requestStatus: 'success', adminuser: true };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    } else {
        let responseObj = { requestStatus: 'success', adminuser: false };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    }
}