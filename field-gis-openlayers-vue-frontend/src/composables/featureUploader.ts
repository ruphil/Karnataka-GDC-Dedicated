import { useStore } from 'vuex';

import WFS from 'ol/format/WFS';

import { getCurrentInstance } from '@vue/runtime-core';
import axios, { AxiosResponse } from 'axios';
import { Feature } from 'ol';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import GeometryLayout from 'ol/geom/GeometryLayout';

const featureUploader = () => {
    const app = getCurrentInstance()!;
    const store = useStore();

    const buildNInsert = (flightline: any, attributesInfo: any) => {
        flightline.setProperties(attributesInfo);
        console.log(flightline);

        let formatWFS = new WFS();

        let formatGML = {
            featureNS: 'https://surveyofindia.gov.in/',
            featureType: 'flightlines',
            srsName: 'EPSG:3857',
            version: '2.0.0',
            featurePrefix: '',
            nativeElements: []
        };

        let node = formatWFS.writeTransaction([flightline], [], [], formatGML);
        let s = new XMLSerializer();
        let str = s.serializeToString(node);
        
        console.log(str);

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
            console.log(res);
            console.log(res.status);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const uploadDataToWFS = () => {
        let attributesInfo = store.getters.getAttributesInfo;
        let validAttributes = store.getters.getAttributesValidity;
        if(Object.keys(attributesInfo).length > 0 && validAttributes){
            let username = store.getters.getUserName;
            let password = store.getters.getPassWord;

            if(app.appContext.config.globalProperties.$kmllayer != null){
                let kmllayer = app.appContext.config.globalProperties.$kmllayer;
                let features = kmllayer.getSource().getFeatures();
                
                let flightline = features[0];

                let geometry = flightline.getGeometry();

                let properties = flightline.getProperties();
                for (let prop in properties) {
                    flightline.unset(prop);
                }
                
                flightline.set('geom', geometry);
                flightline.setGeometryName('geom');

                buildNInsert(flightline, attributesInfo);
            } else {
                let flightline = new Feature();
                buildNInsert(flightline, attributesInfo);
            }
        } else {
            store.dispatch('setAttributesValidity', false);
        }
    }

    return { uploadDataToWFS }
}

export default featureUploader;