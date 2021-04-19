var ws = new WebSocket('ws://localhost:3010');
ws.addEventListener('message', (event) => {
    console.log(event.data);
});

//  User Requests   -----------------------------------------------------------------------------------

var registrationObj = {
    requesttype: 'newregistration',
    name: 'jack',
    mobilenumber: '9940364026',
    password: '123',
    UUID: 'uuid'
}

ws.send(JSON.stringify(registrationObj));

var checkUserObj = {
    requesttype: 'checkuser',
    mobilenumber: '9940364026',
    password: '123'
}

ws.send(JSON.stringify(checkUserObj));

var attendanceObj = {
    requesttype: 'logAttendance',
    clientdate: '',
    clienttime: '',
    name: 'jack',
    attendancetype: '',
    remarks: '',
    mobilenumber: '9940364026',
    password: '123',
    UUID: 'uuid',
    latitude: '',
    longitude: '',
    accuracy: '',
    gmapsurl: ''
}

ws.send(JSON.stringify(attendanceObj));


//  Admin Requests  -----------------------------------------------------------------------------------

var userstableObj = {
    requesttype: 'userstable',
    password: 'dbadminkgdc',
}

ws.send(JSON.stringify(userstableObj));

var approveuserObj = {
    requesttype: 'approveuser',
    password: 'dbadminkgdc',
    mobilenumber: 9940364026
}

ws.send(JSON.stringify(approveuserObj));

var deleteuserObj = {
    requesttype: 'deleteuser',
    password: 'dbadminkgdc',
    mobilenumber: 9940364026
}

ws.send(JSON.stringify(deleteuserObj));