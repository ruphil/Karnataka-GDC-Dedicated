import store from '@/store';

const approverFilesList = () => {
    const approveKML = (gid: any) => {
        const filesList = store.getters.getFilesList;
        // console.log(filesList);

        let reqdfeature: any = filesList.attachmentlist.find((feature: any) => {
            return feature.gid == gid;
        });

        let filelocation = reqdfeature.filelocation + '.' + reqdfeature.filetype;

    }

    const approveAttachment = (id: any) => {
        const filesList = store.getters.getFilesList;
        // console.log(filesList);

        let reqdfeature: any = filesList.attachmentlist.find((feature: any) => {
            return feature.id == id;
        });

        let filelocation = reqdfeature.filelocation + '.' + reqdfeature.filetype;

    }

    return { approveKML, approveAttachment }
}

export default approverFilesList;
