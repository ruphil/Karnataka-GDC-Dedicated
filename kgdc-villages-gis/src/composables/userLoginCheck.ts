import store from '@/store';
// import { wsMsgHandler } from './wsResponseHandler/wsResponseHandler';
import globalToast from '../composables/globalToast';

const userLoginCheck = () => {
    const { showGlobalToast } = globalToast();

    const sendAuthenticationRequest = (username: string, password: string) => {
            let requestObj = {
                request: 'getroles',
                validateusername: username,
                validatepassword: password
            };

            console.log(requestObj);

            let wssURL = store.getters.getUsersModuleWSS;
            let ws = new WebSocket(wssURL);
        
            ws.addEventListener('message', (event) => {
                let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
                console.log(responseObj);

                if(responseObj.validUser){
                    store.dispatch('setLoggedIn', true);
                    store.dispatch('setUserRoles', responseObj.roles);
                    store.dispatch('setGlobalUsename', responseObj.validateusername);
                    store.dispatch('setGlobalPassword', responseObj.validatepassword);
                    window.localStorage.setItem('globalusername', responseObj.validateusername);
                    window.localStorage.setItem('globalpassword', responseObj.validatepassword);
                    showGlobalToast('Login Successful...');
                } else {
                    window.localStorage.removeItem('globalusername');
                    window.localStorage.removeItem('globalpassword');
                }

                ws.close();
            });

            ws.addEventListener('open', (event) => {
                ws.send(btoa(JSON.stringify(requestObj)));
            });

    }

    return { sendAuthenticationRequest }
}

export default userLoginCheck;