let ws =new WebSocket('ws://localhost:3010/');
ws.addEventListener('message',(j)=>{
    let responseObj = JSON.parse(Buffer.from(j.data, 'base64').toString());
    console.log(responseObj);
});

let requestObj = {
    request: 'getroles',
    username: 'gisadmin',
    password: 'kgdcgis'
};

ws.addEventListener('open', (event) => {
    ws.send(Buffer.from(JSON.stringify(requestObj)).toString('base64'));
});

