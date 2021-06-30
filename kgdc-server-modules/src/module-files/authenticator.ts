import { checkValidUserNGetRoles } from '../common-ts/userRolesAdminCheck';

export const checkuser = (params: any) => {
    return new Promise((resolve, reject) => {
        let proxyMsgObj = {
            username: params.get('username'),
            password: params.get('password')
        }
    
        checkValidUserNGetRoles(proxyMsgObj)
        .then(() => {
            resolve('success');
        })
        .catch(() => {
            reject('failure');
        })
    })
}