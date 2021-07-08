import store from '@/store';

const fileListLoader = () => {

    const loadFilesList = (uniquevillagecode: string) => {
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        let requestObj = {
            request: 'getfilelist',
            uniquevillagecode,
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
                console.log(responseObj.filesList);

            } else {
                console.log('File List Error...')
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