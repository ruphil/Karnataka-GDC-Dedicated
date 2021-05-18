import { getCurrentInstance } from '@vue/runtime-core';
import globalToast from '../composables/globalToast';

const globalFunctions = () => {
    const app = getCurrentInstance()!;
    const { showGlobalToast } = globalToast();

    const discardLayerFromMap = (lyrid: any) => {
        return new Promise((resolve, reject) => {
        const map = app.appContext.config.globalProperties.$map;
        // console.log(map.getInteractions());
            try{
                map.getLayers().forEach((lyr: any) => {
                    if (lyr.get('lyrid') == lyrid) {
                        let source = lyr.getSource();
                        source.clear();
                        
                        map.removeLayer(lyr);
                    }
                });
                resolve(0);
            } catch (e) {
                showGlobalToast('Processing Layer in Background... Please Try Again in Seconds...');
                reject(1);
            }
        });
    }

    return { discardLayerFromMap }
}

export default globalFunctions;