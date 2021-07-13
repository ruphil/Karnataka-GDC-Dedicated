import store from "@/store";
import globalToast from './globalToast';
import usersTable from './fetchUserTable';

const roleAssignment = () => {
    const { showGlobalToast } = globalToast();
    const { getUsers } = usersTable();

    const updateCredentials = (username: any, updatetype: any, updatevalue: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersNDataModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                showGlobalToast(`${responseObj.action} Successfully...`);
                getUsers();
            } else {
                showGlobalToast('Error Updating Credentials...');
            }
            
            ws.close();
        });
        
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'updateusercredentials',
                validateusername: adminuser,
                validatepassword: adminpass,
                usernametoupdate: username,
                updatetype, updatevalue
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { updateCredentials };
}

export default roleAssignment;