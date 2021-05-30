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
    const { setKarnBounds } = karnBoundsLoader();
    console.log(gj);

    const map = app.appContext.config.globalProperties.$map;
    console.log(map);

    setKarnBounds(gj);
}