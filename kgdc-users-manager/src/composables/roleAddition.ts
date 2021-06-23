import store from "@/store";
import globalToast from './globalToast';
import usersTable from './fetchUserTable';

const roleAddition = () => {
    const { showGlobalToast } = globalToast();
    const { getUsers } = usersTable();

    const addRole = (username: any, newrole: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                showGlobalToast('Assigned Role Successfully...');
                getUsers();
            } else {
                showGlobalToast('Error Assigning Role...');
            }
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'assignrole',
                validateusername: adminuser,
                validatepassword: adminpass,
                usernametoupdate: username,
                newrole
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { addRole };
}

export default roleAddition;