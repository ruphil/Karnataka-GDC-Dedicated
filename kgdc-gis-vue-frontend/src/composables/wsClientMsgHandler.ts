import store from "@/store";
import { usermanager } from './wsClientMsgHandler/usermanagement';

export const wsMsgHandler = (event: any) => {
    // console.log(event.data);
    let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
    console.log(responseObj);

    switch(responseObj.requesttype){
        case 'usermanagement':
            usermanager(responseObj);
            break;
        default:
            console.log('Unexpected Response from WS Server');
    }
}

