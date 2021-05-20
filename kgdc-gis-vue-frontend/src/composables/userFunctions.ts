import store from "@/store";
import globalToast from '../composables/globalToast';
    
const userFunctions = () => {
    const { showGlobalToast } = globalToast();

    const addUser = (user: string, pass: string) => {
        console.log(user, pass);
        const wsurlBase = store.getters.getWSURLBase;
        console.log(wsurlBase);

        let ws = new WebSocket(wsurlBase);
        ws.addEventListener('message', (event) => {
            // console.log(event.data);
            let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
            console.log(responseObj);
            if (responseObj.requestStatus == 'success'){
                showGlobalToast('Added User...');
            } else {
                showGlobalToast('Problem Adding User...');
            }
            ws.close();
        });
        
        ws.addEventListener('open', (event) => {
            let registrationObj = {
                requesttype: 'usermanagement',
                request: 'adduser',
                user,
                pass
            };
            
            ws.send(Buffer.from(JSON.stringify(registrationObj)).toString('base64'));
        });
    }

    return { addUser };
}

export default userFunctions;