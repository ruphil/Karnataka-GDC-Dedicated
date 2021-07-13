import store from "@/store";
import globalToast from './globalToast';
import usersTable from './fetchUserTable';

const roleJurisdictionAssignment = () => {
    const { showGlobalToast } = globalToast();
    const { getUsers } = usersTable();

    const modifyRole = (username: any, newrole: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersNDataModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                showGlobalToast('Role Modified Successfully...');
                getUsers();
            } else {
                showGlobalToast('Error Modifying Role...');
            }
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'modifyrole',
                validateusername: adminuser,
                validatepassword: adminpass,
                usernametoupdate: username,
                newrole
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }

    const modifyJurisdiction = (username: any, newjurisdiction: any) => {
        const adminuser = store.getters.getUsername;
        const adminpass = store.getters.getPassword;
        const wssURL = store.getters.getUsersNDataModuleWSS;
        let ws = new WebSocket(wssURL);

        ws.addEventListener('message', (event) => {
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            
            if(responseObj.requestStatus == 'success') {
                showGlobalToast('Jurisdiction Modified Successfully...');
                getUsers();
            } else {
                showGlobalToast('Error Modifying Jurisdiction...');
            }
            
            ws.close();
        });
        ws.addEventListener('open', (event) => {
            let requestObj = {
                request: 'modifyjurisdiction',
                validateusername: adminuser,
                validatepassword: adminpass,
                usernametoupdate: username,
                newjurisdiction
            };

            console.log(requestObj);

            ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
        });
    }
    
    return { modifyRole, modifyJurisdiction };
}

export default roleJurisdictionAssignment;