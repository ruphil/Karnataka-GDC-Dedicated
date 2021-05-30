import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import LayerGroup from 'ol/layer/Group';

import store from '@/store';
import { getCurrentInstance } from '@vue/runtime-core';

import mapStyler from './mapStyler';
import { makeSocketRequest } from '../composables/wsClient';

const karnBoundsLoader = () => {
    const { districtStyleFunction } = mapStyler();

    const app = getCurrentInstance()!;

    const loadKarnBounds = () => {
        if(app.appContext.config.globalProperties.$karndistbounds == null){
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
    }

    // This Function is Called From wsClientMsgHandler.ts

    const setKarnBounds = (gj: any) => {
        const map = app.appContext.config.globalProperties.$map;

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

        app.appContext.config.globalProperties.$karndistbounds = karndistbounds;
        store.dispatch('setKarnBoundsLoaded', true);
    }

    const unloadKarnBounds = () => {
        const map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$karndistbounds != null){
            map.removeLayer(app.appContext.config.globalProperties.$karndistbounds);
            app.appContext.config.globalProperties.$karndistbounds = null;
        }
    }

    return { loadKarnBounds, setKarnBounds, unloadKarnBounds }
}

export default karnBoundsLoader;