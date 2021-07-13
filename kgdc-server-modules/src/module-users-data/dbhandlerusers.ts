import WebSocket from 'ws';
import { Client } from 'pg';

import { checkValidUserNGetRoles, checkAdminUser } from '../common-ts/userRolesAdminCheck';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

// All User Logics    --------------------------------------------------------------------------------------------------

export const getRoles = (ws: WebSocket, msgObj: any) => {
    const { validateusername, validatepassword } = msgObj;

    checkValidUserNGetRoles(msgObj)
    .then((userDetails: any) => {
        let responseObj = {
            response: 'getroles', requestStatus: 'success', validUser: true, validateusername, validatepassword, userDetails
        };

        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .catch((res: any) => {
        let responseObj = {
            response: 'getroles', requestStatus: 'success', validUser: false, validateusername, validatepassword, userDetails: 'NA'
        };

        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const changePassword = (ws: WebSocket, msgObj: any) => {
    const { validateusername, oldpassword, newpassword } = msgObj;

    checkValidUserNGetRoles(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let sqlQuery = `UPDATE userstable SET PASSWORD = '${newpassword}' WHERE USERNAME = '${validateusername}' AND PASSWORD = '${oldpassword}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'changepassword', requestStatus: 'success', action: 'passwordchanged' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            console.log(err);
            let responseObj = { response: 'changepassword', requestStatus: 'failure', action: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'changepassword', requestStatus: 'failure', error: 'Usercheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

// Admin Only Logics    --------------------------------------------------------------------------------------------------

export const newregistration = async (ws: WebSocket, msgObj: any) => {
    let insertQuery = `INSERT INTO userstable (
        USERNAME, PASSWORD, MOBILENUMBER, DESCRIPTION, ROLES, JURISDICTION, EXPIRY) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    let { newusername, newpassword, mobilenumber, description, roles, jurisdiction, expiry } = msgObj;
    let insertData = [ newusername, newpassword, mobilenumber, description, roles, jurisdiction, expiry ];

    checkAdminUser(msgObj)
    .then((res: any) => {
    
        const client = new Client({ connectionString });
        client.connect();

        client.query(insertQuery, insertData)
        .then(() => {
            let responseObj = {
                response: 'newregistration', requestStatus: 'success', action: 'useradded'
            };

            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'newregistration', requestStatus: 'failure', action: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((err) => {
        // console.log(err);
        let responseObj = { response: 'newregistration', requestStatus: 'failure', error: 'Admincheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
}

export const getUsersTable = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT * FROM userstable`;
        client.query(getQuery)
        .then((res) => {
            let userstable = res.rows;

            userstable = userstable.filter((user: any) => {
                let roles = user.roles;

                try {
                    let rolesArry = roles.split(',');
                    console.log(rolesArry);

                    if(rolesArry.includes('ADMIN')){
                        return false;
                    } else {
                        return true;
                    }
                } catch (e) { return true; }
                
            });

            let responseObj = {
                response: 'userstable', requestStatus: 'success', userstable
            };

            // console.log(responseObj);
    
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'userstable', requestStatus: 'failure', error: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'userstable', requestStatus: 'failure', error: 'Admincheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const updateUserCredentials = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let { usernametoupdate, updatetype, updatevalue } = msgObj;

        let fieldName = '';
        switch(updatetype){
            case 'password':
                fieldName = 'PASSWORD'
                break;
            case 'mobilenumber':
                fieldName = 'MOBILENUMBER'
                break;
            case 'description':
                fieldName = 'DESCRIPTION'
                break;
            case 'expiry':
                fieldName = 'EXPIRY'
                break;
        }

        if(fieldName == ''){
            let responseObj = { response: 'updateusercredentials', requestStatus: 'failure', action: 'Update Type Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
            return 0;
        }

        let sqlQuery = `UPDATE userstable SET ${fieldName} = '${updatevalue}' WHERE USERNAME = '${usernametoupdate}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'updateusercredentials', requestStatus: 'success', action: `Updated ${fieldName}` };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'updateusercredentials', requestStatus: 'failure', error: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'updateusercredentials', requestStatus: 'failure', error: 'Admincheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const modifyRole = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let usernametoupdate = msgObj.usernametoupdate;
        let newrole = msgObj.newrole;

        let sqlQuery = `UPDATE userstable SET ROLES = '${newrole}' WHERE USERNAME = '${usernametoupdate}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'modifyrole', requestStatus: 'success', action: 'Modified' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'modifyrole', requestStatus: 'failure', error: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'modifyrole', requestStatus: 'failure', error: 'Admincheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const deleteUser = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let usernametodelete = msgObj.usernametodelete;

        let sqlQuery = `DELETE FROM userstable WHERE USERNAME='${usernametodelete}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'deleteuser', requestStatus: 'success', adminuser: true, action: 'deleted' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'deleteuser', requestStatus: 'failure', error: 'SQL Error' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'deleteuser', requestStatus: 'failure', error: 'Admincheck Error' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}