import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import LayerGroup from 'ol/layer/Group';

import store from '@/store';

import mapStyler from './mapStyler';

const karnBoundsLoader = () => {
    const { districtStyleFunction } = mapStyler();

    const loadKarnBounds = () => {
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        let requestObj = {
            request: 'getgeojson',
            layer: 'karnatakaboundary',
            validateusername: username,
            validatepassword: password
        }

        console.log(requestObj);

        let wssURL = store.getters.getGJModuleWSS;
        let ws = new WebSocket(wssURL);
    
        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);

            if(responseObj.requestStatus == 'success'){
                setKarnBounds(responseObj.featureCollection)
            } else {
                console.log('Karn GJ Error');
            }

            ws.close();
        });

        ws.addEventListener('open', (event) => {
            ws.send(btoa(JSON.stringify(requestObj)));
        });
    }

    // This Function is Called From wsClientMsgHandler.ts

    const setKarnBounds = (gj: any) => {
        const map = store.getters.getMapObj;
        // console.log(map);

        let karndistbounds = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                }).readFeatures(gj)
            }),
            style: districtStyleFunction,
            zIndex: 1
        });

        karndistbounds.set('loadedfromserver', 'yes');

        map.setLayerGroup(new LayerGroup({
            layers: [ karndistbounds ]
        }));

        map.setView(new View({
            zoom: 7,
            center: fromLonLat([76.56, 14.85]),
            constrainResolution: true
        }));

        store.dispatch('setKarnBoundsLoaded', true);
    }

    return { loadKarnBounds, setKarnBounds }
}

export default karnBoundsLoader;