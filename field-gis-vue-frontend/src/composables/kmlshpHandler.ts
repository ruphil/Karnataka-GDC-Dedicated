import { getCurrentInstance } from '@vue/runtime-core';
import globalToast from '../composables/globalToast';

import KML from 'ol/format/KML';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

import shp from 'shpjs';
import { v4 as uuidv4 } from 'uuid';

const kmlshpHanlder = () => {
    const app = getCurrentInstance()!;
    const { showGlobalToast } = globalToast();

    const loadshp = (file: any) => {
        return new Promise((resolve, reject) => {
            const map = app.appContext.config.globalProperties.$map;

            let filename = file.name;

            let reader = new FileReader();
            reader.onload = function () {
                let shpBuffer = <ArrayBuffer>reader.result;
                shp(shpBuffer).then((geojson:any) => {
                    console.log(geojson);

                    let shpvectorsource = new VectorSource({
                        features: new GeoJSON({
                            dataProjection: 'EPSG:4326',
                            featureProjection: 'EPSG:3857'
                        }).readFeatures(geojson),
                    });

                    if(shpvectorsource.getFeatures().length > 0){
                        let shplyr = new VectorLayer({
                            source: shpvectorsource
                        });

                        let uniqueID = uuidv4();
                        shplyr.set('lyrid', uniqueID);

                        map.addLayer(shplyr);

                        resolve({
                            id: uniqueID,
                            validgeometry: true,
                            filename,
                            validattributes: false,
                            layer: shplyr,
                            attributes: {}
                        });
                    } else {
                        reject({ validgeometry: false })
                    }
                });
            }
            reader.readAsArrayBuffer(file);
        });

    }

    const loadkml = (file: any) => {
        return new Promise((resolve, reject) => {
            const map = app.appContext.config.globalProperties.$map;

            let filename = file.name;

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
                    let uniqueID = uuidv4();
                    kmllyr.set('lyrid', uniqueID);

                    map.addLayer(kmllyr);

                    resolve({
                        id: uniqueID,
                        validgeometry: true,
                        filename,
                        validattributes: false,
                        layer: kmllyr,
                        attributes: {}
                    });
                } else {
                    reject({ validgeometry: false })
                }
            }
            reader.readAsText(file);
        });
    }

    const loadFilePromise = (file: any) => {
        return new Promise((resolve, reject) => {
            let fileFullname = file.name;
            let lastDot = fileFullname.lastIndexOf('.');
            let extension = fileFullname.substring(lastDot + 1);

            if (extension != 'kml' && extension != 'zip'){
                showGlobalToast('Invalid File Selected...');
                reject({ validgeometry: false });
            } else if (extension == 'kml') {
                loadkml(file)
                .then(res => resolve(res))
                .catch(() => reject({ validgeometry: false }))
            } 
            else if (extension == 'zip') {
                loadshp(file)
                .then(res => resolve(res))
                .catch(() => reject({ validgeometry: false }))
            }
        });
    }

    const zoomToLayer = (lyrid: any) => {
        const map = app.appContext.config.globalProperties.$map;
        
        try{
            map.getLayers().forEach((lyr: any) => {
                if (lyr.get('lyrid') == lyrid) {
                    map.getView().fit(lyr.getSource().getExtent());
                }
            });
        } catch (e) {
            showGlobalToast('Processing Layer in Background... Please Try Again in Seconds...');
        }
    }

    const discardLayerFromMap = (lyrid: any) => {
        const map = app.appContext.config.globalProperties.$map;
        console.log(map.getInteractions());
        
        try{
            map.getLayers().forEach((lyr: any) => {
                if (lyr.get('lyrid') == lyrid) {
                    map.removeLayer(lyr);
                }
            });
        } catch (e) {
            showGlobalToast('Processing Layer in Background... Please Try Again in Seconds...');
        }
    }

    return { loadFilePromise, zoomToLayer, discardLayerFromMap }
}

export default kmlshpHanlder;
