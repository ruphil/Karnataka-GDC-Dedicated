import store from "@/store";

export const wsMsgHandler = (event: any) => {
    // console.log(event.data);
    let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
    console.log(responseObj);

    if(responseObj.requesttype == 'usermanagement' && responseObj.request == 'getroles'){
        addUserRoles(responseObj.roles);
    } else {
        console.log('Unexpected Response from WS Server');
    }
}

const addUserRoles = (roles: any) => {
    console.log(roles);
    store.dispatch('setUserRoles', roles);
}