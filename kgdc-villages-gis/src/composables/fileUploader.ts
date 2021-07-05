import store from "@/store";

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
        formData.append('currentvillage', currentvillage);

        let fileServerURL = store.getters.getFileServerModule;
        let uploadURL = fileServerURL + '/fileupload';
        
        fetch(uploadURL, {method: "POST", body: formData});
    }

    return { uploadFile };
}

export default fileUploader;
