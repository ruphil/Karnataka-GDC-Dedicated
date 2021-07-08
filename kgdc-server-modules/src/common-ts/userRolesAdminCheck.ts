import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

// All User Logics    --------------------------------------------------------------------------------------------------

export const checkValidUserNGetRoles = (msgObj: any) => {
    return new Promise((resolve, reject) => {
        const { validateusername, validatepassword } = msgObj;
        
        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT * FROM userstable where USERNAME='${validateusername}' and PASSWORD='${validatepassword}'`;
        client.query(getQuery)
        .then((res) => {
            let rows = res.rows;
            // console.log('User Rows', rows, rows.length);

            if(rows.length > 0){
                let row = rows[0];
                resolve(row);
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

export const checkAdminUser = (msgObj: any) => {
    return new Promise((resolve, reject) => {
        checkValidUserNGetRoles(msgObj)
        .then((user: any) => {
            let roles = user.roles;
            let rolesArry = roles.split(',');
            // console.log(rolesArry);

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