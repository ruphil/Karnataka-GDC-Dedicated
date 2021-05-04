import { useStore } from 'vuex';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import KML from 'ol/format/KML';

import mapStyler from './mapStyler';
import authenticator from '../composables/authenticator';
import LayerGroup from 'ol/layer/Group';
import { getCurrentInstance } from '@vue/runtime-core';

const mapLoader = () => {
    const { districtStyleFunction } = mapStyler();
    const { doAuthentication } = authenticator();
    
    const store = useStore();

    const app = getCurrentInstance()!;
    app.appContext.config.globalProperties.$map = new Map({});

    const baseMapLayer = new TileLayer({
        source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
        })
    });

    const initBaseMap = (el: any) => {
        let map = app.appContext.config.globalProperties.$map;

        map.setTarget(el);

        map.setLayerGroup(new LayerGroup({
            layers: [ baseMapLayer ]
        }));

        map.setView(new View({
            zoom: 0,
            center: fromLonLat([0, 0]),
            constrainResolution: true
        }));
    }

    const loadKarnBounds = (url: string, username: string, password: string) => {
        let karnGJ = store.getters.getKarnBoundsGJ;
        console.log(Object.keys(karnGJ).length);
        if(Object.keys(karnGJ).length == 0){
            doAuthentication(url, username, password)
            .then((res: any)=>{
                // el.innerText = '';
                console.log(res.data);

                let karnGJ = res.data;

                store.dispatch('setUserName', username);
                store.dispatch('setPassWord', password);
                store.dispatch('setKarnBoundsGJ', karnGJ);
                store.dispatch('setLoggedIn', true);
                
                setKarnBounds(karnGJ);
            })
            .catch((error) => {
                console.log(error);
                store.dispatch('setLogInMsg', 'Incorrect Credentials... Please Try Again...');
            });
        } else {
            setKarnBounds(karnGJ);
        }
    }

    const setKarnBounds = (karnGJ: any) => {
        let map = app.appContext.config.globalProperties.$map;

        let karndistbounds = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(karnGJ)
            }),
            style: districtStyleFunction
        });

        // map.setTarget(el);

        map.addLayer(karndistbounds);

        // map.setLayerGroup(new LayerGroup({
        //     layers: [ baseMapLayer, karndistbounds ]
        // }));

        map.setView(new View({
            zoom: 7,
            center: fromLonLat([76.56, 14.85]),
            constrainResolution: true
        }));

        store.dispatch('setLogInMsg', 'Success...');
    }

    const loadKML = (kmlstring: any) => {
        let map = app.appContext.config.globalProperties.$map;
        // console.log(kmlstring);

        // map.setTarget(el);

        let kmlFeatures = new KML({
            extractStyles: false
        }).readFeatures(kmlstring, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });

        let filteredkmlfeatures = kmlFeatures.filter((feat) => {
            return feat.getGeometry()?.getType() == 'LineString'
        });

        let kmllyr = new VectorLayer({
            source: new VectorSource({
                features: filteredkmlfeatures
            })
        });

        map.addLayer(kmllyr);

        map.getView().fit(kmllyr.getSource().getExtent());

        // let lyrcentre = getCenter(kmllyr.getSource().getExtent());

        // map.setView(new View({
        //     zoom: 14,
        //     center: lyrcentre,
        //     constrainResolution: true
        // }));
    }

    return { initBaseMap, loadKarnBounds, loadKML }
}

export default mapLoader;