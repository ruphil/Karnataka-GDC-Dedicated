import { makeSocketRequestNClose } from '../composables/wsClient';

const userLoginCheck = () => {
    const doAuthentication = (username: string, password: string) => {
        return new Promise((resolve, reject) => {
            let requestObj = {
                request: 'getroles',
                validateusername: username,
                validatepassword: password
            };

            console.log(requestObj);

            makeSocketRequestNClose(requestObj)
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