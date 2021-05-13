import { getCurrentInstance } from '@vue/runtime-core';

import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import {transformExtent} from 'ol/proj';

const mapLoader = () => {
    const app = getCurrentInstance()!;

    const loadBaseMap = () => {
        const map = app.appContext.config.globalProperties.$map;

        const baseMapLayer = new TileLayer({
            extent: transformExtent([73.50, 11.00, 79, 19.00], 'EPSG:4326', 'EPSG:3857'),
            source: new XYZ({
                url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
            })
        });

        map.setLayerGroup(new LayerGroup({
            layers: [ baseMapLayer ]
        }));

        map.setView(new View({
            zoom: 6,
            center: fromLonLat([76.56, 14.85]),
            constrainResolution: true
        }));
    }

    return { loadBaseMap }
}

export default mapLoader;