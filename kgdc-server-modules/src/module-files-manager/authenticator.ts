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
            console.log('Expiry Condition: ', cond1);
            if(!cond1){
                reject('failure');
            }

            checkJurisdiction(jurisdiction, params)
            .then(() => {
                resolve('success');
            }).catch(() => {
                reject('failure');
            });
        })
        .catch(() => {
            reject('failure');
        })
    })
}

const checkJurisdiction = (jurisdiction: any, params: any) => {
    return new Promise((resolve, reject) => {
        if(jurisdiction == '' || jurisdiction == null){
            reject('failure');
        }
    
        let clientdistrict = params.get('district');
        let clienttaluk = params.get('taluk');
        console.log(clientdistrict, clienttaluk);
    
        let jurisdictionArry = jurisdiction.split(',');
        console.log(jurisdictionArry);
        
        for(let i = 0; jurisdictionArry.length; i++){
            let jurisdictionStr = jurisdictionArry[i];
            let talukDistrict = jurisdictionStr.split('@');
    
            let dbtaluk = talukDistrict[0];
            let dbdistrict = talukDistrict[1];
            console.log(dbtaluk, dbdistrict);
    
            if(dbdistrict == 'ALL'){
                resolve('success');
            }
    
            if(dbtaluk == 'ALL' && clientdistrict == dbdistrict){
                resolve('success');
            }
    
            if(clientdistrict == dbdistrict && clienttaluk == dbtaluk){
                resolve('success');
            }
        }
    
        console.log('came hre');
        reject('failure');
    });
}