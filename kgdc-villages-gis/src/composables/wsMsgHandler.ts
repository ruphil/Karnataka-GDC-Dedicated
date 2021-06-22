import { handleUserRoles } from './wsClientMsgHandler/usermanagement';
import { handlegeojson } from './wsClientMsgHandler/handlegeojsons';

export const wsMsgHandler = (event: any) => {
    // console.log(event.data);
    let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
    console.log(responseObj);

    switch(responseObj.request){
        case 'getroles':
            handleUserRoles(responseObj);
            break;
        case 'getgeojson':
            handlegeojson(responseObj);
            break;
        default:
            console.log('Unexpected Response from WS Server');
    }
}