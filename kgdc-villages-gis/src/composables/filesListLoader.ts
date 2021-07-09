import store from '@/store';

const fileListLoader = () => {

    const loadFilesList = () => {
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;
        const uniquevillagecode = store.getters.getCurrentUniqueVillageCode;

        let requestObj = {
            request: 'getfilelist',
            uniquevillagecode,
            validateusername: username,
            validatepassword: password,
        };

        console.log(requestObj);

        let wssURL = store.getters.getFileListApproverServerModule;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            // console.log(event.data);
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            if (responseObj.requestStatus == 'success'){
                store.dispatch('setFilesList', responseObj.fileslist);
            } else {
                console.log('File List Error...');
            }
            ws.close();
        });

        ws.addEventListener('open', (event) => {
            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }

    return { loadFilesList }
}

export default fileListLoader;