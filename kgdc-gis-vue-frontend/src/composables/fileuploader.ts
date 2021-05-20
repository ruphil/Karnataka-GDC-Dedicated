const fileuploader = () => {
    const uploadfile = (file: any) => {
        let filename = file.name;

        let reader = new FileReader();
        reader.onload = function () {
            console.log(reader.result);
        }
        reader.readAsArrayBuffer(file);
    }

    return { uploadfile }
}

export default fileuploader;