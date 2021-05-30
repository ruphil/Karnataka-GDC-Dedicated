import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const getRoles = (ws: WebSocket, msgObj: any) => {
    checkValidUserNGetRoles(msgObj)
    .then((roles: any) => {
        let responseObj = {
            requesttype: 'usermanagement', request: 'getroles',
            requestStatus: 'success', validUser: true, roles
        };

        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .catch((res: any) => {
        let responseObj = { requestStatus: 'failure', validUser: false };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const checkValidUserNGetRoles = (msgObj: any) => {
    return new Promise((resolve, reject) => {
        const { username, password } = msgObj;
        
        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT NAME, PASSWORD, ROLES FROM userstable where NAME='${username}' and PASSWORD='${password}'`;
        client.query(getQuery)
        .then((res) => {
            let rows = res.rows;
            console.log('User Rows', rows);

            if(rows.length == 1){
                let row = rows[0];
                let roles = row.roles.split(',');
                resolve(roles);
            } else {
                reject('error');
            }
        })
        .catch((err) => {
            // console.log(err);
            reject('error');
            return 0;
        })
        .finally(() => {
            client.end();
        });
    });
}

export const newregistration = async (ws: WebSocket, msgObj: any) => {
    // let insertQuery = `INSERT INTO userstable (NAME, PASSWORD, ROLES) VALUES ($1, $2, $3)`;
    // let { name, mobilenumber, password, UUID } = msgObj;
    
    // const client = new Client({ connectionString });
    // client.connect();

    // client.query(insertQuery, insertData)
    // .then(() => {
    //     let responseObj = { requestStatus: 'success', action: 'registered' };
    //     ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    // })
    // .catch((err) => {
    //     console.log(err);
    //     respondWithFailureMsg(ws);
    //     return 0;
    // })
    // .finally(() => {
    //     client.end();
    // });
}

// Admin Logics

// export const getUsersTable = (ws: WebSocket, msgObj: any) => {
//     checkAdminUser(msgObj)
//     .then((res: any) => {
//         const client = new Client({ connectionString });
//         client.connect();

//         let getQuery = `SELECT NAME, MOBILENUMBER, PASSWORD, UUID, ROLES FROM kgdcusers ORDER BY MOBILENUMBER`;
//         client.query(getQuery)
//         .then((res) => {
//             ws.send(Buffer.from(JSON.stringify(res.rows)).toString('base64'));
//         })
//         .catch((err) => {
//             // console.log(err);
//             respondWithFailureMsg(ws);
//             return 0;
//         })
//         .finally(() => {
//             client.end();
//         });
//     })
//     .catch((res: any) => {
//         let responseObj = { requestStatus: 'success', ...res }
//         ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
//     });
// }

// export const assignRole = (ws: WebSocket, msgObj: any) => {
//     checkAdminUser(msgObj)
//     .then((res: any) => {
//         const client = new Client({ connectionString });
//         client.connect();

//         let mobileNumberToUpdate = msgObj.mobilenumber;
//         let modifiedRole = msgObj.modifiedRole.toString();

//         let sqlQuery = `UPDATE kgdcusers SET ROLES = '${modifiedRole}' WHERE MOBILENUMBER = '${mobileNumberToUpdate}'`;
//         client.query(sqlQuery)
//         .then(() => {
//             let responseObj = { requestStatus: 'success' };
//             ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
//         })
//         .catch((err) => {
//             // console.log(err);
//             respondWithFailureMsg(ws);
//             return 0;
//         })
//         .finally(() => {
//             client.end();
//         });
//     })
//     .catch((res: any) => {
//         let responseObj = { requestStatus: 'success', ...res }
//         ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
//     });
// }

// export const deleteUser = (ws: WebSocket, msgObj: any) => {
//     checkAdminUser(msgObj)
//     .then((res: any) => {
//         const client = new Client({ connectionString });
//         client.connect();

//         let mobileNumberToDel = msgObj.mobilenumber;

//         let sqlQuery = `DELETE FROM kgdcusers WHERE MobileNumber='${mobileNumberToDel}'`;
//         client.query(sqlQuery)
//         .then(() => {
//             let responseObj = { requestStatus: 'success', adminuser: true, action: 'deleted' };
//             ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
//         })
//         .catch((err) => {
//             // console.log(err);
//             respondWithFailureMsg(ws);
//             return 0;
//         })
//         .finally(() => {
//             client.end();
//         });
//     })
//     .catch((res: any) => {
//         let responseObj = { requestStatus: 'success', ...res }
//         ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
//     });
// }
