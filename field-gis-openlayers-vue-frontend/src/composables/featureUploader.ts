import WFS from 'ol/format/WFS';
import GML from 'ol/format/GML';

import { getCurrentInstance } from '@vue/runtime-core';
import axios, { AxiosResponse } from 'axios';

const featureUploader = () => {
    const app = getCurrentInstance()!;

    const uploadKMLFeature = (username: string, password: string, attributesInfo: Object) => {
        if(Object.keys(attributesInfo).length > 0){
            let attributes = Object.keys(attributesInfo);
            
            let kmllayer = app.appContext.config.globalProperties.$kmllayer;
            let features = kmllayer.getSource().getFeatures();
            let flightline = features[0];

            let properties = flightline.getProperties();
            for (let prop in properties) {
                if(prop != 'geometry') flightline.unset(prop);
            }
            
            flightline.setProperties(attributesInfo);
            console.log(flightline);

            let formatWFS = new WFS();
            // let formatGML = GML({
            //     featureNS: 'http://www.opengis.net/cite',
            //     // featureType: 'playa_sample',
            //     featureType: 'NARAYANGARH',
            //     srsName: 'EPSG:3857'
            // });

            let formatGML = {
                featureNS: 'https://surveyofindia.gov.in/',
                featureType: 'kgdc:flightlines',
                srsName: 'EPSG:3857',
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