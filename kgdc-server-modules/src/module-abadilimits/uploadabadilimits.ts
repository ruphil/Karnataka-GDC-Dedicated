import WebSocket from 'ws';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const uploadAbadiLimit = (ws: WebSocket, msgObj: any) => {
    let { district, gisselectedvillage, uniquevillagecode, validateusername, gjstr, attributes } = msgObj;

    let insertQuery = `INSERT INTO abadilimits (
        DISTRICT, TALUK, HOBLI, GRAMPANCHAYAT, VILLAGENAME, VILLAGELGDCODE, GISSELECTEDVILLAGE, UNIQUEVILLAGECODE, 
        ABADILIMITNAME, ABADILIMITUUID, NOOFPROPERTIES, MARKINGSTARTDATE, MARKINGENDDATE, ABADIAREASCOUNTINVILLAGE,
        CREATORINFO, APPROVERINFO, GEOM)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, ST_Force2D(ST_GeomFromGeoJSON('${gjstr}'))
    )`;
    // console.log(insertQuery);
    // console.log(attributes);
    // console.log(gjstr);

    let abadilimituuid = uuidv4();

    let {
        taluk, hobli, grampanchayat, villagename, lgdcode, 
        abadilimitname, noofproperties, startdate, enddate, pocketscount
    } = attributes;

    let insertData = [ district, taluk, hobli, grampanchayat, villagename, lgdcode, gisselectedvillage, uniquevillagecode,
        abadilimitname, abadilimituuid, noofproperties, startdate, enddate, pocketscount,
        validateusername, ''
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