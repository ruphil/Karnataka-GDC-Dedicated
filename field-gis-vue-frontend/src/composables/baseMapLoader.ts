import { getCurrentInstance } from '@vue/runtime-core';

import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import LayerGroup from 'ol/layer/Group';
import {transformExtent} from 'ol/proj';

const mapLoader = () => {
    const app = getCurrentInstance()!;

    function transform(extent: any) {
        return transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
    }

    var extents = {
        India: transform([68.17665, 7.96553, 97.40256, 35.49401]),
        Argentina: transform([-73.41544, -55.25, -53.62835, -21.83231]),
        Nigeria: transform([2.6917, 4.24059, 14.57718, 13.86592]),
        Sweden: transform([11.02737, 55.36174, 23.90338, 69.10625]),
    };

    const baseMapLayer = new TileLayer({
        extent: extents.India,
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