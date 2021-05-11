import store from '@/store';
import axios, { AxiosResponse } from 'axios';

const featuresService = () => {
    const getJSONFeatures = (typeName: string) => {
        const urlBase = store.getters.getURLBase;
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        const url = new URL('/geoserver/kgdc/ows', urlBase);
        url.searchParams.append('service', 'WFS');
        url.searchParams.append('version', '2.0.0');
        url.searchParams.append('request', 'GetFeature');
        url.searchParams.append('typeName', typeName);
        url.searchParams.append('srsname', 'EPSG:3857');
        url.searchParams.append('outputFormat', 'application/json');
        // console.log(url);

        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: url.href,
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            })
            .then((jsonResponse: AxiosResponse) => {
                // console.log(res.status);
                if(jsonResponse.status == 200){
                    resolve(jsonResponse);
                } else {
                    reject(jsonResponse);
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })
        });
    }

    return { getJSONFeatures }
}

export default featuresService;