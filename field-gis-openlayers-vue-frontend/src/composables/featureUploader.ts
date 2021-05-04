import WFS from 'ol/format/WFS';
import GML from 'ol/format/GML';

import { getCurrentInstance } from '@vue/runtime-core';

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

            // let formatWFS2 = new WFS();
            // let pointGML = GML({
            //     featureNS: 'https://surveyofindia.gov.in/',
            //     featureType: 'chamber2',
            //     srsName: 'EPSG:3857'
            // });

            // let node = formatWFS2.writeTransaction([f],null,null,pointGML);
        }
    }

    return { uploadKMLFeature }
}

export default featureUploader;