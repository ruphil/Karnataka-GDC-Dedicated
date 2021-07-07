import store from "@/store";
import axios from 'axios';

const fileUploader = () => {
    const uploadFile = (currentvillage: any, currentvillagecode: any, fileName: any, fileType: any, description: any, currentuser: any, fileEl: any) => {
        console.log(currentvillage, currentvillagecode, fileName, fileType, description, currentuser);

        let file = fileEl.files[0];
        console.log(file);
        file.newname = 'jack';

        let formData = new FormData();
        formData.append('uploadedfile', file);

        formData.append('currentvillage', currentvillage);
        formData.append('currentvillagecode', currentvillagecode);
        formData.append('fileName', fileName);
        formData.append('fileType', fileType);
        formData.append('description', description);
        formData.append('currentuser', currentuser);

        let fileServerURL = store.getters.getFileServerModule;
        let uploadURL = fileServerURL + '/fileupload';
        console.log(uploadURL);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            },
            onUploadProgress: (p: any) => {
                console.log(p);
            }
        };

        axios.post(uploadURL, formData, config)
            .then((response) => {
                console.log("The file is successfully uploaded");
            }).catch((error) => {
                console.log(error);
            });
    }

    return { uploadFile };
}

export default fileUploader;
