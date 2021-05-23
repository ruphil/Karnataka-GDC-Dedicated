const filewsloadupdown = () => {
    function b64EncodeUnicode(str: any) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode(parseInt(p1, 16))
        }))
    }

    const uploadfile = (file: any, village: any, details: any, currentuniquevillagecode: any, mimetype: any, rolecalculated: any, uploadedby: any) => {
        return new Promise((resolve, reject) => {
            let filename = file.name;

            let reader = new FileReader();
            reader.onload = function () {
                console.log(reader.result);
                let arrayBuffer = <ArrayBuffer>reader.result;
                let bytes = new Uint8Array(arrayBuffer);
                console.log(bytes);

                // let encodedbase64 = b64EncodeUnicode(reader.result);
                
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
        
            }
            reader.readAsArrayBuffer(file);
        });
    }

    const downloadfile = (fileid: any) => {
        return new Promise((resolve, reject) => {
            let requestObj = {
                requesttype: 'filesattachment',
                request: 'downloadfile',
                fileid
            };
    
        });
    }

    return { uploadfile, downloadfile }
}

export default filewsloadupdown;