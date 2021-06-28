import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

export const getGeoJson = (ws: WebSocket, msgObj: any) => {
    let queryVariant = '';
    let layer = msgObj.layer;

    if(layer == 'karnatakaboundary'){
        queryVariant = 'SELECT * FROM district_boundary';
    } else if (layer == 'karnvillages'){
        let district = msgObj.district;
        let mapextent = msgObj.mapextent;
        
        let query1 = `SELECT * FROM karnvillages WHERE kgisdist_1='${district}'`;
        queryVariant = `SELECT * FROM (${query1}) AS districtvillages WHERE geom && ST_Transform(ST_MakeEnvelope(${mapextent[0]}, ${mapextent[1]}, ${mapextent[2]}, ${mapextent[3]}, 3857), 4326)`;
        // console.log(queryVariant);
    } else if (layer == 'abadilimits'){
        let district = msgObj.district;
        let mapextent = msgObj.mapextent;
        
        let query1 = `SELECT * FROM abadilimits WHERE district='${district}'`;
        queryVariant = `SELECT * FROM (${query1}) AS districtabadis WHERE geom && ST_Transform(ST_MakeEnvelope(${mapextent[0]}, ${mapextent[1]}, ${mapextent[2]}, ${mapextent[3]}, 3857), 4326)`;
        // console.log(queryVariant);
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

    const client = new Client({ connectionString });
    client.connect();

    client.query(getQuery)
    .then((res) => {
        let featureCollection = res.rows[0].jsonb_build_object;
        let responseObj = { response: 'getgeojson', requestStatus: 'success', validUser: true, layer, featureCollection };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .catch((err) => {
        console.log(err);
        let responseObj = { response: 'getgeojson', requestStatus: 'failure', validUser: true, status: 'Error in SQL' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .finally(() => {
        client.end();
    });
}