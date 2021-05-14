import { View } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import mapStyler from './mapStyler';
import dataService from './dataService';
import { getCurrentInstance } from '@vue/runtime-core';

const villagesBoundsLoader = () => {
    const { villagesStyleFunction } = mapStyler();
    const { getJSONFeatures } = dataService();

    const app = getCurrentInstance()!;

    const loadVillagesBounds = (districtname: string) => {
        unloadVillagesBounds();
        
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

    const setVillagesBounds = (gj: any) => {
        const map = app.appContext.config.globalProperties.$map;

        let villagesBounds = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(gj)
            }),
            style: villagesStyleFunction,
            zIndex: 2
        });

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