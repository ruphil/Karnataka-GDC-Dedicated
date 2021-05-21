import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const downloadfile = (ws: WebSocket, msgObj: any) => {
    const { fileid } = msgObj;
    const client = new Client({ connectionString });
    client.connect();

    let query = `SELECT IDENTIFIER, MIMETYPE, DATA FROM filesattachment WHERE ID = ${fileid}`;
    
    client.query(query)
    .then((res) => {
        let row = res.rows[0];
        let arrByte = Buffer.from(row.data).toJSON().data;
        let uint8Array = new Uint8Array(arrByte);
        let decoded = new TextDecoder().decode(uint8Array);
        console.log(decoded);
        ws.send(Buffer.from(JSON.stringify(row)).toString('base64'));
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

export const getfilelist = (ws: WebSocket, msgObj: any) => {
    const { village, currentuniquevillagecode } = msgObj;
    const client = new Client({ connectionString });
    client.connect();

    let query = `SELECT ID, IDENTIFIER, UNIQUEVILLAGECODE, DETAILS, APPROVED, DATA, MIMETYPE, UPLOADERROLE, UPLOADEDBY, SERVERDATE FROM filesattachment WHERE VILLAGENAME = '${village}' AND UNIQUEVILLAGECODE = '${currentuniquevillagecode}'`;
    client.query(query)
    .then((res) => {
        ws.send(Buffer.from(JSON.stringify(res.rows)).toString('base64'));
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

export const uploadfile = (ws: WebSocket, msgObj: any) => {
    const { filename, village, details, currentuniquevillagecode, databytea, mimetype, rolecalculated, uploadedby } = msgObj;

    let query = `INSERT INTO filesattachment (IDENTIFIER, VILLAGENAME, UNIQUEVILLAGECODE, DETAILS, APPROVED, DATA, MIMETYPE, UPLOADERROLE, UPLOADEDBY) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    let insertData = [filename, village, currentuniquevillagecode, details, false, databytea, mimetype, rolecalculated, uploadedby];

    const client = new Client({ connectionString });
    client.connect();

    client.query(query, insertData)
    .then(() => {
        let responseObj = { requestStatus: 'success', action: 'uploaded' };
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

export const approvefile = (ws: WebSocket, msgObj: any) => {
    const { fileid } = msgObj;
    const client = new Client({ connectionString });
    client.connect();

    let query = `UPDATE filesattachment SET APPROVED = 'true' WHERE ID = '${fileid}'`;
    client.query(query)
    .then((res) => {
        let responseObj = { requestStatus: 'success', action: 'approved' };
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