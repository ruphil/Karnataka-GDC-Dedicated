import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import mapStyler from './mapStyler';
import dataService from './dataService';
import { getCurrentInstance } from '@vue/runtime-core';
import LayerGroup from 'ol/layer/Group';

const karnBoundsLoader = () => {
    const { districtStyleFunction } = mapStyler();
    const { getJSONFeatures } = dataService();

    const app = getCurrentInstance()!;

    const loadKarnBounds = () => {
        if(app.appContext.config.globalProperties.$karndistbounds == null){
            getJSONFeatures('kgdc:karndistbounds')
            .then((jsonResponse: any)=>{
                // console.log(jsonResponse.data);
                let karnGJ = jsonResponse.data;
                setKarnBounds(karnGJ);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    const setKarnBounds = (gj: any) => {
        let map = app.appContext.config.globalProperties.$map;

        let karndistbounds = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(gj)
            }),
            style: districtStyleFunction
        });

        map.setLayerGroup(new LayerGroup({
            layers: [ karndistbounds ]
        }));

        map.setView(new View({
            zoom: 7,
            center: fromLonLat([76.56, 14.85]),
            constrainResolution: true
        }));

        app.appContext.config.globalProperties.$karndistbounds = karndistbounds;
    }

    const unloadKarnBounds = () => {
        let map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$karndistbounds != null){
            map.removeLayer(app.appContext.config.globalProperties.$karndistbounds);
            app.appContext.config.globalProperties.$karndistbounds = null;
        }
    }

    return { loadKarnBounds, unloadKarnBounds }
}

export default karnBoundsLoader;