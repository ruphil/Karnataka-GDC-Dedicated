import KML from 'ol/format/KML';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import shp from 'shpjs';
import { v4 as uuidv4 } from 'uuid';
import JSZip from 'jszip';

import store from '@/store';

import globalToast from '../composables/globalToast';

const kmlshpHanlder = () => {
    const { showGlobalToast } = globalToast();

    const handleFeature = (features: any, filename: any) => {
        const map = store.getters.getMapObj;

        let filteredFeatures = features.filter((feat: any) => {
            return feat.getGeometry()?.getType() == 'Polygon';
        });

        let feature = filteredFeatures[0];
        // console.log(feature);

        let cond1 = features.length != 0;
        let cond2 = filteredFeatures.length != 0;
        let cond3 = feature != undefined && feature != null;

        if(cond1 && cond2 && cond3){
            let lyr = new VectorLayer({
                source: new VectorSource({
                    features: [feature]
                }),
                zIndex: 3
            });

            let uniqueID = uuidv4();
            lyr.set('lyrid', uniqueID);
            lyr.set('name', 'featurelyr');

            map.addLayer(lyr);

            const featuresData = store.getters.getFeaturesData;

            let featureGeometry = feature.getGeometry();
        
            let newfeatGeom = new GeoJSON().writeGeometry(featureGeometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            
            // console.log(newfeatGeom);

            let modFeaturesData = [
                ...featuresData,
                {
                    featurename: filename,
                    lyrid: uniqueID,
                    geom: newfeatGeom,
                    attributes: {},
                    uploaded: false
                }
            ]
            
            store.dispatch('setFeaturesData', modFeaturesData);
        } else {
            showGlobalToast('KML File is not valid');
        }
    }

    const loadshp = (file: any) => {
        let filename = file.name;

        let reader = new FileReader();
        reader.onload = function () {
            let shpBuffer = <ArrayBuffer>reader.result;
            shp(shpBuffer).then((geojson:any) => {
                console.log(geojson);

                let shpFeatures = new GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                }).readFeatures(geojson)
        
                handleFeature(shpFeatures, filename);

            }).catch(() => {
                showGlobalToast('Shape Zip File is not valid');
            });
        }
        reader.readAsArrayBuffer(file);
    }

    const loadkml = (file: any) => {
        let filename = file.name;
        // console.log(filename);

        let reader = new FileReader();
        reader.onload = function () {

            let kmlstring = reader.result!;
            
            let kmlFeatures = new KML({
                extractStyles: false
            }).readFeatures(kmlstring, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
    
            handleFeature(kmlFeatures, filename);
        }
        reader.readAsText(file);
    }

    const loadkmz = (file: any) => {
        let zip = new JSZip();

        let filename = file.name;
        // console.log(filename);

        let reader = new FileReader();
        reader.onload = function () {

            let kmzipbuffer = reader.result!;
            zip.loadAsync(kmzipbuffer)
            .then((zip) => {
                let kmlFile = zip.file(/.kml$/i)[0];    

                if (kmlFile) {
                    kmlFile.async('text')
                    .then((kmlstring) => {
                        // console.log(kmlstring);
                        let kmlFeatures = new KML({
                            extractStyles: false
                        }).readFeatures(kmlstring, {
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857'
                        });
                
                        handleFeature(kmlFeatures, filename);
                    }).catch(() => {
                        showGlobalToast('Invalid KMZ File...');
                    });
                }
            }).catch(() => {
                showGlobalToast('Invalid KMZ File...');
            });
        }
        reader.readAsArrayBuffer(file);
    }

    const loadKMLShp = (e: any) => {
        const villagesBoundsLoaded = store.getters.getVillagesBoundsLoaded;
        if(!villagesBoundsLoaded){
            showGlobalToast('Load Villages Layer First');
            e.target.value = '';
            return 0;
        }

        let file = e.target.files[0];
        let fileFullname = file.name;
        let lastDot = fileFullname.lastIndexOf('.');
        let extension = fileFullname.substring(lastDot + 1);
        // console.log(fileFullname, extension);

        if (extension != 'kml' && extension != 'kmz' && extension != 'zip'){
            showGlobalToast('Invalid File.. Only kml / kmz or shapefiles zip are allowed...');
        } else if (extension == 'kml') {
            loadkml(file);
        } else if (extension == 'kmz') {
            loadkmz(file);
        }
        else if (extension == 'zip') {
            loadshp(file);
        }
    }

    return { loadKMLShp }
}

export default kmlshpHanlder;
