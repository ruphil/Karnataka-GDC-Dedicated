import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:kgdcgis@localhost:5432/kgdcdb';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

/* Admin Credentials:
    username    gisadmin
    password    kgdcgis
*/

const isAdmin = (msgObj: any) => {
    if(msgObj.username == 'gisadmin' && msgObj.password == 'kgdcgis'){
        return true;
    } else return false;
}

export const getRoles = (ws: WebSocket, msgObj: any) => {
    if(isAdmin(msgObj)){
        let responseObj = { requestStatus: 'success', isAdmin: true, roles: ['ALL'] };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    } else {
        console.log('Not Admin');
        checkValidUser(msgObj.username, msgObj.password)
        .then((res: any) => {
            let responseObj = { requestStatus: 'success', validUser: true, roles: res.roles };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((res: any) => {
            let responseObj = { requestStatus: 'success', validUser: false };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        });
    }
}

const checkValidUser = (username: string, password: string) => {
    return new Promise((resolve, reject) => {
        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT NAME, PASSWORD, ROLES FROM userstable where NAME='${username}' and PASSWORD='${password}'`;
        client.query(getQuery)
        .then((res) => {
            let rows = res.rows;
            console.log(rows);

            if(rows.length == 1){
                let row = rows[0];
                resolve({ querySuccess: true, validUser: true, roles: row.roles });
            } else {
                reject({ querySuccess: true, validUser: false });
            }
        })
        .catch((err) => {
            // console.log(err);
            reject({ querySuccess: false, validUser: false });
            return 0;
        })
        .finally(() => {
            client.end();
        });
    });
}

export const newregistration = async (ws: WebSocket, msgObj: any) => {
    let insertQuery = `INSERT INTO kgdcusers (Name, MobileNumber, Password, UUID, ROLES) VALUES ($1, $2, $3, $4, $5)`;
    let { name, mobilenumber, password, UUID } = msgObj;
    let insertData = [name, mobilenumber, password, UUID, ''];
    
    const client = new Client({ connectionString });
    client.connect();

    client.query(insertQuery, insertData)
    .then(() => {
        let responseObj = { requestStatus: 'success', action: 'registered' };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .catch((err) => {
        console.log(err);
        respondWithFailureMsg(ws);
        return 0;
    })
    .finally(() => {
        client.end();
    });
}

export const logAttendance = (ws: WebSocket, msgObj: any) => {
    let { mobilenumber, password } = msgObj;
    
    checkValidUser(mobilenumber, password)
    .then((res: any) => {
        let insertQuery = `INSERT INTO kgdcfieldattendanceregister (SERVERDATE, SERVERTIME, CLIENTDATE, CLIENTTIME, NAME, ATTENDANCETYPE, REMARKS, 
            MOBILENUMBER, UUID, LATITUDE, LONGITUDE, ACCURACY) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
        
        let dateNow = new Date();
        let serverdate = dateNow.toLocaleDateString('en-GB');
        let servertime = dateNow.toLocaleTimeString('en-GB');
    
        let { clientdate, clienttime, name, attendancetype, remarks, mobilenumber, UUID } = msgObj;
        let { latitude, longitude, accuracy } = msgObj;
    
        let insertData = [serverdate, servertime, clientdate, clienttime, name, attendancetype, remarks, mobilenumber, UUID, latitude, longitude, accuracy];
        
        const client = new Client({ connectionString });
        client.connect();
    
        client.query(insertQuery, insertData)
        .then(() => {
            let responseObj = { requestStatus: 'success', action: 'attendanceentered' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            respondWithFailureMsg(ws);
            return 0;
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { requestStatus: 'success', validUser: false };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

// Admin Logics

export const displayUsersTable = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj.user, msgObj.pass)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT NAME, MOBILENUMBER, PASSWORD, UUID, ROLES FROM kgdcusers ORDER BY MOBILENUMBER`;
        client.query(getQuery)
        .then((res) => {
            ws.send(Buffer.from(JSON.stringify(res.rows)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            respondWithFailureMsg(ws);
            return 0;
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { requestStatus: 'success', ...res }
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });

    
}

export const assignRole = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj.user, msgObj.pass)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let mobileNumberToUpdate = msgObj.mobilenumber;
        let modifiedRole = msgObj.modifiedRole.toString();

        let sqlQuery = `UPDATE kgdcusers SET ROLES = '${modifiedRole}' WHERE MOBILENUMBER = '${mobileNumberToUpdate}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { requestStatus: 'success' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            respondWithFailureMsg(ws);
            return 0;
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { requestStatus: 'success', ...res }
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const deleteUser = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj.user, msgObj.pass)
    .then((res: any) => {
        const client = new Client({ connectionString });
        client.connect();

        let mobileNumberToDel = msgObj.mobilenumber;

        let sqlQuery = `DELETE FROM kgdcusers WHERE MobileNumber='${mobileNumberToDel}'`;
        client.query(sqlQuery)
        .then(() => {
            let responseObj = { requestStatus: 'success', adminuser: true, action: 'deleted' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            respondWithFailureMsg(ws);
            return 0;
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { requestStatus: 'success', ...res }
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}

export const getAttendanceRegister = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj.user, msgObj.pass)
    .then((res: any) => {
        let rowscount = msgObj.rowscount;

        const client = new Client({ connectionString });
        client.connect();

        let getQuery = `SELECT SERVERDATE, SERVERTIME, CLIENTDATE, CLIENTTIME, NAME, ATTENDANCETYPE, REMARKS, 
        MOBILENUMBER, UUID, LATITUDE, LONGITUDE, ACCURACY FROM kgdcfieldattendanceregister ORDER BY ID DESC LIMIT ${rowscount};`;
        
        client.query(getQuery)
        .then((res) => {
            ws.send(Buffer.from(JSON.stringify(res.rows)).toString('base64'));
        })
        .catch((err) => {
            // console.log(err);
            respondWithFailureMsg(ws);
            return 0;
        })
        .finally(() => {
            client.end();
        });
    })
    .catch((res: any) => {
        let responseObj = { requestStatus: 'success', ...res }
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
    
}

const checkAdminUser = (user: string, pass: string) => {
    return new Promise((resolve, reject) => {
        if(user == 'admin' && pass == 'dbadminkgdc'){
            resolve({ isAdmin: true });
        } else {
            reject({ isAdmin: false });
        }
    });
}

export const checkAdmin = (ws: WebSocket, msgObj: any) => {
    checkAdminUser(msgObj.user, msgObj.pass)
    .then((res: any) => {
        let responseObj = { requestStatus: 'success', ...res }
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    })
    .catch((res: any) => {
        let responseObj = { requestStatus: 'success', ...res }
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    });
}