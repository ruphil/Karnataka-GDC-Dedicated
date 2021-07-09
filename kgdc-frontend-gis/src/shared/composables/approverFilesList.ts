import store from '@/shared/store';

import globalToast from './globalToast';
import filesListLoader from '@/shared/composables/filesListLoader';

const approverFilesList = () => {
    const { showGlobalToast } = globalToast();
    const { loadFilesList } = filesListLoader();

    const approveKML = (gid: any) => {
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        let requestObj = {
            request: 'approveabadilimit',
            validateusername: username,
            validatepassword: password,
            gid
        }

        console.log(requestObj);

        let wssURL = store.getters.getFileListApproverServerModule;
        let ws = new WebSocket(wssURL);
    
        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);

            if(responseObj.requestStatus == 'success'){
                showGlobalToast('Abadi Limit Approved');
                loadFilesList();
            } else {
                showGlobalToast('Error Approving Abadi Limit');
            }

            ws.close();
        });

        ws.addEventListener('open', (event) => {
            ws.send(btoa(JSON.stringify(requestObj)));
        });
    }

    const approveAttachment = (id: any) => {
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        let requestObj = {
            request: 'approvefileattachment',
            validateusername: username,
            validatepassword: password,
            id
        }

        console.log(requestObj);

        let wssURL = store.getters.getFileListApproverServerModule;
        let ws = new WebSocket(wssURL);
    
        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);

            if(responseObj.requestStatus == 'success'){
                showGlobalToast('File Approved');
                loadFilesList();
            } else {
                showGlobalToast('Error Approving File');
            }

            ws.close();
        });

        ws.addEventListener('open', (event) => {
            ws.send(btoa(JSON.stringify(requestObj)));
        });

    }

    return { approveKML, approveAttachment }
}

export default approverFilesList;
