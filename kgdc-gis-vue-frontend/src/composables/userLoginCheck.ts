import socketClient from '../composables/socketClient';

const userLoginCheck = () => {
    const { makeSocketRequestNClose } = socketClient();

    const doAuthentication = (username: string, password: string) => {
        return new Promise((resolve, reject) => {
            let registrationObj = {
                requesttype: 'usermanagement',
                request: 'getroles',
                username,
                password
            };

            makeSocketRequestNClose(registrationObj)
            .then((responseObj: any) => {
                if (responseObj.requestStatus == 'success'){
                    resolve(responseObj);
                } else {
                    reject(responseObj);
                }
            })
            .catch(() => {
                reject('error');
            })
        });
    }

    return { doAuthentication }
}

export default userLoginCheck;