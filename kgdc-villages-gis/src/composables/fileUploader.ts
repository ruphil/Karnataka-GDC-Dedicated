import store from "@/store";
import axios from 'axios';

const fileUploader = () => {
    const uploadFile = (currentvillage: any, currentvillagecode: any, fileName: any, fileType: any, description: any, currentuser: any, fileEl: any) => {
        console.log(currentvillage, currentvillagecode, fileName, fileType, description, currentuser);

        let file = fileEl.files[0];
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
        
        // fetch(uploadURL, {method: "POST", body: formData});
        axios.post(uploadURL, {
            url: uploadURL,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (p: any) => {
                console.log(p);
            }
        }).then (data => {
            console.log(data);
            console.log('uploaded');
        });
    }

    return { uploadFile };
}

export default fileUploader;
