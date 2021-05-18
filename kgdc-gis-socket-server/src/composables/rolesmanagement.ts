import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:philosopher@localhost:5432/kgdcdb';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

// User Logics

export const getRoles = (ws: WebSocket, msgObj: any) => {
    // return new Promise((resolve, reject) => {});
}