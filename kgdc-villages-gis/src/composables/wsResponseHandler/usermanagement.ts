import store from "@/store";

export const handleUserRoles = (responseObj: any) => {
    if(responseObj.validUser){
        storeUserRoles(responseObj.roles);
    }
}

const storeUserRoles = (roles: any) => {
    console.log(roles);
    store.dispatch('setUserRoles', roles);
}