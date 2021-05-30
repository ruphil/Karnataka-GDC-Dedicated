import { makeSocketRequest } from '../composables/wsClient';

const userLoginCheck = () => {
    const doAuthentication = (username: string, password: string) => {
        return new Promise((resolve, reject) => {
            let requestObj = {
                requesttype: 'usermanagement',
                request: 'getroles',
                username,
                password
            };

            makeSocketRequest(requestObj)
            .then(() => {
                resolve('success');
            })
            .catch(() => {
                reject('error');
            })
        });
    }

    return { doAuthentication }
}

export default userLoginCheck;