import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import store from '@/shared/store';

import mapStyler from './mapStyler';
import globalToast from './globalToast';

const villagesBoundsLoader = () => {
    const { villagesStyleFunction } = mapStyler();
    const { showGlobalToast } = globalToast();

    const loadVillagesBounds = (districtname: string) => {
        unloadVillagesBounds();

        const username = store.getters.getUsername;
        const password = store.getters.getPassword;
        const map = store.getters.getMapObj;

        let mapextent = map.getView().calculateExtent();
        // console.log(mapextent);

        // console.log(map.getView().getProjection());

        let requestObj = {
            request: 'getgeojson',
            layer: 'karnvillages',
            district: districtname,
            validateusername: username,
            validatepassword: password,
            mapextent
        };

        console.log(requestObj);

        let wssURL = store.getters.getGJModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            // console.log(event.data);
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            if (responseObj.requestStatus == 'success'){
                let gj = responseObj.featureCollection;
                setVillagesBounds(gj);
            } else {
                console.log('Villages GJ Error...')
            }
            ws.close();
        });

        ws.addEventListener('open', (event) => {
            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }

    const setVillagesBounds = (gj: any) => {
        const map = store.getters.getMapObj;

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
        villagesBounds.set('name', 'villageslyr');

        store.dispatch('setVillageBoundsLoaded', true);

        map.addLayer(villagesBounds);
    }

    const unloadVillagesBounds = () => {
        const map = store.getters.getMapObj;

        try {
            map.getLayers().forEach(function (layer: any) {
                if (layer.get('name') != undefined && layer.get('name') === 'villageslyr') {
                    map.removeLayer(layer);
    
                    removeVillageDetails();
                }
            });
        } catch (e) {}
    }

    const removeVillageDetails = () => {
        store.dispatch('setVillageBoundsLoaded', false);
        store.dispatch('setCurrentVillage', '');
        store.dispatch('setUniqueVillageCode', '');
        store.dispatch('setAttributesData', '');
    }

    return { loadVillagesBounds, unloadVillagesBounds }
}

export default villagesBoundsLoader;