import { checkValidUserNGetRoles } from '../common-ts/userRolesAdminCheck';

export const checkUserForJurisdictionNValidity = (params: any) => {
    return new Promise((resolve, reject) => {
        let proxyMsgObj = {
            validateusername: params.get('username'),
            validatepassword: params.get('password')
        }
        // console.log(proxyMsgObj);
    
        checkValidUserNGetRoles(proxyMsgObj)
        .then((userrow: any) => {
            console.log(userrow);
            
            let jurisdiction = userrow.jurisdiction;
            let expiryDate = new Date(userrow.expiry);
            
            let todaysDate = new Date();
            // console.log(expiryDate, todaysDate);
            // console.log(expiryDate.getTime(), todaysDate.getTime());
            let cond1 = todaysDate.getTime() < expiryDate.getTime();
            let cond2 = checkJurisdiction(jurisdiction, params);
            console.log(cond1, cond2);

            if(cond1 && cond2){
                resolve('success');
            } else {
                reject('failure');
            }
        })
        .catch(() => {
            reject('failure');
        })
    })
}

const checkJurisdiction = (jurisdiction: any, params: any) => {
    if(jurisdiction == ''){
        return false;
    }

    let clientdistrict = params.get('district');
    let clienttaluk = params.get('taluk');

    let jurisdictionArry = jurisdiction.split(',');
    
    let validJurisdiction = false;
    for(let i = 0; jurisdictionArry.length; i++){
        let jurisdictionStr = jurisdictionArry[i];
        let talukDistrict = jurisdictionStr.split('@');

        let taluk = talukDistrict[0];
        let district = talukDistrict[1];
        // if()

    }

    return validJurisdiction;
}