import store from '@/shared/store';

const globalToast = () => {
    const showGlobalToast = (msg: string) => {
        store.dispatch('setGlobalToastMsg', msg);

        const globaltoastel = store.getters.getGlobalToastEl;

        globaltoastel.classList.add('show');

        setTimeout(function(){ globaltoastel.classList.remove('show'); }, 6000);
    }

    return { showGlobalToast }
}

export default globalToast;