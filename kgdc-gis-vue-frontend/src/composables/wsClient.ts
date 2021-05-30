import store from "@/store";
import { wsMsgHandler } from './wsClientMsgHandler';

const webSocketClient = () => {
    const openSocketClientIfNotExists = () => {
        return new Promise((resolve, reject) => {
            const wsClient = store.getters.getWSURLBase;
            if(wsClient.readyState === WebSocket.CLOSED){
                console.log('Socket Closed, Opening New...');
                const wsurlBase = store.getters.getWSURLBase;
                console.log(wsurlBase);

                let ws = new WebSocket(wsurlBase);
                ws.addEventListener('message', (event) => {
                    wsMsgHandler(event);
                });

                ws.addEventListener('error', (event) => {
                    reject('error');
                });

                ws.addEventListener('open', (event) => {
                    resolve('success');
                });
            } else {
                console.log('Socket Already Open...');
                resolve('success');
            }
        });
    }

    return { openSocketClientIfNotExists }
}

export default webSocketClient;