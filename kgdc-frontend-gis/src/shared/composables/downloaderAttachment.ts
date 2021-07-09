import store from '@/shared/store';

const downloaderAttachment = () => {
    const downloadFile = (id: any) => {
        const filesList = store.getters.getFilesList;
        // console.log(filesList);

        let reqdfeature: any = filesList.attachmentlist.find((feature: any) => {
            return feature.id == id;
        });

        let filelocation = reqdfeature.filelocation + '.' + reqdfeature.filetype;

        download(filelocation, reqdfeature.identifier);
    }

    const download = (filelocation: any, identifier: any) => {
        const fileServerURL = store.getters.getFileGetPostServerModule;
        const username = store.getters.getUsername;
        const password = store.getters.getPassword;

        let href = `${fileServerURL}/files/${filelocation}?username=${username}&password=${password}`;
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
