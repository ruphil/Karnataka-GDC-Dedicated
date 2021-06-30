import store from "@/store";
import globalToast from './globalToast';
import droneNumbersFetch from '../composables/droneNumbersFetch';

const droneDeletion = () => {
    const { showGlobalToast } = globalToast();
    const { getDrones } = droneNumbersFetch();

    const deleteDrone = (dronetodelete: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                showGlobalToast('Drone Number Deleted...');
                getDrones();
            } else {
                showGlobalToast('Error Deleting Drone...');
            }
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'deletedrone',
                validateusername: adminuser,
                validatepassword: adminpass,
                dronetodelete
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { deleteDrone };
}

export default droneDeletion;