import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const uploadAbadiLimit = (ws: WebSocket, msgObj: any) => {
    

    // const client = new Client({ connectionString });
    // client.connect();

    // client.query(getQuery)
    // .then((res) => {
    //     let featureCollection = res.rows[0].jsonb_build_object;
    //     let responseObj = { response: 'getgeojson', requestStatus: 'success', validUser: true, layer, featureCollection };
    //     ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    // })
    // .catch((err) => {
    //     console.log(err);
    //     let responseObj = { response: 'getgeojson', requestStatus: 'failure', validUser: true, status: 'Error in SQL' };
    //     ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    // })
    // .finally(() => {
    //     client.end();
    // });
}