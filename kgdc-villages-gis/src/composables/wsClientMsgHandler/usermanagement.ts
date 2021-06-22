import store from "@/store";

export const usermanager = (responseObj: any) => {
    switch(responseObj.request){
        case 'getroles':
            addUserRoles(responseObj.roles);
            break;
        default:
            console.log('Unexpected Response from WS Server');
    }
}

const addUserRoles = (roles: any) => {
    console.log(roles);
    store.dispatch('setUserRoles', roles);
}