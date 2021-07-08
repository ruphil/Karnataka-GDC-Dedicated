import { checkValidUserNGetRoles } from '../common-ts/userRolesAdminCheck';

export const checkuser = (params: any) => {
    return new Promise((resolve, reject) => {
        let proxyMsgObj = {
            validateusername: params.get('username'),
            validatepassword: params.get('password')
        }
        // console.log(proxyMsgObj);
    
        checkValidUserNGetRoles(proxyMsgObj)
        .then(() => {
            resolve('success');
        })
        .catch(() => {
            reject('failure');
        })
    })
}