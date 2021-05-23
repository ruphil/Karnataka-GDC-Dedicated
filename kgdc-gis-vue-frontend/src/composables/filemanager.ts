import socketClient from './socketClient';

const fileuploader = () => {
    const { makeSocketRequestNClose } = socketClient();

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

    return { getfilelist, approvefile }
}

export default fileuploader;