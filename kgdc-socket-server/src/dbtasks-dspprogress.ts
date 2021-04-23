import WebSocket from 'ws';
import { Client } from 'pg';

const connectionString = 'postgres://postgres:philosopher@localhost:5432/kgdcdb';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const checkUserDSP = (ws: WebSocket, msgObj: any) => {
    const client = new Client({ connectionString });
    client.connect();

    let { mobilenumber, password } = msgObj;

    let getQuery = `SELECT NAME, MOBILENUMBER, PASSWORD, ROLES FROM kgdcusers`;
    client.query(getQuery)
    .then((res) => {
        let rows = res.rows;

        let userFound = false;
        for (let i = 0; i < rows.length; i++){
            let row = rows[i];
            
            let hasRole = false;
            let roles = row.roles;
            if(roles != undefined && roles != ''){
                let rolesArry = roles.split(',');
                if(rolesArry.includes('attendance')){
                    hasRole = true;
                }
            }
            
            if(row.mobilenumber == mobilenumber && row.password == password && hasRole){
                userFound = true;
                let responseObj = { requestStatus: 'success', validUser: true, name: row.name };
                ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
                return 0;
            }
        }
        
        if(!userFound){
            let responseObj = { requestStatus: 'success', validUser: false };
            ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
        }
    })
    .catch((err) => {
        // console.log(err);
        respondWithFailureMsg(ws);
        return 0;
    })
    .finally(() => {
        client.end();
    });
}