import globalToast from './globalToast';
import socketClient from './socketClient';

const fileuploader = () => {
    const { showGlobalToast } = globalToast();
    const { makeSocketRequestNClose } = socketClient();

    const uploadfile = (file: any, village: any, details: any, currentuniquevillagecode: any) => {
        return new Promise((resolve, reject) => {
            let filename = file.name;

            let reader = new FileReader();
            reader.onload = function () {
                // console.log(reader.result);
                let arrayBuffer = <ArrayBuffer>reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                // console.log(bytes);
                
                let registrationObj = {
                    requesttype: 'filesattachment',
                    request: 'uploadfile',
                    filename,
                    village,
                    details,
                    currentuniquevillagecode,
                    databytea: bytes
                };
        
                makeSocketRequestNClose(registrationObj)
                .then((responseObj: any) => {
                    if (responseObj.requestStatus == 'success'){
                        resolve(0);
                    } else {
                        reject(1);
                    }
                })
                .catch(() => {
                    reject(1);
                });
            }
            reader.readAsArrayBuffer(file);
        });
    }

    const getfilelist = (village: any) => {
        return new Promise((resolve, reject) => {
            let registrationObj = {
                requesttype: 'filesattachment',
                request: 'getfilelist',
                village
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