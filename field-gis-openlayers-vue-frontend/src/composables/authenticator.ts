import axios, { AxiosResponse } from 'axios';

const authenticator = () => {
    const doAuthentication = (url: string, username: string, password: string) => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url,
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
                }
            })
            .then((res: AxiosResponse) => {
                // console.log(res.status);
                if(res.status == 200){
                    resolve({'response': res});
                } else {
                    reject({'response': null});
                }
            })
            .catch((reason) => {
                // console.log(reason);
                reject({'response': null});
            })
        });
    }

    return { doAuthentication }
}

export default authenticator;