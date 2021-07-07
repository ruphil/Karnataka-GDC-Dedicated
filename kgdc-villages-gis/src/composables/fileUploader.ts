import store from "@/store";
import axios from 'axios';

import globalToast from '../composables/globalToast';

const fileUploader = () => {
    const { showGlobalToast } = globalToast();

    const uploadFile = (currentvillagedetails: any, currentvillage: any, currentvillagecode: any, fileName: any, fileType: any, description: any, currentuser: any, fileEl: any) => {
        console.log(currentvillage, currentvillagecode, fileName, fileType, description, currentuser);

        let file = fileEl.files[0];
        // console.log(file);

        let { district, taluk, gp } = currentvillagedetails;

        let formData = new FormData();
        formData.append('uploadedfile', file);

        formData.append('currentvillage', currentvillage);
        formData.append('currentvillagecode', currentvillagecode);
        formData.append('currentdistrict', district);
        formData.append('currenttaluk', taluk);
        formData.append('currentgp', gp);

        formData.append('fileName', fileName);
        formData.append('fileType', fileType);
        formData.append('description', description);
        formData.append('currentuser', currentuser);
        console.log(...formData);

        let fileServerURL = store.getters.getFileServerModule;
        let uploadURL = fileServerURL + '/fileupload';
        // console.log(uploadURL);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            },
            onUploadProgress: (p: any) => {
                let percentCompleted = Math.round((p.loaded * 100) / p.total)
                store.dispatch('setFileUploadProgress', percentCompleted);
            }
        };

        axios.post(uploadURL, formData, config)
            .then((response) => {
                console.log(response);
                showGlobalToast('File Uploaded Successfully');
            }).catch((error) => {
                console.log(error);
            });
    }

    return { uploadFile };
}

export default fileUploader;
