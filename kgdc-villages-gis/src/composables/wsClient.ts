import store from "@/store";
import { wsMsgHandler } from './wsClientMsgHandler';

export const openSocketClientIfNotExists = (username: any, password: any) => {
    return new Promise((resolve, reject) => {
        const wsClient = store.getters.getWSClient;

        if(wsClient != null && wsClient.readyState === WebSocket.OPEN){
            console.log('Socket Already Open...');
            resolve('success');
        } else {
            console.log('Socket Closed, Opening New...');
            const wsurlBase = store.getters.getWSURLBase;
            
            let wsFullUrl = `${wsurlBase}?username=${username}&password=${password}`;
            console.log(wsFullUrl);

            let ws = new WebSocket(wsFullUrl);
            ws.addEventListener('message', (event) => {
                wsMsgHandler(event);
            });

            ws.addEventListener('error', (event) => {
                reject('error');
            });

            ws.addEventListener('open', (event) => {
                resolve('success');
            });

            store.dispatch('setSocketClient', ws);
        }
    });
}

export const makeSocketRequest = (requestObj: any) => {
    return new Promise((resolve, reject) => {
        const { username, password } = requestObj;

        openSocketClientIfNotExists(username, password)
        .then(() => {
            const wsClient = store.getters.getWSClient;
            wsClient.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
            resolve('success');
        })
        .catch(() => {
            reject('error');
        })
    });
}