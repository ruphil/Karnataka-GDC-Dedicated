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
    const { districtStyleFunction, villagesStyleFunction } = mapStyler();
    const { doAuthentication } = authenticator();
    
    const store = useStore();

    const app = getCurrentInstance()!;
    app.appContext.config.globalProperties.$map = new Map({});

    // let j = new Map({});
    
    app.appContext.config.globalProperties.$kmllayer = null;
    app.appContext.config.globalProperties.$shplayer = null;
    app.appContext.config.globalProperties.$distvillageslyr = null;

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

    const loadKarnBounds = (username: string, password: string) => {
        let url: string = 'http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=kgdc:karndistbounds&srsname=EPSG:3857&outputFormat=application/json';
        doAuthentication(url, username, password)
        .then((res: any)=>{
            // console.log(res.data);

            let karnGJ = res.data;
            store.dispatch('setUserName', username);
            store.dispatch('setPassWord', password);
            store.dispatch('setLoggedIn', true);
            
            setKarnBounds(karnGJ);
        })
        .catch((error) => {
            console.log(error);
            store.dispatch('setLogInMsg', 'Incorrect Credentials... Please Try Again...');
        });
    }

    const setKarnBounds = (karnGJ: any) => {
        let map = app.appContext.config.globalProperties.$map;

        let karndistbounds = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(karnGJ)
            }),
            style: districtStyleFunction
        });

        map.addLayer(karndistbounds);

        map.setView(new View({
            zoom: 7,
            center: fromLonLat([76.56, 14.85]),
            constrainResolution: true
        }));

        store.dispatch('setLogInMsg', 'Success...');

        fetchNLoadDroneNumbers();
    }

    const fetchNLoadDroneNumbers = () => {
        let url = 'http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kgdc:tabledronenumbers&outputFormat=application/json';
        let username = store.getters.getUserName;
        let password = store.getters.getPassWord;
        doAuthentication(url, username, password)
        .then((res: any)=>{
            console.log(res.data);
            let dronenumbersGJ = res.data;

            store.dispatch('setDroneNumbersGJ', dronenumbersGJ);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const loadKML = (kmlstring: any) => {
        let map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$kmllayer != null){
            map.removeLayer(app.appContext.config.globalProperties.$kmllayer);
        }

        let kmlFeatures = new KML({
            extractStyles: false
        }).readFeatures(kmlstring, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });

        let filteredkmlfeatures = kmlFeatures.filter((feat) => {
            return feat.getGeometry()?.getType() == 'LineString';
        });

        let kmllyr = new VectorLayer({
            source: new VectorSource({
                features: filteredkmlfeatures
            })
        });

        if(kmllyr.getSource().getFeatures().length > 0){
            map.addLayer(kmllyr);
            app.appContext.config.globalProperties.$kmllayer = kmllyr;

            map.getView().fit(kmllyr.getSource().getExtent());
            store.dispatch('setflightlinekmlValidity', true);
        } else {
            store.dispatch('setflightlinekmlValidity', false);
            store.dispatch('setUploadStatusMsg', 'Invalid KML');
        }

        setTimeout(() => {
            store.dispatch('setUploadStatusMsg', '');
        }, 5000);
    }

    const discardKMLIfany = () => {
        let map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$kmllayer != null){
            map.removeLayer(app.appContext.config.globalProperties.$kmllayer);
            app.appContext.config.globalProperties.$kmllayer = null;
            store.dispatch('setflightlinekmlValidity', false);
        }
    }

    const loadSHP = (geojson: any) => {
        let map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$shplayer != null){
            map.removeLayer(app.appContext.config.globalProperties.$shplayer);
        }

        let kmllayer = app.appContext.config.globalProperties.$kmllayer;
        let kmlextent = kmllayer.getSource().getExtent();

        let shpvectorsource = new VectorSource({
            features: new GeoJSON({
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            }).readFeatures(geojson),
        });

        let shapefeatures = shpvectorsource.getFeaturesInExtent(kmlextent);

        if(shapefeatures.length > 0){
            let shplyr = new VectorLayer({
                source: new VectorSource({
                    features: shapefeatures,
                })
            });

            map.addLayer(shplyr);
            app.appContext.config.globalProperties.$shplayer = shplyr;

            map.getView().fit(shplyr.getSource().getExtent());
            store.dispatch('setshapefileValidity', true);
        } else {
            store.dispatch('setshapefileValidity', false);
            store.dispatch('setUploadStatusMsg', 'Invalid Shapefile for KML');
        }

        setTimeout(() => {
            store.dispatch('setUploadStatusMsg', '');
        }, 5000);
    }

    const discardSHPIfany = () => {
        let map = app.appContext.config.globalProperties.$map;

        if(app.appContext.config.globalProperties.$shplayer != null){
            map.removeLayer(app.appContext.config.globalProperties.$shplayer);
            app.appContext.config.globalProperties.$shplayer = null;
            store.dispatch('setshapefileValidity', false);
        }
    }

    const flightsmanagerfunctions = { initBaseMap, fetchNLoadDroneNumbers, loadKarnBounds, loadKML, discardKMLIfany, loadSHP, discardSHPIfany };

    const loadVillagesWFS = (districtname: any) => {
        let url = `http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kgdc:karnvillages&srsname=EPSG:3857&outputFormat=application/json&cql_filter=kgisdist_1='${districtname}'`;

        let username = store.getters.getUserName;
        let password = store.getters.getPassWord;
        doAuthentication(url, username, password)
        .then((res: any)=>{
            // console.log(res.data);

            let villagesGJ = res.data;
            addVillagesBoundary(villagesGJ);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const addVillagesBoundary = (villagesGJ: any) => {
        let map = app.appContext.config.globalProperties.$map;

        let villagesLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(villagesGJ)
            }),
            style: villagesStyleFunction
        });

        map.addLayer(villagesLayer);

        map.getView().fit(villagesLayer.getSource().getExtent());
    }

    const loadFlightsWFS = (districtname: any) => {
        let url = `http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kgdc:flightlines&srsname=EPSG:3857&outputFormat=application/json&cql_filter=district='${districtname}'`;

        let username = store.getters.getUserName;
        let password = store.getters.getPassWord;
        doAuthentication(url, username, password)
        .then((res: any)=>{
            // console.log(res.data);

            let fligthsGJ = res.data;
            addFlights(fligthsGJ);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const addFlights = (fligthsGJ: any) => {
        let map = app.appContext.config.globalProperties.$map;

        let flightsLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(fligthsGJ)
            }),
            style: villagesStyleFunction
        });

        map.addLayer(flightsLayer);

        map.getView().fit(flightsLayer.getSource().getExtent());
    }

    const loadShapesWFS = (districtname: any) => {
        let url = `http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kgdc:plannedshapes&srsname=EPSG:3857&outputFormat=application/json&cql_filter=district='${districtname}'`;

        let username = store.getters.getUserName;
        let password = store.getters.getPassWord;
        doAuthentication(url, username, password)
        .then((res: any)=>{
            // console.log(res.data);

            let shapesGJ = res.data;
            addShapes(shapesGJ);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const addShapes = (shapesGJ: any) => {
        let map = app.appContext.config.globalProperties.$map;

        let shapesLayer = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON().readFeatures(shapesGJ)
            }),
            style: villagesStyleFunction
        });

        map.addLayer(shapesLayer);

        map.getView().fit(shapesLayer.getSource().getExtent());
    }

    const layermanagerfunction = { loadVillagesWFS, loadFlightsWFS, loadShapesWFS };

    return { ...flightsmanagerfunctions, ...layermanagerfunction }
}

export default mapLoader;