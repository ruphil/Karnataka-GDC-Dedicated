<template>
    <div class="loginsection" v-show="!loggedIn">
        <b>Kindly Login</b>
        <br/><br/>
        <input class="mobilenumber" type="text" size="20" placeholder="Username" v-model="username"/>
        <br/><br/>
        <input class="password" type="password" size="20" placeholder="Password" v-model="password" v-on:keyup.enter="doLogin"/>
        <br/><br/>
        <div id="loginstatus">{{ loginStatus }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default defineComponent({
    setup() {
        const store = useStore();

        const loggedIn = computed(() => store.getters.getLoggedInStatus);

        const username = ref('');
        const password = ref('');
        const loginStatus = ref('Press Enter To Continue...');

        const doLogin = () => {
            axios({
                method: 'POST',
                url: 'http://localhost:8080/geoserver/ows?service=wfs&version=2.0.0&request=GetCapabilities',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${username.value}:${password.value}`).toString('base64')}`
                }
            })
            .then((res) => {
                console.log(res.status);
                if(res.status == 200){
                    store.dispatch('setLoggedIn', true);
                }
            })
            .catch((reason: any) => {
                console.log(reason);
            })
            .finally(() => {
                username.value = '';
                password.value = '';
            })
        }

        return { loggedIn, username, password, loginStatus, doLogin }
    },
})
</script>
