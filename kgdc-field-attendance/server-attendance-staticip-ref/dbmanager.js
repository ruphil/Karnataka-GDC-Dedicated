const sqlite3 = require('sqlite3').verbose();

const databaseURL = 'D:/databases/kgdc-attedance.db';

const respondWithFailureMsg = (ws) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

const createTablesIfNotExistsIntoDatabase = () => {
    let db = new sqlite3.Database(databaseURL, (err) => {
        if (err) {
            console.log(err.message);
            return 0;
        } else {
            let createTableQuery = `CREATE TABLE IF NOT EXISTS users(
                Name TEXT NOT NULL,
                MobileNumber TEXT NOT NULL PRIMARY KEY,
                Password TEXT NOT NULL,
                UUID TEXT,
                TYPE TEXT
            );
            CREATE TABLE IF NOT EXISTS attendanceregister(
                ServerDate TEXT NOT NULL,
                ServerTime TEXT NOT NULL,
                ClientDate TEXT NOT NULL,
                ClientTime TEXT NOT NULL,
                Name TEXT NOT NULL,
                AttendanceType TEXT NOT NULL,
                Remarks TEXT NOT NULL,
                MobileNumber TEXT NOT NULL,
                UUID TEXT,
                Latitude TEXT NOT NULL,
                Longitude TEXT NOT NULL,
                Accuracy TEXT NOT NULL
            );`;

            db.exec(createTableQuery, (err)=>{
                if (err){
                    console.log(err.message);
                    return 0;
                } else {
                    db.close();
                }
            });
        }
    });
}

// User Logics

const newregistration = (ws, msgObj, isBinary) => {
    try {
        let db = new sqlite3.Database(databaseURL, (err) => {
            if (err) {
                console.log(err.message);
                respondWithFailureMsg(ws);
            } else {
                let insertQuery = `INSERT INTO users(Name, MobileNumber, Password, UUID, TYPE) VALUES (?,?,?,?,?)`;
                
                let { name, mobilenumber, password, UUID } = msgObj;
                // console.log(name, mobilenumber, password, UUID);
                let insertData = [name, mobilenumber, password, UUID, 'New'];
        
                db.run(insertQuery, insertData, function(err) {
                    db.close();
                    if (err) {
                        console.log(err.message);
                        respondWithFailureMsg(ws);
                    } else {
                        let responseObj = { requestStatus: 'success' };
                        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
                    }
                });
            }
            return 0;
        });
    } catch (e) {
        respondWithFailureMsg(ws);
        return 0;
    }
}

const checkUser = (ws, msgObj, isBinary) => {
    try {
        let db = new sqlite3.Database(databaseURL, (err) => {
            if (err) {
                console.log(err.message);
                respondWithFailureMsg(ws);
            } else {
                let { mobilenumber, password } = msgObj;
                let sql = `SELECT Name, MobileNumber, Password, TYPE FROM users`;
                db.all(sql, [], (err, rows) => {
                    db.close();
                    if (err) {
                        console.log(err.message);
                        respondWithFailureMsg(ws);
                    } else {
                        let userFound = false;
                        for (let i = 0; i < rows.length; i++){
                            let row = rows[i];
                            if(row.MobileNumber == mobilenumber && row.Password == password && row.TYPE == 'Approved'){
                                userFound = true;
                                let responseObj = { requestStatus: 'success', validUser: true, name: row.Name };
                                ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
                                return 0;
                            }
                        }
                        
                        if(!userFound){
                            let responseObj = { requestStatus: 'success', validUser: false };
                            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
                        }
                    }
                });
            }
            return 0;
        });
    } catch (e) {
        respondWithFailureMsg(ws);
        return 0;
    }
}

const logAttendance = (ws, msgObj, isBinary) => {
    try {
        let db = new sqlite3.Database(databaseURL, (err) => {
            if (err) {
                console.log(err.message);
                respondWithFailureMsg(ws);
            } else {
                let { mobilenumber, password } = msgObj;
    
                let sql = `SELECT Name, MobileNumber, Password, TYPE FROM users`;
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                        respondWithFailureMsg(ws);
                    } else {
                        let userFound = false;
                        for (let i = 0; i < rows.length; i++){
                            let row = rows[i];
                            if(row.MobileNumber == mobilenumber && row.Password == password && row.TYPE == 'Approved'){
                                userFound = true;
                                makeAttendanceEntry(db, ws, msgObj);
                            }
                        }
                        
                        if(!userFound){
                            let responseObj = { requestStatus: 'success', validUser: false, action: 'unknown' };
                            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
                        }
                    }
                });
            }
            return 0;
        });
    } catch (e) {
        respondWithFailureMsg(ws);
        return 0;
    }
}

const makeAttendanceEntry = (db, ws, msgObj) => {
    let dateNow = new Date();
    serverdate = dateNow.toLocaleDateString('en-GB');
    servertime = dateNow.toLocaleTimeString('en-GB');

    let { clientdate, clienttime, name, attendancetype, remarks, mobilenumber, UUID } = msgObj;
    let { latitude, longitude, accuracy, gmapsurl } = msgObj;

    let insertQuery = `INSERT INTO attendanceregister(
        ServerDate, ServerTime, ClientDate, ClientTime, Name, AttendanceType, Remarks, 
        MobileNumber, UUID, Latitude, Longitude, Accuracy) 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    
    // console.log(clientdate, clienttime, name, attendancetype, remarks, UUID);
    let insertData = [serverdate, servertime, clientdate, clienttime, name, attendancetype, remarks, mobilenumber, UUID, latitude, longitude, accuracy];

    db.run(insertQuery, insertData, function(err) {
        db.close();
        if (err) {
            console.log(err.message);
            respondWithFailureMsg(ws);
        } else {
            let responseObj = { requestStatus: 'success', validuser: true, action: 'attendanceregistered' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        }
        return 0;
    });
}

// Admin Logics

const displayUsersTable = (ws, msgObj, isBinary) => {
    try{
        if(msgObj.username == 'admin' & msgObj.password == 'dbadminkgdc'){
            let db = new sqlite3.Database(databaseURL, (err) => {
                if (err) {
                    console.log(err.message);
                    respondWithFailureMsg(ws);
                } else {
                    let sql = `SELECT Name, MobileNumber, Password, UUID, TYPE FROM users`;
                    db.all(sql, [], (err, rows) => {
                        db.close();
                        if (err) {
                            console.log(err.message);
                            respondWithFailureMsg(ws);
                        } else {
                            ws.send(Buffer.from(JSON.stringify(rows)).toString('base64'));
                        }
                    });
                }
                return 0;
            });
        }
    } catch (e) {
        respondWithFailureMsg(ws);
        return 0;
    }
}

const approveBanUser = (ws, msgObj, isBinary) => {
    try {
        if(msgObj.user == 'admin' && msgObj.pass == 'dbadminkgdc'){
            let db = new sqlite3.Database(databaseURL, (err) => {
                if (err) {
                    console.log(err.message);
                    respondWithFailureMsg(ws);
                } else {
                    let mobileNumberToUpdate = msgObj.mobilenumber;
    
                    let sql = ``;
                    let responseObj = {};
                    if(msgObj.action == 'toapprove'){
                        sql = `UPDATE users SET TYPE = 'Approved' WHERE MobileNumber = ?`;
                        responseObj = { requestStatus: 'success', adminuser: true, action: 'approved' };
                    } else {
                        sql = `UPDATE users SET TYPE = 'Banned' WHERE MobileNumber = ?`;
                        responseObj = { requestStatus: 'success', adminuser: true, action: 'banned' };
                    }

                    db.run(sql, mobileNumberToUpdate, (err) => {
                        db.close();
                        if(err){
                            console.log(err.message);
                            respondWithFailureMsg(ws);
                        } else {
                            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
                        }
                    });
                }
                return 0;
            });
        } else {
            let responseObj = { requestStatus: 'success', adminuser: false, action: 'ignored' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        }
    } catch (e) {
        respondWithFailureMsg(ws);
        return 0;
    }
}

const deleteUser = (ws, msgObj, isBinary) => {
    try {
        if(msgObj.user == 'admin' && msgObj.pass == 'dbadminkgdc'){
            let db = new sqlite3.Database(databaseURL, (err) => {
                if (err) {
                    console.log(err.message);
                    respondWithFailureMsg(ws);
                } else {
                    let mobileNumberToDel = msgObj.mobilenumber;
        
                    db.run(`DELETE FROM users WHERE MobileNumber=?`, mobileNumberToDel, function(err) {
                        db.close();
                        if (err) {
                            console.log(err.message);
                            respondWithFailureMsg(ws);
                        } else {
                            let responseObj = { requestStatus: 'success', adminuser: true, action: 'deleted' };
                            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
                        }
                    });
                }
            });
        } else {
            let responseObj = { requestStatus: 'success', adminuser: false, action: 'ignored' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        }
    } catch (e) {
        respondWithFailureMsg(ws);
        return 0;
    }
}

const checkAdmin = (ws, msgObj, isBinary) => {
    if(msgObj.user == 'admin' && msgObj.pass == 'dbadminkgdc'){
        let responseObj = { requestStatus: 'success', adminuser: true };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    } else {
        let responseObj = { requestStatus: 'success', adminuser: false };
        ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
    }
}

const getAttendanceRegister = (ws, msgObj, isBinary) => {
    try{
        if(msgObj.user == 'admin' && msgObj.pass == 'dbadminkgdc'){
            let db = new sqlite3.Database(databaseURL, (err) => {
                if (err) {
                    console.log(err.message);
                    respondWithFailureMsg(ws);
                } else {
                    let sql = `SELECT ServerDate, ServerTime, ClientDate, ClientTime, Name, AttendanceType, Remarks, 
                    MobileNumber, UUID, Latitude, Longitude, Accuracy FROM attendanceregister ORDER BY rowid DESC LIMIT 100;`;
                    
                    db.all(sql, [], (err, rows) => {
                        db.close();
                        if (err) {
                            console.log(err.message);
                            respondWithFailureMsg(ws);
                        } else {
                            ws.send(Buffer.from(JSON.stringify(rows)).toString('base64'));
                        }
                    });
                }
                return 0;
            });
        } else {
            let responseObj = { requestStatus: 'success', adminuser: false, action: 'ignored' };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        }
    } catch (e) {
        respondWithFailureMsg(ws);
        return 0;
    }
}

module.exports = {
    newregistration,
    checkUser,
    logAttendance,
    displayUsersTable,
    approveBanUser,
    deleteUser,
    checkAdmin,
    getAttendanceRegister,
    createTablesIfNotExistsIntoDatabase
}
