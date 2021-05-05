import { useStore } from 'vuex';

import WFS from 'ol/format/WFS';

import { getCurrentInstance } from '@vue/runtime-core';
import axios, { AxiosResponse } from 'axios';

const featureUploader = () => {
    const app = getCurrentInstance()!;

    const uploadKMLFeature = (username: string, password: string) => {
        const store = useStore();
        
        let attributesInfo = store.getters.getAttributesInfo;
        if(Object.keys(attributesInfo).length > 0){
            let kmllayer = app.appContext.config.globalProperties.$kmllayer;
            let features = kmllayer.getSource().getFeatures();
            let flightline = features[0];

            let geometry = flightline.getGeometry();

            let properties = flightline.getProperties();
            for (let prop in properties) {
                flightline.unset(prop);
            }
            
            flightline.setProperties(attributesInfo);
            flightline.set('geom', geometry);
            flightline.setGeometryName('geom');
            // flightline.setGeometryName('geometry');
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

    return { uploadKMLFeature }
}

export default featureUploader;