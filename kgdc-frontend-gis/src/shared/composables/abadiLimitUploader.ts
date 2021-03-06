import store from '../store';

import globalToast from './globalToast';

const abadiLimitUploader = () => {
    const { showGlobalToast } = globalToast();

    const tryToUploadAbadiLimit = (lyrid: any) => {
        const featuresData = store.getters.getFeaturesData;

        let reqdfeature: any = featuresData.find((feature: any) => {
            return feature.lyrid == lyrid;
        });

        let reqdfeatureIndex: any = featuresData.findIndex((feature: any) => {
            return feature.lyrid == lyrid;
        });

        let attributes = reqdfeature.attributes;
        let geom = reqdfeature.geom;

        let district = attributes.userattributedistrictref;
        let gisselectedvillage = store.getters.getCurrentVillage;
        let uniquevillagecode = store.getters.getCurrentUniqueVillageCode;

        if(district != '' && uniquevillagecode != ''){
            const username = store.getters.getUsername;
            const password = store.getters.getPassword;

            let requestObj = {
                request: 'uploadabadilimit',
                validateusername: username,
                validatepassword: password,
                gjstr: geom,
                attributes,
                district,
                gisselectedvillage,
                uniquevillagecode
            };

            console.log(requestObj);

            let wssURL = store.getters.getAbadiModuleWSS;
            let ws = new WebSocket(wssURL);
        
            ws.addEventListener('message', (event) => {
                let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
                console.log(responseObj);

                if(responseObj.requestStatus == 'success'){
                    showGlobalToast('Abadi Limit Uploaded');

                    featuresData[reqdfeatureIndex].uploaded = true;
                    
                    store.dispatch('setFeaturesData', featuresData);

                } else {
                    showGlobalToast('Error Uploading Abadi Limit');
                }

                ws.close();
            });

            ws.addEventListener('open', (event) => {
                ws.send(btoa(JSON.stringify(requestObj)));
            });
        } else {
            showGlobalToast('Kindly Select Village and District for the feature');
        }
    }

    return { tryToUploadAbadiLimit };
}

export default abadiLimitUploader;