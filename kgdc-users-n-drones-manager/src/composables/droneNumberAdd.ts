import store from "@/store";
import globalToast from './globalToast';
import usersTable from '../composables/fetchUserTable';

const droneAddition = () => {
    const { showGlobalToast } = globalToast();
    const { getUsers } = usersTable();

    const addDrone = (newdronenumber: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                showGlobalToast('Drone Number Added...');
                getUsers();
            } else {
                showGlobalToast('Error Adding Drone...');
            }
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'adddrone',
                validateusername: adminuser,
                validatepassword: adminpass,
                newdronenumber
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { addDrone };
}

export default droneAddition;