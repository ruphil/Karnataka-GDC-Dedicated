import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const getFileList = (ws: WebSocket, msgObj: any) => {
    const { uniquevillagecode } = msgObj;
    let query1 = `SELECT * FROM abadilimits WHERE UNIQUEVILLAGECODE='${uniquevillagecode}'`;

    // let queryVariant = `SELECT * FROM abadilimits WHERE UNIQUEVILLAGECODE='${uniquevillagecode}'`;
    
    // let query1 = `SELECT jsonb_build_object(
    //         'type',     'FeatureCollection',
    //         'features', jsonb_agg(features.feature)
    //     )
    //     FROM (
    //     SELECT jsonb_build_object(
    //         'type',       'Feature',
    //         'id',         gid,
    //         'geometry',   ST_AsGeoJSON(geom)::jsonb,
    //         'properties', to_jsonb(inputs) - 'gid' - 'geom'
    //     ) AS feature
    //     FROM (${queryVariant}) inputs) features;`;

    const client = new Client({ connectionString });
    client.connect();

    client.query(query1)
    .then((res) => {
        let abadilist = res.rows;
        // console.log(abadilist);

        let query2 = `SELECT * FROM filesattachment WHERE UNIQUEVILLAGECODE='${uniquevillagecode}'`;
        client.query(query2)
        .then((res) => {
            let attachmentlist = res.rows;
            let fileslist = { abadilist, attachmentlist }

            let responseObj = { response: 'getfilelist', requestStatus: 'success', validUser: true, fileslist };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        }).catch((err) => {
            console.log(err);
            let responseObj = { response: 'getfilelist', requestStatus: 'failure', validUser: true, status: 'Error in SQL' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((err) => {
        console.log(err);
        let responseObj = { response: 'getfilelist', requestStatus: 'failure', validUser: true, status: 'Error in SQL' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}