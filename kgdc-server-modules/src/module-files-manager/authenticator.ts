import { checkValidUserNGetRoles } from '../common-ts/userRolesAdminCheck';
import { checkTalukDistrictForFile } from './dbhandlerfiles';

export const checkUserForValidityNJurisdiction = (params: any) => {
    return new Promise((resolve, reject) => {
        let proxyMsgObj = {
            validateusername: params.get('username'),
            validatepassword: params.get('password')
        }
        // console.log(proxyMsgObj);
    
        checkValidUserNGetRoles(proxyMsgObj)
        .then((userrow: any) => {
            console.log(userrow);
            
            checkExpiryNJurisdiction(userrow, params)
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

export const checkUserForValidityNJurisdictionNAttachment = (params: any) => {
    return new Promise((resolve, reject) => {
        let proxyMsgObj = {
            validateusername: params.get('username'),
            validatepassword: params.get('password')
        }
        // console.log(proxyMsgObj);
    
        checkValidUserNGetRoles(proxyMsgObj)
        .then((userrow: any) => {
            console.log(userrow);
            
            checkExpiryNJurisdiction(userrow, params)
            .then(() => {
                checkAttachment(params)
                .then(() => {
                    resolve('success');
                }).catch(() => {
                    reject('failure');
                });
            }).catch(() => {
                reject('failure');
            });
        })
        .catch(() => {
            reject('failure');
        })
    })
}

const checkExpiryNJurisdiction = (userrow: any, params: any) => {
    return new Promise((resolve, reject) => {
        let jurisdiction = userrow.jurisdiction;
        let expiryDate = new Date(userrow.expiry);
        let todaysDate = new Date();
        // console.log(expiryDate, todaysDate);
        // console.log(expiryDate.getTime(), todaysDate.getTime());

        let validityAvail = todaysDate.getTime() < expiryDate.getTime();
        if(!validityAvail){
            console.log('User Expired');
            reject('failure');
        }

        if(jurisdiction == '' || jurisdiction == null){
            console.log('Invalid Jurisdiction 1');
            reject('failure');
        }
    
        let validJurisdiction = false;
        let clientdistrict = params.get('district');
        let clienttaluk = params.get('taluk');
        // console.log(clientdistrict, clienttaluk);
    
        let jurisdictionArry = jurisdiction.split(',');
        // console.log(jurisdictionArry);
        
        jurisdictionArry.forEach((jurisdictionStr: any) => {
            let talukDistrict = jurisdictionStr.split('@');
    
            let dbtaluk = talukDistrict[0];
            let dbdistrict = talukDistrict[1];
            // console.log(dbtaluk, dbdistrict);
    
            if(dbdistrict == 'ALL'){
                validJurisdiction = true;
            }
    
            if(dbtaluk == 'ALL' && clientdistrict == dbdistrict){
                validJurisdiction = true;
            }
    
            if(clientdistrict == dbdistrict && clienttaluk == dbtaluk){
                validJurisdiction = true;
            }
        });

        if(validJurisdiction){
            resolve('success');
        } else {
            console.log('Invalid Jurisdiction 2');
            reject('failure');
        }
    });
}

const checkAttachment = (params: any) => {
    return new Promise((resolve, reject) => {    
        let clientdistrict = params.get('district');
        let clienttaluk = params.get('taluk');
        let filelocation = params.get('filelocation');
        console.log(clientdistrict, clienttaluk);

        let cond1 = clientdistrict == null || clienttaluk == null || filelocation == null;
        let cond2 = clientdistrict == '' || clienttaluk == '' || filelocation == '';
        if(cond1 || cond2){
            reject('failure');
        }
    
        checkTalukDistrictForFile(clientdistrict, clienttaluk, filelocation)
        .then(() => {
            resolve('success');
        })
        .catch(() => {
            console.log('Taluk District Check For File In DB Failed');
            reject('failure');
        });
    });
}