import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import OSM from 'ol/source/OSM';

import mapStyler from './mapStyler';
import authenticator from '../composables/authenticator';

const mapLoader = () => {
    const { districtStyleFunction } = mapStyler();
    const { doAuthentication } = authenticator();

    const baseMapLayer = new TileLayer({
        source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
        })
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

    const loadBaseMapNKarnBounds = (el: HTMLElement, url: string, username: string, password: string) => {
        return new Promise((resolve, reject) => {
            doAuthentication(url, username, password)
            .then((res: any)=>{
                el.innerText = '';
                // console.log(res.data);
                let karnGJ = res.data;
                
                const karndistbounds = new VectorLayer({
                    source: new VectorSource({
                        features: new GeoJSON().readFeatures(karnGJ)
                    }),
                    style: districtStyleFunction
                });
        
                new Map({
                    target: el,
                    layers: [ baseMapLayer, karndistbounds ],
                    view: new View({
                        zoom: 6.5,
                        center: fromLonLat([76.56, 14.85]),
                        constrainResolution: true
                    }),
                });

                resolve('success');
            })
            .catch((error) => {
                console.log('failed');
                console.log(error);
                reject('failure');
            });
        });
    }

    return { loadBaseMap, loadBaseMapNKarnBounds }
}

export default mapLoader;