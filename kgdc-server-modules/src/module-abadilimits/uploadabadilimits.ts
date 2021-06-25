import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const uploadAbadiLimit = (ws: WebSocket, msgObj: any) => {
    let insertQuery = `INSERT INTO abadilimits (
        ABADILIMITNAME, NOOFPROPERTIES, MARKINGSTARTDATE, MARKINGENDDATE, VILLAGENAME, VILLAGELGDCODE,
        GRAMPANCHAYAT, HOBLI, TALUK, DISTRICT, CREATORINFO, APPROVERINFO, GEOM) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
        
    let { geom, attributes } = msgObj;
    console.log(attributes);
    console.log(geom);

    // let insertData = [newusername, newpassword, mobilenumber, description, roles];
    
    // const client = new Client({ connectionString });
    // client.connect();

    // client.query(insertQuery, insertData)
    // .then(() => {
    //     let responseObj = {
    //         response: 'newregistration', requestStatus: 'success', action: 'useradded'
    //     };

    //     ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    // })
    // .catch((err) => {
    //     // console.log(err);
    //     let responseObj = { response: 'newregistration', requestStatus: 'failure', action: 'none' };
    //     ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    // })
    // .finally(() => {
    //     client.end();
    // });
}