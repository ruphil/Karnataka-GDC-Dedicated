import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import mapStyler from './mapStyler';
import dataService from './dataService';
import { getCurrentInstance } from '@vue/runtime-core';

const villagesBoundsLoader = () => {
    const { districtStyleFunction } = mapStyler();
    const { getJSONFeatures } = dataService();

    const app = getCurrentInstance()!;

    const loadVillagesBounds = (districtname: string) => {
        if(app.appContext.config.globalProperties.$villagesBounds == null){
            getJSONFeatures('kgdc:karnvillages', `kgisdist_1='${districtname}'`)
            .then((jsonResponse: any)=>{
                // console.log(jsonResponse.data);
                let villagesGJ = jsonResponse.data;
                setVillagesBounds(villagesGJ);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    }

    const setVillagesBounds = (gj: any) => {
        let map = app.appContext.config.globalProperties.$map;

        let villagesBounds = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(gj)
            }),
            style: districtStyleFunction
        });

        map.addLayer(villagesBounds);

        map.setView(new View({
            zoom: 7,
            center: fromLonLat([76.56, 14.85]),
            constrainResolution: true
        }));

        app.appContext.config.globalProperties.$villagesBounds = villagesBounds;
    }

    const unloadVillagesBounds = () => {
        let map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$villagesBounds != null){
            map.removeLayer(app.appContext.config.globalProperties.$villagesBounds);
            app.appContext.config.globalProperties.$villagesBounds = null;
        }
    }

    return { loadVillagesBounds, unloadVillagesBounds }
}

export default villagesBoundsLoader;