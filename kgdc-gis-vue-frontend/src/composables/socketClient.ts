import store from "@/store";

const socketClient = () => {
    const makeSocketRequestNClose = (requestObj: any) => {
        return new Promise((resolve, reject) => {
            const wsurlBase = store.getters.getWSURLBase;
            console.log(wsurlBase);

            let ws = new WebSocket(wsurlBase);
            ws.addEventListener('message', (event) => {
                // console.log(event.data);
                let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
                console.log(responseObj);
                ws.close();
                resolve(responseObj);
            });

            ws.addEventListener('error', (event) => {
                reject('error')
            });

            ws.addEventListener('open', (event) => {
                ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
            });
        });
    }

    return { makeSocketRequestNClose }
}

export default socketClient;