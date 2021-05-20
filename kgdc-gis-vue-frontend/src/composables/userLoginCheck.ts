import store from '@/store';
import axios, { AxiosResponse } from 'axios';

const userLoginCheck = () => {
    const doAuthentication = (username: string, password: string) => {
        
        return new Promise((resolve, reject) => {
            const wsurlBase = store.getters.getWSURLBase;
            console.log(wsurlBase);

            let ws = new WebSocket(wsurlBase);
            ws.addEventListener('message', (event) => {
                // console.log(event.data);
                let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
                // console.log(responseObj);
                if (responseObj.requestStatus == 'success'){
                    resolve(responseObj);
                } else {
                    reject(responseObj);
                }
                
                ws.close();
            });
            ws.addEventListener('open', (event) => {
                let registrationObj = {
                    requesttype: 'usermanagement',
                    request: 'getroles',
                    username,
                    password,
                    roleSingle: 'ALL'
                }
                ws.send(Buffer.from(JSON.stringify(registrationObj)).toString('base64'));
            });
        });
    }

    return { doAuthentication }
}

export default userLoginCheck;