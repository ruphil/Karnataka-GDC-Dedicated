<template>
    <div id="loginsection">
        <b>Kindly Login</b>
        <br/><br/>
        <input class="mobilenumber" type="text" size="20" placeholder="Username" v-model="username"/>
        <br/><br/>
        <input class="password" type="password" size="20" placeholder="Password" v-model="password" v-on:keyup.enter="doLogin"/>
        <br/><br/>
        <div style="font-size:10px;">{{ loginStatus }}</div>
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';

import { defineComponent, ref, computed } from 'vue';

import authenticator from '../composables/authenticator';
import mapLoader from '../composables/mapLoader';

export default defineComponent({
    setup() {
        const store = useStore();
        const { doAuthentication } = authenticator();
        const { loadBaseMapNKarnBounds } = mapLoader();

        const username = ref('');
        const password = ref('');
        const loginStatus = ref('Press Enter To Continue...');

        const doLogin = () => {
            
            const url: string = 'http://localhost:8080/geoserver/ows?service=wfs&version=2.0.0&request=GetCapabilities';
            doAuthentication(url, username.value, password.value)
            .then((res)=>{
                store.dispatch('setLoggedIn', true);
                const mapEl = store.getters.getMapElement;
                mapEl.innerText = '';

                loadBaseMapNKarnBounds(mapEl);
            })
            .catch((reason) => {
                console.log(reason);
            })
            .finally(() => {
                username.value = '';
                password.value = '';
            });
        }

        return { username, password, loginStatus, doLogin }
    },
})
</script>