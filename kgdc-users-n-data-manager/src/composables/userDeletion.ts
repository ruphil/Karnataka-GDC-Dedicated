import store from "@/store";
import globalToast from './globalToast';
import usersTable from '../composables/fetchUserTable';

const userDeletion = () => {
    const { showGlobalToast } = globalToast();
    const { getUsers } = usersTable();

    const deleteUser = (username: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                showGlobalToast('User Deleted...');
                getUsers();
            } else {
                showGlobalToast('Error Deleting User...');
            }
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'deleteuser',
                validateusername: adminuser,
                validatepassword: adminpass,
                usernametodelete: username,
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { deleteUser };
}

export default userDeletion;