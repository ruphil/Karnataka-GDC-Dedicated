import store from '@/store';

const fileListLoader = () => {

    const loadFilesList = (uniquevillagecode: string) => {
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        let requestObj = {
            request: 'getfilelist',
            validateusername: username,
            validatepassword: password,
        };

        console.log(requestObj);

        let wssURL = store.getters.getFileListAproverServerMOdule;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            // console.log(event.data);
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            if (responseObj.requestStatus == 'success'){
                let gj = responseObj.featureCollection;
                setAbadiLimits(gj);
            } else {
                console.log('Abadis GJ Error...')
            }
            ws.close();
        });

        ws.addEventListener('open', (event) => {
            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }

    const setAbadiLimits = (gj: any) => {
        const map = store.getters.getMapObj;

        let abadiLimits = new VectorLayer({
            source: new VectorSource({
                features: new GeoJSON({
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                }).readFeatures(gj)
            }),
            style: abadisStyleFunction,
            zIndex: 3
        });

        abadiLimits.set('loadedfromserver', 'yes');
        abadiLimits.set('name', 'abadilimits');

        store.dispatch('setAbadiLimitsLoaded', true);

        map.addLayer(abadiLimits);
    }

    const unloadAbadiLimits = () => {
        const map = store.getters.getMapObj;

        try {
            map.getLayers().forEach(function (layer: any) {
                if (layer.get('name') != undefined && layer.get('name') === 'abadilimits') {
                    map.removeLayer(layer);
    
                    store.dispatch('setAbadiLimitsLoaded', false);
                }
            });
        } catch (e) {}
    }

    return { loadAbadiLimits, unloadAbadiLimits }
}

export default fileListLoader;