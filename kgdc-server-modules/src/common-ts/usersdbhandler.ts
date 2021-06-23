import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

// All User Logics    --------------------------------------------------------------------------------------------------

export const checkValidUserNGetRoles = (msgObj: any) => {
    return new Promise((resolve, reject) => {
        const { validateusername, validatepassword } = msgObj;
        
        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT USERNAME, PASSWORD, ROLES FROM userstable where USERNAME='${validateusername}' and PASSWORD='${validatepassword}'`;
        client.query(getQuery)
        .then((res) => {
            let rows = res.rows;
            // console.log('User Rows', rows);

            if(rows.length == 1){
                let row = rows[0];
                resolve(row.roles);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            // console.log(err);
            reject('error');
        })
        .finally(() => {
            client.end();
        });
    });
}

export const getRoles = (ws: WebSocket, msgObj: any) => {
    const { validateusername, validatepassword } = msgObj;

    checkValidUserNGetRoles(msgObj)
    .then((roles: any) => {
        let responseObj = {
            response: 'getroles', requestStatus: 'success', validUser: true, validateusername, validatepassword, roles
        };

        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .catch((res: any) => {
        let responseObj = {
            response: 'getroles', requestStatus: 'success', validUser: false, validateusername, validatepassword, roles: 'NA'
        };

        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

// Admin Only Logics    --------------------------------------------------------------------------------------------------

const checkAdminUser = (msgObj: any) => {
    return new Promise((resolve, reject) => {
        checkValidUserNGetRoles(msgObj)
        .then((roles: any) => {
            let rolesArry = roles.split(',');
            if(rolesArry.includes('ADMIN')){
                resolve('success');
            } else {
                reject('error');
            }
        })
        .catch((res: any) => {
            reject('error');
        });
    });
}

export const newregistration = async (ws: WebSocket, msgObj: any) => {
    let insertQuery = `INSERT INTO userstable (USERNAME, PASSWORD, MOBILENUMBER, DESCRIPTION, ROLES) VALUES ($1, $2, $3, $4, $5)`;
    let { newusername, newpassword, mobilenumber, description, roles } = msgObj;
    let insertData = [newusername, newpassword, mobilenumber, description, roles];

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
            let responseObj = { response: 'newregistration', requestStatus: 'failure', action: 'none' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((err) => {
        // console.log(err);
        let responseObj = { response: 'newregistration', requestStatus: 'failure', action: 'none' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
}

export const getUsersTable = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT USERNAME, PASSWORD, MOBILENUMBER, DESCRIPTION, ROLES FROM userstable ORDER BY MOBILENUMBER DESC`;
        client.query(getQuery)
        .then((res) => {
            let userstable = res.rows;
            userstable = userstable.filter((user: any) => {
                let roles = user.roles.split(',');
                if(roles.includes('ADMIN')){
                    return false;
                } else {
                    return true;
                }
            });

            let responseObj = {
                response: 'userstable', requestStatus: 'success', userstable
            };

            // console.log(responseObj);
    
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'userstable', requestStatus: 'failure', action: 'none' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'userstable', requestStatus: 'failure', action: 'none' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const assignRole = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let usernametoupdate = msgObj.usernametoupdate;
        let newrole = msgObj.newrole;

        let sqlQuery = `UPDATE userstable SET ROLES = '${newrole}' WHERE USERNAME = '${usernametoupdate}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { response: 'assignrole', requestStatus: 'success', action: 'updated' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            let responseObj = { response: 'assignrole', requestStatus: 'failure', action: 'none' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'assignrole', requestStatus: 'failure', action: 'none' };
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
            let responseObj = { response: 'deleteuser', requestStatus: 'failure', action: 'none' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { response: 'deleteuser', requestStatus: 'failure', action: 'none' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}