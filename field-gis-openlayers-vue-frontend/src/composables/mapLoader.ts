import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';

const mapLoader = () => {
    const loadBaseMap = (el: any) => {
        const baseMapLayer = new TileLayer({
            source: new XYZ({
                url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
            })
        });
    
        new Map({
            target: el,
            layers: [ baseMapLayer ],
            view: new View({
                // zoom: 6.5,
                zoom: 0,
                center: fromLonLat([0, 0]),
                // center: fromLonLat([76.56, 14.85]),
                constrainResolution: true
            }),
        });
    }

    return { loadBaseMap }
}

export default mapLoader;