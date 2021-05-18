import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import mapStyler from './mapStyler';
import { getCurrentInstance } from '@vue/runtime-core';
import store from '@/store';

const villagesBoundsLoader = () => {
    const { villagesStyleFunction } = mapStyler();

    const app = getCurrentInstance()!;

    const loadVillagesBounds = (districtname: string) => {
        unloadVillagesBounds();
        
        const wsurlBase = store.getters.getWSURLBase;
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;
        console.log(wsurlBase);

        let ws = new WebSocket(wsurlBase);
        ws.addEventListener('message', (event) => {
            // console.log(event.data);
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            if (responseObj.requestStatus == 'success'){
                let gj = responseObj.featureCollection;
                setVillagesBounds(gj);
            } else {
                console.log('Problem Loading Karnataka Boundary from Server...')
            }
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let registrationObj = {
                requesttype: 'getgeojson',
                layer: 'karnvillages',
                district: districtname,
                username,
                password
            }
            ws.send(Buffer.from(JSON.stringify(registrationObj)).toString('base64'));
        });
    }

    const setVillagesBounds = (gj: any) => {
        const map = app.appContext.config.globalProperties.$map;

        let villagesBounds = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                }).readFeatures(gj)
            }),
            style: villagesStyleFunction,
            zIndex: 2
        });

        villagesBounds.set('loadedfromserver', 'yes');

        map.addLayer(villagesBounds);

        app.appContext.config.globalProperties.$villagesBounds = villagesBounds;
    }

    const unloadVillagesBounds = () => {
        const map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$villagesBounds != null){
            map.removeLayer(app.appContext.config.globalProperties.$villagesBounds);
            app.appContext.config.globalProperties.$villagesBounds = null;
        }
    }

    return { loadVillagesBounds, unloadVillagesBounds }
}

export default villagesBoundsLoader;