import store from "@/store";
import WKT from 'ol/format/WKT';
import GeoJSON from 'ol/format/GeoJSON';

import globalToast from '../composables/globalToast';

const abadiLimitUploader = () => {
    const { showGlobalToast } = globalToast();

    const uploadAbadiLimit = (featureData: any) => {
        // console.log(feature.gjstr);
        // console.log(feature.attributes);

        let geom = featureData.geom;
        let attributes = featureData.attributes;

        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        let district = attributes.userattributedistrictref;
        let uniquevillagecode = store.getters.getCurrentUniqueVillageCode;

        let requestObj = {
            request: 'uploadabadilimit',
            validateusername: username,
            validatepassword: password,
            gjstr: geom,
            attributes,
            district,
            uniquevillagecode
        }

        console.log(requestObj);

        let wssURL = store.getters.getAbadiModuleWSS;
        let ws = new WebSocket(wssURL);
    
        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);

            if(responseObj.requestStatus == 'success'){
                showGlobalToast('Abadi Limit Uploaded');
            } else {
                showGlobalToast('Error Uploading Abadi Limit');
            }

            ws.close();
        });

        ws.addEventListener('open', (event) => {
            ws.send(btoa(JSON.stringify(requestObj)));
        });
    }

    return { uploadAbadiLimit };
}

export default abadiLimitUploader;