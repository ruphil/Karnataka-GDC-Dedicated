const fileUploader = () => {
    const uploadFile = (currentvillage: any, currentvillagecode: any, fileName: any, fileType: any, description: any, currentuser: any) => {
        console.log(currentvillage, currentvillagecode, fileName, fileType, description, currentuser);
    }

    return { uploadFile };
}

export default fileUploader;