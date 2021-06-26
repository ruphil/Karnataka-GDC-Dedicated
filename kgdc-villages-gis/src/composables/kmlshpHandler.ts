import globalToast from '../composables/globalToast';

import KML from 'ol/format/KML';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import shp from 'shpjs';
import { v4 as uuidv4 } from 'uuid';
import store from '@/store';

const kmlshpHanlder = () => {
    const { showGlobalToast } = globalToast();

    const loadshp = (file: any) => {
        const map = store.getters.getMapObj;

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
        
                let filteredshpfeatures = shpFeatures.filter((feat: any) => {
                    return feat.getGeometry()?.getType() == 'Polygon';
                });
    
                let feature = filteredshpfeatures[0];
                console.log(feature);
    
                let cond1 = shpFeatures.length != 0;
                let cond2 = filteredshpfeatures.length != 0;
                let cond3 = feature != undefined && feature != null;
    
                if(cond1 && cond2 && cond3){
                    let shplyr = new VectorLayer({
                        source: new VectorSource({
                            features: [feature]
                        })
                    });
        
                    let uniqueID = uuidv4();
                    shplyr.set('lyrid', uniqueID);
                    map.addLayer(shplyr);
        
                    const featuresData = store.getters.getFeaturesData;
        
                    let newfeatureGJ = new GeoJSON().writeFeature(feature, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857'
                    });
                    
                    console.log(newfeatureGJ);
        
                    let modFeaturesData = [
                        ...featuresData,
                        {
                            featurename: filename,
                            lyrid: uniqueID,
                            gjstr: newfeatureGJ,
                            attributes: {}
                        }
                    ]
                    
                    store.dispatch('setFeaturesData', modFeaturesData);
                } else {
                    showGlobalToast('Shape Zip File is not valid');
                }
            }).catch(() => {
                showGlobalToast('Shape Zip File is not valid');
            });
        }
        reader.readAsArrayBuffer(file);
    }

    const loadkml = (file: any) => {
        const map = store.getters.getMapObj;

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
    
            let filteredkmlfeatures = kmlFeatures.filter((feat: any) => {
                return feat.getGeometry()?.getType() == 'Polygon';
            });

            let feature = filteredkmlfeatures[0];
            console.log(feature);

            let cond1 = kmlFeatures.length != 0;
            let cond2 = filteredkmlfeatures.length != 0;
            let cond3 = feature != undefined && feature != null;

            if(cond1 && cond2 && cond3){
                let kmllyr = new VectorLayer({
                    source: new VectorSource({
                        features: [feature]
                    })
                });
    
                let uniqueID = uuidv4();
                kmllyr.set('lyrid', uniqueID);
                map.addLayer(kmllyr);
    
                const featuresData = store.getters.getFeaturesData;
    
                let newfeatureGJ = new GeoJSON().writeFeature(feature, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                
                console.log(newfeatureGJ);
    
                let modFeaturesData = [
                    ...featuresData,
                    {
                        featurename: filename,
                        lyrid: uniqueID,
                        gjstr: newfeatureGJ,
                        attributes: {}
                    }
                ]
                
                store.dispatch('setFeaturesData', modFeaturesData);
            } else {
                showGlobalToast('KML File is not valid');
            }
        }
        reader.readAsText(file);
    }

    const loadKMLShp = (e: any) => {
        let file = e.target.files[0];
        let fileFullname = file.name;
        let lastDot = fileFullname.lastIndexOf('.');
        let extension = fileFullname.substring(lastDot + 1);
        // console.log(fileFullname, extension);

        if (extension != 'kml' && extension != 'zip'){
            showGlobalToast('Invalid File.. Only kml or zip files are allowed...');
        } else if (extension == 'kml') {
            loadkml(file);
        } 
        else if (extension == 'zip') {
            loadshp(file);
        }
    }

    return { loadKMLShp }
}

export default kmlshpHanlder;
