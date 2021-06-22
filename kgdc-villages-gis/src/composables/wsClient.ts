import store from "@/store";
import { wsMsgHandler } from './wsMsgHandler';

export const makeSocketRequestNClose = (requestObj: any) => {
    return new Promise((resolve, reject) => {
        const { request } = requestObj;

        let wssURL = '';
        
        if(request == 'getroles'){
            wssURL = store.getters.usersModuleWSS;
            console.log(wssURL);
        }

        let ws = new WebSocket(wssURL);
        
        ws.addEventListener('message', (event) => {
            wsMsgHandler(event);
            ws.close();
        });

        ws.addEventListener('error', (event) => {
            reject('error');
        });

        ws.addEventListener('open', (event) => {
            console.log(ws);
            ws.send(btoa(JSON.stringify(requestObj)));
        });
    });
}