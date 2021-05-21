import globalToast from './globalToast';
import socketClient from './socketClient';

const fileuploader = () => {
    const { showGlobalToast } = globalToast();
    const { makeSocketRequestNClose } = socketClient();

    const uploadfile = (file: any, village: any, details: any, currentuniquevillagecode: any, mimetype: any, rolecalculated: any, uploadedby: any) => {
        return new Promise((resolve, reject) => {
            let filename = file.name;

            let reader = new FileReader();
            reader.onload = function () {
                // console.log(reader.result);
                let arrayBuffer = <ArrayBuffer>reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                // console.log(bytes);
                
                let requestObj = {
                    requesttype: 'filesattachment',
                    request: 'uploadfile',
                    filename,
                    village,
                    details,
                    currentuniquevillagecode,
                    databytea: bytes,
                    mimetype,
                    rolecalculated,
                    uploadedby
                };
        
                makeSocketRequestNClose(requestObj)
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

    const getfilelist = (village: any, currentuniquevillagecode: any) => {
        return new Promise((resolve, reject) => {
            let requestObj = {
                requesttype: 'filesattachment',
                request: 'getfilelist',
                village,
                currentuniquevillagecode
            };
    
            makeSocketRequestNClose(requestObj)
            .then((responseObj: any) => {
                resolve(responseObj);
            })
            .catch(() => {
                reject('error');
            });
        });
    }

    const approvefile = (fileid: any) => {
        return new Promise((resolve, reject) => {
            let requestObj = {
                requesttype: 'filesattachment',
                request: 'approvefile',
                fileid
            };
    
            makeSocketRequestNClose(requestObj)
            .then((responseObj: any) => {
                resolve(responseObj);
            })
            .catch(() => {
                reject('error');
            });
        });
    }

    const downloadfile = (fileid: any) => {

    }

    return { uploadfile, getfilelist, approvefile, downloadfile }
}

export default fileuploader;