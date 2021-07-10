import { useStore } from 'vuex';

import WFS from 'ol/format/WFS';

import { getCurrentInstance } from '@vue/runtime-core';
import axios, { AxiosResponse } from 'axios';
import { Feature } from 'ol';

const featureUploader = () => {
    const app = getCurrentInstance()!;
    const store = useStore();

    const addAttributesNInsertToFlightline = (flightline: any, attributesInfo: any) => {
        flightline.setProperties(attributesInfo);
        // console.log(flightline);

        let formatWFS = new WFS();

        let formatGML = {
            featureNS: 'https://surveyofindia.gov.in/',
            featureType: 'kgdc:flightlines',
            srsName: 'EPSG:3857',
            version: '2.0.0',
            featurePrefix: '',
            nativeElements: []
        };

        let node = formatWFS.writeTransaction([flightline], [], [], formatGML);
        let s = new XMLSerializer();
        let str = s.serializeToString(node);
        // console.log(str);

        let username = store.getters.getUserName;
        let password = store.getters.getPassWord;

        axios({
            method: 'POST',
            url: 'http://localhost:8080/geoserver/ows?service=wfs&version=2.0.0&request=GetCapabilities',
            headers: {
                // 'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
                'Content-Type': 'text/xml',
            },
            data: str
        })
        .then((res: AxiosResponse) => {
            // console.log(res);
            console.log(res.status);
            store.dispatch('setUploadStatusMsg', 'Uploaded Successfully...');
        })
        .catch((error) => {
            console.log(error);
            store.dispatch('setUploadStatusMsg', 'Error Uploading...');
        })
        .finally(() => {
            setTimeout(() => {
                store.dispatch('setUploadStatusMsg', '');
            }, 5000);
        });
    }

    const handleKMLLayer = (attributesInfo: any) => {
        let kmllayer = app.appContext.config.globalProperties.$kmllayer;
        if(kmllayer != null){
            let features = kmllayer.getSource().getFeatures();
            
            let flightline = features[0];

            let geometry = flightline.getGeometry();

            let properties = flightline.getProperties();
            for (let prop in properties) {
                flightline.unset(prop);
            }
            
            flightline.set('geom', geometry);
            flightline.setGeometryName('geom');

            addAttributesNInsertToFlightline(flightline, attributesInfo);
        } else {
            let flightline = new Feature();
            addAttributesNInsertToFlightline(flightline, attributesInfo);
        }
    }

    const addAttributesNInsertToShapefile = (shpfeature: any, attributesInfo: any) => {
        shpfeature.set('flightid', attributesInfo['flightid']);
        shpfeature.set('username', attributesInfo['username']);
        console.log(shpfeature);

        let formatWFS = new WFS();

        let formatGML = {
            featureNS: 'https://surveyofindia.gov.in/',
            featureType: 'kgdc:plannedshapes',
            srsName: 'EPSG:3857',
            version: '2.0.0',
            featurePrefix: '',
            nativeElements: []
        };

        let node = formatWFS.writeTransaction([shpfeature], [], [], formatGML);
        let s = new XMLSerializer();
        let str = s.serializeToString(node);
        // console.log(str);

        let username = store.getters.getUserName;
        let password = store.getters.getPassWord;

        axios({
            method: 'POST',
            url: 'http://localhost:8080/geoserver/ows?service=wfs&version=2.0.0&request=GetCapabilities',
            headers: {
                // 'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
                'Content-Type': 'text/xml',
            },
            data: str
        })
        .then((res: AxiosResponse) => {
            // console.log(res);
            console.log(res.status);
            setTimeout(() => {
                store.dispatch('setUploadStatusMsg', 'Uploaded Successfully...');
            }, 1000);
        })
        .catch((error) => {
            console.log(error);
            store.dispatch('setUploadStatusMsg', 'Error Uploading Shape...');
        })
        .finally(() => {
            setTimeout(() => {
                store.dispatch('setUploadStatusMsg', '');
            }, 5000);
        });
    }

    const handleSHPLayer = (attributesInfo: any) => {
        let shplayer = app.appContext.config.globalProperties.$shplayer;
        if(shplayer != null){
            let features = shplayer.getSource().getFeatures();
            
            for(let i = 0; i < features.length; i++){
                let currentfeature = features[i];
                let geometry = currentfeature.getGeometry();

                let properties = currentfeature.getProperties();
                for (let prop in properties) {
                    currentfeature.unset(prop);
                }

                currentfeature.set('geom', geometry);
                currentfeature.setGeometryName('geom');

                addAttributesNInsertToShapefile(currentfeature, attributesInfo);
            }
        }
    }

    const uploadDataToWFS = () => {
        let attributesInfo = store.getters.getAttributesInfo;
        let validAttributes = store.getters.getAttributesValidity;
        if(Object.keys(attributesInfo).length > 0 && validAttributes){
            handleKMLLayer(attributesInfo);
            // handleSHPLayer(attributesInfo);
        }
    }

    return { uploadDataToWFS }
}

export default featureUploader;