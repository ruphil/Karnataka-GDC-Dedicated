<template>
    <div id="loginsection">
        <b>Kindly Login</b>
        <br/><br/>
        <input class="mobilenumber" type="text" size="20" placeholder="Username" v-model="username"/>
        <br/><br/>
        <input class="password" type="password" size="20" placeholder="Password" v-model="password" v-on:keyup.enter="doLogin"/>
        <br/><br/>
        <div style="font-size:8px;">{{ loginMsg }}</div>
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';

import { defineComponent, ref, computed } from 'vue';
import mapLoader from '../composables/mapLoader';

export default defineComponent({
    setup() {
        const store = useStore();
        const { loadKarnBounds } = mapLoader();

        const username = ref('');
        const password = ref('');
        const loginMsg = computed(() => store.getters.getLogInMsg);

        const doLogin = () => {
            store.dispatch('setLogInMsg', 'Please Wait...');
            store.dispatch('setUploadStatusMsg', '');

            let url: string = 'http://localhost:8080/geoserver/kgdc/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=kgdc:karndistbounds&srsname=EPSG:3857&outputFormat=application/json';
            loadKarnBounds(url, username.value, password.value);
        }

        return { username, password, loginMsg, doLogin }
    },
})
</script>