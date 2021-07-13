import router from '@/router';
import store from '@/store';
import globalToast from './globalToast';

import jurisdictionsLoader from '@/composables/jurisdictionsLoader';

const userLoginCheck = () => {
    const { showGlobalToast } = globalToast();
    const { loadJurisdictions } = jurisdictionsLoader();

    const sendAuthenticationRequest = (username: string, password: string) => {
            let requestObj = {
                request: 'getroles',
                validateusername: username,
                validatepassword: password
            };

            console.log(requestObj);

            let wssURL = store.getters.getUsersNDataModuleWSS;
            let ws = new WebSocket(wssURL);
        
            ws.addEventListener('message', (event) => {
                let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
                console.log(responseObj);

                let roles = responseObj.userDetails.roles;
                let rolesArry = roles.split(',');

                if(responseObj.validUser && rolesArry.includes('ADMIN')){
                    doLoggedInRituals(responseObj);
                } else {
                    window.localStorage.removeItem('globalusername');
                    window.localStorage.removeItem('globalpassword');
                    showGlobalToast('Invalid Username / Password...');
                }

                ws.close();
            });

            ws.addEventListener('open', (event) => {
                ws.send(btoa(JSON.stringify(requestObj)));
            });
    }

    const doLoggedInRituals = (responseObj: any) => {
        store.dispatch('setLoggedIn', true);
        store.dispatch('setUserRoles', responseObj.roles);
        store.dispatch('setGlobalUsename', responseObj.validateusername);
        store.dispatch('setGlobalPassword', responseObj.validatepassword);
        window.localStorage.setItem('globalusername', responseObj.validateusername);
        window.localStorage.setItem('globalpassword', responseObj.validatepassword);
        showGlobalToast('Login Successful...');

        router.push('/users');
        loadJurisdictions();
    }

    return { sendAuthenticationRequest }
}

export default userLoginCheck;