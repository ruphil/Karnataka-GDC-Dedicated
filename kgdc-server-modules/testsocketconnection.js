// Socket Connection

let ws = new WebSocket('ws://localhost:3010/');
ws.addEventListener('message',(j)=>{
    let responseObj = JSON.parse(atob(j.data));
    console.log(responseObj);
});

// Check Role

let requestObj = {
    request: 'getroles',
    validateusername: 'gisadmin',
    validatepassword: 'kgdcgiss'
};

ws.send(btoa(JSON.stringify(requestObj)));

ws.addEventListener('open', (event) => {
    ws.send(btoa(JSON.stringify(requestObj)));
});

// Add User

let ws = new WebSocket('ws://localhost:3010/');
ws.addEventListener('message',(j)=>{
    let responseObj = JSON.parse(atob(j.data));
    console.log(responseObj);
});

let requestObj = {
    request: 'newregistration',
    validateusername: 'gisadmin',
    validatepassword: 'kgdcgis',
    newusername: 'jack',
    newpassword: '1234',
    mobilenumber: '9876543210',
    description: 'level 1 user',
    roles: 'micky,jicky'
};

ws.addEventListener('open', (event) => {
    ws.send(btoa(JSON.stringify(requestObj)));
});