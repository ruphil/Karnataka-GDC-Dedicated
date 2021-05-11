import { getCurrentInstance } from '@vue/runtime-core';

import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';

const mapLoader = () => {
    const app = getCurrentInstance()!;

    const baseMapLayer = new TileLayer({
        source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
        })
    });

    const initBaseMap = () => {
        let map = app.appContext.config.globalProperties.$map;

        map.setLayerGroup(new LayerGroup({
            layers: [ baseMapLayer ]
        }));

        map.setView(new View({
            zoom: 0,
            center: fromLonLat([0, 0]),
            constrainResolution: true
        }));
    }

    return { initBaseMap }
}

export default mapLoader;