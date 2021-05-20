import globalToast from './globalToast';
import socketClient from './socketClient';

const fileuploader = () => {
    const { showGlobalToast } = globalToast();
    const { makeSocketRequestNClose } = socketClient();

    const uploadfile = (file: any, village: any, details: any) => {
        let filename = file.name;

        let reader = new FileReader();
        reader.onload = function () {
            // console.log(reader.result);
            let arrayBuffer = <ArrayBuffer>reader.result;
            let bytes = new Uint8Array(arrayBuffer);
            console.log(bytes);
            
            let registrationObj = {
                requesttype: 'filesattachment',
                request: 'uploadfile',
                filename,
                village,
                details,
                databytea: bytes
            };
    
            makeSocketRequestNClose(registrationObj)
            .then((responseObj: any) => {
                if (responseObj.requestStatus == 'success'){
                    showGlobalToast('Uploaded File...');
                } else {
                    showGlobalToast('Error Uploading...');
                }
            })
            .catch(() => {
                showGlobalToast('Error Uploading...');
            });
        }
        reader.readAsArrayBuffer(file);
    }

    const getfilelist = () => {
        return new Promise((resolve, reject) => {
            let registrationObj = {
                requesttype: 'filesattachment',
                request: 'getfilelist'
            };
    
            makeSocketRequestNClose(registrationObj)
            .then((responseObj: any) => {
                if (responseObj.requestStatus == 'success'){
                    resolve(responseObj);
                } else {
                    reject('error');
                }
            })
            .catch(() => {
                reject('error');
            });
        });
    }

    return { uploadfile, getfilelist }
}

export default fileuploader;