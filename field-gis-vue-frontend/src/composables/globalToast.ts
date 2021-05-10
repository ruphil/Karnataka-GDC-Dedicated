import store from "@/store";

const globalToast = () => {
    const showGlobalToast = (msg: string) => {
        console.log('came here');

        store.dispatch('setGlobalToastMsg', msg);

        const globaltoastel = store.getters.getGlobalToastEl;
        console.log(globaltoastel);

        globaltoastel.classList.add('show');

        setTimeout(function(){ globaltoastel.classList.remove('show'); }, 3000);
    }

    return { showGlobalToast }
}

export default globalToast;