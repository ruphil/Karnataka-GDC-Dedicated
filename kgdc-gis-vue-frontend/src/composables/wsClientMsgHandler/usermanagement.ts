import store from "@/store";

export const usermanager = (responseObj: any) => {
    switch(responseObj.requesttype){
        case 'usermanagement':
            usermanager(responseObj);
            break;
        default:
            console.log('Unexpected Response from WS Server');
    }
}

const addUserRoles = (roles: any) => {
    console.log(roles);
    store.dispatch('setUserRoles', roles);
}