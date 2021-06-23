<template>
    <div id="loginbar">
        <div class="title">Login To Continue</div><br/>
        <input type="text" placeholder="Username" v-model="adminuser"/><br/><br/>
        <input type="password" placeholder="Password" v-model="adminpass" v-on:keyup.enter="doLogin"/><br/><br/>
    </div>
</template>

<script lang="ts">
import './LoginBar.scss';
import { computed, defineComponent, ref } from 'vue';

import globalToast from '../composables/globalToast';
import userLoginCheck from '../composables/userLoginCheck';
import store from '@/store';

export default defineComponent({
    setup() {
        const { showGlobalToast } = globalToast();
        const { sendAuthenticationRequest } = userLoginCheck();

        const adminuser = ref('');
        const adminpass = ref('');

        const doLogin = (): void => {
            sendAuthenticationRequest(adminuser.value, adminpass.value);
        }

        return { adminuser, adminpass, doLogin };
    },
})
</script>
