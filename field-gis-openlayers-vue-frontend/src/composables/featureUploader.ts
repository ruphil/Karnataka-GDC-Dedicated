import { useStore } from 'vuex';

import WFS from 'ol/format/WFS';

import { getCurrentInstance } from '@vue/runtime-core';
import axios, { AxiosResponse } from 'axios';
import { Feature } from 'ol';

const featureUploader = () => {
    const app = getCurrentInstance()!;
    const store = useStore();

    const uploadDataToWFS = () => {
        let attributesInfo = store.getters.getAttributesInfo;
        let validAttributes = store.getters.getAttributesValidity;
        if(Object.keys(attributesInfo).length > 0 && validAttributes){
            let username = store.getters.getUserName;
            let password = store.getters.getPassWord;
            let attributesInfo = store.getters.getAttributesInfo;

            let flightline = new Feature();
            if(app.appContext.config.globalProperties.$kmllayer != null){
                let kmllayer = app.appContext.config.globalProperties.$kmllayer;
                let features = kmllayer.getSource().getFeatures();
                
                flightline = features[0];

                let geometry = flightline.getGeometry();

                let properties = flightline.getProperties();
                for (let prop in properties) {
                    flightline.unset(prop);
                }
                
                flightline.set('geom', geometry);
                flightline.setGeometryName('geom');
            }

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
    }

    return { uploadDataToWFS }
}

export default featureUploader;