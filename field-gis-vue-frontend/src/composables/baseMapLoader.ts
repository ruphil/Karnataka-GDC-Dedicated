import { getCurrentInstance } from '@vue/runtime-core';

import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import {transformExtent} from 'ol/proj';

const mapLoader = () => {
    const app = getCurrentInstance()!;

    const loadBaseMapToExtent = () => {
        unloadBaseMap();

        const map = app.appContext.config.globalProperties.$map;

        const baseMapLayer = new TileLayer({
            extent: transformExtent([73.50, 11.00, 79, 19.00], 'EPSG:4326', 'EPSG:3857'),
            source: new XYZ({
                url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
            })
        });

        map.addLayer(baseMapLayer);

        app.appContext.config.globalProperties.$villagesBounds = baseMapLayer;
    }

    const unloadBaseMap = () => {
        const map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$baseMapLayer != null){
            map.removeLayer(app.appContext.config.globalProperties.$baseMapLayer);
            app.appContext.config.globalProperties.$baseMapLayer = null;
        }
    }

    return { loadBaseMapToExtent, unloadBaseMap }
}

export default mapLoader;