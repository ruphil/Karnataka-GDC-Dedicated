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
        return new Promise((resolve, reject) => {
            const map = store.getters.getMapObj;

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
        const map = store.getters.getMapObj;

        let filename = file.name;
        console.log(filename);

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
                return feat.getGeometry()?.getType() == 'Polygon';
            });
    
            let kmllyr = new VectorLayer({
                source: new VectorSource({
                    features: filteredkmlfeatures
                })
            });

            console.log(kmllyr);
    
            if(kmllyr.getSource().getFeatures().length > 0){
                let uniqueID = uuidv4();
                kmllyr.set('lyrid', uniqueID);

                map.addLayer(kmllyr);
            } else {
                // reject({ validgeometry: false })
            }
        }
        reader.readAsText(file);
    }

    const loadKMLShp = (e: any) => {
        let file = e.target.files[0];
        let fileFullname = file.name;
        let lastDot = fileFullname.lastIndexOf('.');
        let extension = fileFullname.substring(lastDot + 1);
        console.log(fileFullname, extension);

        if (extension != 'kml' && extension != 'zip'){
            showGlobalToast('Invalid File Selected...');
        } else if (extension == 'kml') {
            loadkml(file)
        } 
        else if (extension == 'zip') {
            loadshp(file)
        }
    }

    return { loadKMLShp }
}

export default kmlshpHanlder;
