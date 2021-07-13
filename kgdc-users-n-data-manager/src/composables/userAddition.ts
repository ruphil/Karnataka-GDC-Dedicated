import store from "@/store";
import globalToast from './globalToast';
import usersTable from '../composables/fetchUserTable';

const userAddition = () => {
    const { showGlobalToast } = globalToast();
    const { getUsers } = usersTable();

    const addUser = (newusername: any, newpassword: any, newmobilenumber: any, newdescription: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersNDataModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                showGlobalToast('User Added...');
                getUsers();
            } else {
                showGlobalToast('Error Adding User...');
            }
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'newregistration',
                validateusername: adminuser,
                validatepassword: adminpass,
                newusername: newusername,
                newpassword: newpassword,
                mobilenumber: newmobilenumber,
                description: newdescription,
                roles: '',
                jurisdiction: '',
                expiry: '2099-12-31'
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { addUser };
}

export default userAddition;