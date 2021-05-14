import { getCurrentInstance } from '@vue/runtime-core';
import globalToast from '../composables/globalToast';

import KML from 'ol/format/KML';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

const kmlshpHanlder = () => {
    const app = getCurrentInstance()!;
    const { showGlobalToast } = globalToast();

    const loadshp = (file: any) => {
        const map = app.appContext.config.globalProperties.$map;

    }

    const loadkml = (file: any) => {
        const map = app.appContext.config.globalProperties.$map;

        let fileFullname = file.name;
        let lastDot = fileFullname.lastIndexOf('.');
        let fileName = fileFullname.substring(0, lastDot);
        let extension = fileFullname.substring(lastDot + 1);

        let reader = new FileReader();
        reader.onload = function () {
            // console.log(reader.result);
            // console.log(fileFullname, extension);

            let kmlstring = reader.result!;
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
    
                map.getView().fit(kmllyr.getSource().getExtent());
            }
        }
        reader.readAsText(file);
    }

    const loadFile = (file: any) => {
        let fileFullname = file.name;
        let lastDot = fileFullname.lastIndexOf('.');
        let extension = fileFullname.substring(lastDot + 1);

        if (extension != 'kml' && extension != 'zip'){
            showGlobalToast('Invalid File Selected...');
            return { validgeometry: false }
        } else if (extension == 'kml') {
            loadkml(file);
        } else if (extension == 'zip') {
            loadshp(file);
        }
    }

    return { loadFile }
}

export default kmlshpHanlder;

// const loadKML = (kmlstring: any) => {
    //     let map = app.appContext.config.globalProperties.$map;

    //     if(app.appContext.config.globalProperties.$kmllayer != null){
    //         map.removeLayer(app.appContext.config.globalProperties.$kmllayer);
    //     }

    //     let kmlFeatures = new KML({
    //         extractStyles: false
    //     }).readFeatures(kmlstring, {
    //         dataProjection: 'EPSG:4326',
    //         featureProjection: 'EPSG:3857'
    //     });

    //     let filteredkmlfeatures = kmlFeatures.filter((feat) => {
    //         return feat.getGeometry()?.getType() == 'LineString';
    //     });

    //     let kmllyr = new VectorLayer({
    //         source: new VectorSource({
    //             features: filteredkmlfeatures
    //         })
    //     });

    //     if(kmllyr.getSource().getFeatures().length > 0){
    //         map.addLayer(kmllyr);
    //         app.appContext.config.globalProperties.$kmllayer = kmllyr;

    //         map.getView().fit(kmllyr.getSource().getExtent());
    //         store.dispatch('setflightlinekmlValidity', true);
    //     } else {
    //         store.dispatch('setflightlinekmlValidity', false);
    //         store.dispatch('setUploadStatusMsg', 'Invalid KML');
    //     }

    //     setTimeout(() => {
    //         store.dispatch('setUploadStatusMsg', '');
    //     }, 5000);
    // }

    // const discardKMLIfany = () => {
    //     let map = app.appContext.config.globalProperties.$map;

    //     if(app.appContext.config.globalProperties.$kmllayer != null){
    //         map.removeLayer(app.appContext.config.globalProperties.$kmllayer);
    //         app.appContext.config.globalProperties.$kmllayer = null;
    //         store.dispatch('setflightlinekmlValidity', false);
    //     }
    // }

    // const loadSHP = (geojson: any) => {
    //     let map = app.appContext.config.globalProperties.$map;

    //     if(app.appContext.config.globalProperties.$shplayer != null){
    //         map.removeLayer(app.appContext.config.globalProperties.$shplayer);
    //     }

    //     let kmllayer = app.appContext.config.globalProperties.$kmllayer;
    //     let kmlextent = kmllayer.getSource().getExtent();

    //     let shpvectorsource = new VectorSource({
    //         features: new GeoJSON({
    //             dataProjection: 'EPSG:4326',
    //             featureProjection: 'EPSG:3857'
    //         }).readFeatures(geojson),
    //     });

    //     let shapefeatures = shpvectorsource.getFeaturesInExtent(kmlextent);

    //     if(shapefeatures.length > 0){
    //         let shplyr = new VectorLayer({
    //             source: new VectorSource({
    //                 features: shapefeatures,
    //             })
    //         });

    //         map.addLayer(shplyr);
    //         app.appContext.config.globalProperties.$shplayer = shplyr;

    //         map.getView().fit(shplyr.getSource().getExtent());
    //         store.dispatch('setshapefileValidity', true);
    //     } else {
    //         store.dispatch('setshapefileValidity', false);
    //         store.dispatch('setUploadStatusMsg', 'Invalid Shapefile for KML');
    //     }

    //     setTimeout(() => {
    //         store.dispatch('setUploadStatusMsg', '');
    //     }, 5000);
    // }

    // const discardSHPIfany = () => {
    //     let map = app.appContext.config.globalProperties.$map;

    //     if(app.appContext.config.globalProperties.$shplayer != null){
    //         map.removeLayer(app.appContext.config.globalProperties.$shplayer);
    //         app.appContext.config.globalProperties.$shplayer = null;
    //         store.dispatch('setshapefileValidity', false);
    //     }
    // }

    // const flightsmanagerfunctions = { fetchNLoadDroneNumbers, loadKarnBounds, loadKML, discardKMLIfany, loadSHP, discardSHPIfany };

    // const loadVillagesWFS = (districtname: any) => {
    //     let url = `http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kgdc:karnvillages&srsname=EPSG:3857&outputFormat=application/json&cql_filter=kgisdist_1='${districtname}'`;

    //     let username = store.getters.getUserName;
    //     let password = store.getters.getPassWord;
    //     doAuthentication(url, username, password)
    //     .then((res: any)=>{
    //         // console.log(res.data);

    //         let villagesGJ = res.data;
    //         addVillagesBoundary(villagesGJ);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    // }

    // const addVillagesBoundary = (villagesGJ: any) => {
    //     let map = app.appContext.config.globalProperties.$map;

    //     if(app.appContext.config.globalProperties.$villagesLayer != null){
    //         map.removeLayer(app.appContext.config.globalProperties.$villagesLayer);
    //     }

    //     let villagesLayer = new VectorLayer({
    //         source: new VectorSource({
    //             features: new GeoJSON().readFeatures(villagesGJ)
    //         }),
    //         style: villagesStyleFunction
    //     });

    //     map.addLayer(villagesLayer);

    //     map.getView().fit(villagesLayer.getSource().getExtent());

    //     app.appContext.config.globalProperties.$villagesLayer = villagesLayer;
    // }

    // const loadFlightsWFS = (districtname: any) => {
    //     let url = `http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kgdc:flightlines&srsname=EPSG:3857&outputFormat=application/json&cql_filter=district='${districtname}'`;

    //     let username = store.getters.getUserName;
    //     let password = store.getters.getPassWord;
    //     doAuthentication(url, username, password)
    //     .then((res: any)=>{
    //         // console.log(res.data);

    //         let fligthsGJ = res.data;
    //         addFlights(fligthsGJ);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    // }

    // const addFlights = (fligthsGJ: any) => {
    //     let map = app.appContext.config.globalProperties.$map;

    //     if(app.appContext.config.globalProperties.$flightsLayer != null){
    //         map.removeLayer(app.appContext.config.globalProperties.$flightsLayer);
    //     }

    //     let flightsLayer = new VectorLayer({
    //         source: new VectorSource({
    //             features: new GeoJSON().readFeatures(fligthsGJ)
    //         }),
    //         style: villagesStyleFunction
    //     });

    //     map.addLayer(flightsLayer);

    //     map.getView().fit(flightsLayer.getSource().getExtent());

    //     app.appContext.config.globalProperties.$flightsLayer = flightsLayer;
    // }

    // const loadShapesWFS = (districtname: any) => {
    //     let url = `http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=kgdc:plannedshapes&srsname=EPSG:3857&outputFormat=application/json&cql_filter=district='${districtname}'`;

    //     let username = store.getters.getUserName;
    //     let password = store.getters.getPassWord;
    //     doAuthentication(url, username, password)
    //     .then((res: any)=>{
    //         // console.log(res.data);

    //         let shapesGJ = res.data;
    //         addShapes(shapesGJ);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    // }

    // const addShapes = (shapesGJ: any) => {
    //     let map = app.appContext.config.globalProperties.$map;

    //     if(app.appContext.config.globalProperties.$shapesLayer != null){
    //         map.removeLayer(app.appContext.config.globalProperties.$shapesLayer);
    //     }

    //     let shapesLayer = new VectorLayer({
    //         source: new VectorSource({
    //             features: new GeoJSON().readFeatures(shapesGJ)
    //         }),
    //         style: villagesStyleFunction
    //     });

    //     map.addLayer(shapesLayer);

    //     map.getView().fit(shapesLayer.getSource().getExtent());

    //     app.appContext.config.globalProperties.$shapesLayer = shapesLayer;
    // }

    // const layermanagerfunction = { loadVillagesWFS, loadFlightsWFS, loadShapesWFS };

    // return { ...flightsmanagerfunctions, ...layermanagerfunction }