import store from "@/store";

const fileUploader = () => {
    const uploadFile = (currentvillage: any, currentvillagecode: any, fileName: any, fileType: any, description: any, currentuser: any, fileEl: any) => {
        console.log(currentvillage, currentvillagecode, fileName, fileType, description, currentuser, fileEl);


        let file = fileEl.files[0];
        let formData = new FormData();
        formData.append('uploadedfile', file);
        formData.append('maggi', 'jack');

        let fileServerURL = store.getters.getFileServerModule;
        let uploadURL = fileServerURL + '/fileupload';
        
        fetch(uploadURL, {method: "POST", body: formData});
    }

    return { uploadFile };
}

export default fileUploader;
