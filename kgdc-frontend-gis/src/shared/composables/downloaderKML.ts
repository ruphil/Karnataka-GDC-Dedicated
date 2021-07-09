import store from '@/shared/store';

const downlooaderKML = () => {
    const downloadKML = (gid: any) => {
        const filesList = store.getters.getFilesList;
        // console.log(filesList);

        let reqdfeature: any = filesList.abadilist.find((feature: any) => {
            return feature.gid == gid;
        });

        let kmlstr = reqdfeature.st_askml;
        let kmldoc = '<Placemark>' + kmlstr + '</Placemark>';

        let identifier = reqdfeature.abadilimitname + '.kml';
        download(identifier, kmldoc);
    }

    const download = (filename: any, kmlstr: any) => {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(kmlstr));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }

    return { downloadKML }
}

export default downlooaderKML;
