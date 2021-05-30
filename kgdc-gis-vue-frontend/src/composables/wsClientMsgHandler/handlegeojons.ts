

export const handlegeojson = (responseObj: any) => {
    switch(responseObj.layer){
        case 'karnatakaboundary':
            loadkarnatakaboundary(responseObj.roles);
            break;
        default:
            console.log('Unexpected Response from WS Server');
    }
}

const loadkarnatakaboundary = (roles: any) => {
    console.log(roles);
}