import WebSocket from 'ws';
import { Client } from 'pg';

import { checkValidUserNGetRoles } from './usersdbhandler';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const getGeoJson = (ws: WebSocket, msgObj: any) => {
    let queryVariant = '';
    if(msgObj.layer == 'karnatakaboundary'){
        queryVariant = 'SELECT * FROM district_boundary';
    } else if (msgObj.layer == 'karnvillages'){
        let district = msgObj.district;
        queryVariant = `SELECT * FROM karnvillages WHERE kgisdist_1='${district}'`;
    }

    let getQuery = `SELECT jsonb_build_object(
        'type',     'FeatureCollection',
        'features', jsonb_agg(features.feature)
    )
    FROM (
      SELECT jsonb_build_object(
        'type',       'Feature',
        'id',         gid,
        'geometry',   ST_AsGeoJSON(geom)::jsonb,
        'properties', to_jsonb(inputs) - 'gid' - 'geom'
      ) AS feature
    FROM (${queryVariant}) inputs) features;`;

    checkValidUserNGetRoles(ws, msgObj)
    .then((responseObj: any) => {
        const client = new Client({ connectionString });
        client.connect();

        client.query(getQuery)
        .then((res) => {
            let featureCollection = res.rows[0].jsonb_build_object;
            let responseObj = { requestStatus: 'success', isAdmin: true, featureCollection };
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
    })
    .catch((res: any) => {
        let responseObj = { requestStatus: 'failure', validUser: false };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}
