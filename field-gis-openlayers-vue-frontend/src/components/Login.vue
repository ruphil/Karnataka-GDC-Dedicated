<template>
    <div id="loginsection">
        <b>Kindly Login</b>
        <br/><br/>
        <input class="mobilenumber" type="text" size="20" placeholder="Username" v-model="username"/>
        <br/><br/>
        <input class="password" type="password" size="20" placeholder="Password" v-model="password" v-on:keyup.enter="doLogin"/>
        <br/><br/>
        <div style="font-size:8px;">{{ loginStatus }}</div>
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';

import { defineComponent, ref } from 'vue';
import mapLoader from '../composables/mapLoader';

export default defineComponent({
    setup() {
        const store = useStore();
        const { loadBaseMapNKarnBounds } = mapLoader();

        const username = ref('');
        const password = ref('');
        const loginStatus = ref('Press Enter To Continue...');

        const doLogin = () => {
            loginStatus.value = 'Please Wait...';
            const mapEl = store.getters.getMapElement;
            let url: string = 'http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=kgdc:karndistbounds&srsname=EPSG:3857&outputFormat=application/json';
            loadBaseMapNKarnBounds(mapEl, url, username.value, password.value)
            .then((res)=>{
                console.log(res);
                store.dispatch('setLoggedIn', true);
                const mapEl = store.getters.getMapElement;
            })
            .catch((reason) => {
                console.log(reason);
                loginStatus.value = 'Incorrect Credentials... Please Try Again...';
                setTimeout(() => {
                    loginStatus.value = 'Press Enter To Continue...';
                }, 5000);
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