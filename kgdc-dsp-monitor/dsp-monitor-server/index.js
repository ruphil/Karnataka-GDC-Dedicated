const path = require('path');
const uWS = require('uWebSockets.js');
const uWebSocketsApp = uWS.App();

const { serveDir } = require('uwebsocket-serve');
const publicPath = path.resolve(__dirname, '../dsp-monitor-frontend/dist');
console.log(publicPath);
const serveStatic = serveDir(publicPath);

const { newregistration, checkUser, logAttendance } = require('./dbmanager');
const { displayUsersTable, approveBanUser, deleteUser, checkAdmin, getAttendanceRegister } = require('./dbmanager');
const { createTablesIfNotExistsIntoDatabase } = require('./dbmanager');

const port = 3010;

const arrayBufferToString = (buffer) => {
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    if(/[\u0080-\uffff]/.test(str)){
        throw new Error("this string seems to contain (still encoded) multibytes");
    }
    return str;
}

const open = (ws) => {
    console.log('A WebSocket connected!');
    // ws.send('Welcome to uWS Serverrrrr');
}

const message = (ws, message, isBinary) => {
    try {
        let stringmsg = arrayBufferToString(message);
        let msgObj = JSON.parse(Buffer.from(stringmsg, 'base64').toString());
        console.log(msgObj);

        if(msgObj.requesttype == 'newregistration'){
            newregistration(ws, msgObj, isBinary);
        } else if (msgObj.requesttype == 'checkuser'){
            checkUser(ws, msgObj, isBinary);
        } else if (msgObj.requesttype == 'logattendance'){
            logAttendance(ws, msgObj, isBinary);
        } else if (msgObj.requesttype == 'userstable'){
            displayUsersTable(ws, msgObj, isBinary);
        } else if (msgObj.requesttype == 'deleteuser'){
            deleteUser(ws, msgObj, isBinary);
        } else if (msgObj.requesttype == 'approvebanuser'){
            approveBanUser(ws, msgObj, isBinary);
        } else if (msgObj.requesttype == 'checkadmin'){
            checkAdmin(ws, msgObj, isBinary);
        } else if (msgObj.requesttype == 'attendanceregister'){
            getAttendanceRegister(ws, msgObj, isBinary);
        } else {
            ws.send('Invalid Request');
        }
    } catch (e) {
        console.log(e);
        ws.send('404');
    }
}

const drain = (ws) => {
    console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
}

const close = (ws, code, message) => {
    console.log('WebSocket closed');
}

const wsOptions = {
    compression: uWS.SHARED_COMPRESSOR,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 300,
    open, message, drain, close
}

const wsHandler = uWebSocketsApp.ws('/*', wsOptions);

const httpHandler = wsHandler.any('/*', serveStatic);

httpHandler.listen(port, (token) => {
    if (token) {
        createTablesIfNotExistsIntoDatabase();
        console.log('Listening to port ' + port);
    } else {
        console.log('Failed to listen to port ' + port);
    }
});
