import store from '@/shared/store';

const downloaderAttachment = () => {
    const downloadFile = (id: any) => {
        const filesList = store.getters.getFilesList;
        // console.log(filesList);

        let reqdfeature: any = filesList.attachmentlist.find((feature: any) => {
            return feature.id == id;
        });

        let fileWithExt = reqdfeature.filelocation + '.' + reqdfeature.filetype;

        download(fileWithExt, reqdfeature.filelocation, reqdfeature.identifier);
    }

    const download = (fileWithExt: any, filelocation: any, identifier: any) => {
        const fileServerURL = store.getters.getFileGetPostServerModule;
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;
        const currentvillagedetails = store.getters.getCurrentVillageDetails;

        let { district, taluk } = currentvillagedetails;

        let href = `${fileServerURL}/files/${fileWithExt}?username=${username}&password=${password}&filelocation=${filelocation}&district=${district}&taluk=${taluk}`;
        console.log(href, identifier);

        let element = document.createElement('a');
        element.setAttribute('href', href);
        element.setAttribute('target', '_blank');
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }

    return { downloadFile }
}

export default downloaderAttachment;
