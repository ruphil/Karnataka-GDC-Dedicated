import { getCurrentInstance } from '@vue/runtime-core';

import karnBoundsLoader from '../karnBoundsLoader';

const app = getCurrentInstance()!;

export const handlegeojson = (responseObj: any) => {
    switch(responseObj.layer){
        case 'karnatakaboundary':
            loadkarnatakaboundary(responseObj.featureCollection);
            break;
        default:
            console.log('Unexpected Response from WS Server');
    }
}

const loadkarnatakaboundary = (gj: any) => {
    console.log(gj);
    const { setKarnBounds } = karnBoundsLoader();
    setKarnBounds(gj);
}