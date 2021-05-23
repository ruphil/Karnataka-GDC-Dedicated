export const checkuser = (params: any) => {
    if(checkIfAdmin(params)){
        return { validuser: true, roles: ['ADMIN'] };
    } else {
        const { validuser, roles } = checkOtherUser();
        return { validuser, roles }
    }
}

const checkIfAdmin = (params: any) => {
    console.log(params);
    if(params.get('username') == 'gisadmin' && params.get('password') == 'kgdcgis'){
        return true;
    } else {
        return false;
    }
}

const checkOtherUser = () => {
    return { validuser: false, roles: ['NA'] };
}