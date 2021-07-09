import store from '@/store';

import globalToast from '../composables/globalToast';

const approverFilesList = () => {
    const { showGlobalToast } = globalToast();

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

        let wssURL = store.getters.getAbadiModuleWSS;
        let ws = new WebSocket(wssURL);
    
        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);

            if(responseObj.requestStatus == 'success'){
                showGlobalToast('Abadi Limit Approved');

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
        const filesList = store.getters.getFilesList;
        // console.log(filesList);

        let reqdfeature: any = filesList.attachmentlist.find((feature: any) => {
            return feature.id == id;
        });

        let filelocation = reqdfeature.filelocation + '.' + reqdfeature.filetype;

    }

    return { approveKML, approveAttachment }
}

export default approverFilesList;
