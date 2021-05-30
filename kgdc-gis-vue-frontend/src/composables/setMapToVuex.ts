import store from "@/store";

const setMapToVuex = () => {
    const setMapObjectToVeux = (mapObj: any) => {
        return new Promise((resolve, reject) => {
            store.dispatch('setMapObj', mapObj)
            .then(() => {
                resolve('success');
            })
            .catch((reason) => {
                console.log(reason);
                reject('error');
            })
        });
    }

    return { setMapObjectToVeux }
}

export default setMapToVuex;