import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const uploadAbadiLimit = (ws: WebSocket, msgObj: any) => {
    let { district, uniquevillagecode, validateusername, gjstr, attributes } = msgObj;

    let insertQuery = `INSERT INTO abadilimits (
        DISTRICT, UNIQUEVILLAGECODE, ABADILIMITNAME, NOOFPROPERTIES, MARKINGSTARTDATE, MARKINGENDDATE, 
        VILLAGENAME, VILLAGELGDCODE, ABADIAREASCOUNTINVILLAGE, GRAMPANCHAYAT, HOBLI, TALUK, CREATORINFO, APPROVERINFO, GEOM)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, ST_Force2D(ST_GeomFromGeoJSON('${gjstr}')))`;
    // console.log(insertQuery);
    // console.log(attributes);
    // console.log(gjstr);

    let { 
        abadilimitname, noofproperties, startdate, enddate, villagename, lgdcode,
        pocketscount, grampanchayat, hobli, taluk
    } = attributes;

    let insertData = [ district, uniquevillagecode,  abadilimitname, noofproperties, startdate, enddate, 
        villagename, lgdcode, pocketscount, grampanchayat, hobli, taluk, validateusername, ''
    ];
    
    const client = new Client({ connectionString });
    client.connect();

    client.query(insertQuery, insertData)
    // client.query(insertQuery)
    .then(() => {
        let responseObj = {
            response: 'uploadabadilimit', requestStatus: 'success', action: 'abadiuploaded'
        };

        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .catch((err) => {
        console.log(err);
        let responseObj = { response: 'uploadabadilimit', requestStatus: 'failure', action: 'none' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .finally(() => {
        client.end();
    });
}