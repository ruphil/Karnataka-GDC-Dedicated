import WebSocket from 'ws';

const respondWithFailureMsg = (ws: WebSocket) => {
    let responseObj = { requestStatus: 'failure' };
    ws.send(Buffer.from(JSON.stringify(responseObj)).toString('base64'));
}

export const getfiles = (ws: WebSocket, msgObj: any) => {
    
}

export const uploadfile = (ws: WebSocket, msgObj: any) => {
    
}