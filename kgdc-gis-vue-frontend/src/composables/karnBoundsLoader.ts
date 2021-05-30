import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import LayerGroup from 'ol/layer/Group';

import store from '@/store';

import mapStyler from './mapStyler';
import { makeSocketRequest } from '../composables/wsClient';

const karnBoundsLoader = () => {
    const { districtStyleFunction } = mapStyler();

    const loadKarnBounds = () => {
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        let requestObj = {
            requesttype: 'getgeojson',
            layer: 'karnatakaboundary',
            username,
            password
        }

        makeSocketRequest(requestObj)
        .then(() => {
            console.log('Karnataka Boundary Request Sent Successfully');
        })
        .catch(() => {
            console.log('Problem in sending Karnataka Boundary Request');
        })
    }

    // This Function is Called From wsClientMsgHandler.ts

    const setKarnBounds = (gj: any) => {
        const map = store.getters.getMapObj;
        console.log(map);

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