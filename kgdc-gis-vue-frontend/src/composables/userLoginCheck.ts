import store from '@/store';
import axios, { AxiosResponse } from 'axios';

const userLoginCheck = () => {
    const doAuthentication = (username: string, password: string) => {
        const urlBase = store.getters.getURLBase;

        const url = new URL('/geoserver/kgdc/ows', urlBase);
        url.searchParams.append('service', 'WFS');
        url.searchParams.append('version', '2.0.0');
        url.searchParams.append('request', 'GetCapabilities');
        
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: url.href,
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            })
            .then((res: AxiosResponse) => {
                // console.log(res.status);
                if(res.status == 200){
                    resolve(res);
                } else {
                    reject(res);
                }
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            })
        });
    }

    return { doAuthentication }
}

export default userLoginCheck;