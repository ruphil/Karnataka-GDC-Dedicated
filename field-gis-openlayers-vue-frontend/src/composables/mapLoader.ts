import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import mapStyler from './mapStyler';

const mapLoader = () => {
    const { districtStyleFunction } = mapStyler();

    const baseMapLayer = new TileLayer({
        source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
        })
    });

    const karndistbounds = new VectorLayer({
        source: new VectorSource({
            format: new GeoJSON(),
            url: function () {
                return (
                    'http://localhost:8080/geoserver/kgdc/ows?service=WFS&' +
                    'version=2.0.0&request=GetFeature&typeName=kgdc:karndistbounds&' +
                    'outputFormat=application/json'
                );
            },
        }),
        style: districtStyleFunction
    });

    const loadBaseMap = (el: any) => {
        new Map({
            target: el,
            layers: [ baseMapLayer ],
            view: new View({
                zoom: 0,
                center: fromLonLat([0, 0]),
                constrainResolution: true
            }),
        });
    }

    const loadBaseMapNKarnBounds = (el: any) => {
        new Map({
            target: el,
            layers: [ baseMapLayer, karndistbounds ],
            view: new View({
                zoom: 6.5,
                center: fromLonLat([76.56, 14.85]),
                constrainResolution: true
            }),
        });
    }

    return { loadBaseMap, loadBaseMapNKarnBounds }
}

export default mapLoader;