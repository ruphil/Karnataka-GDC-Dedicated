<template>
    <div id="loginbar">
        <div class="title">Login To Continue</div><br/>
        <input type="text" placeholder="Username" v-model="adminuser"/><br/><br/>
        <input type="password" placeholder="Password" v-model="adminpass" v-on:keyup.enter="doLogin"/><br/><br/>
    </div>
</template>

<script lang="ts">
import './LoginComponent.scss';
import { computed, defineComponent, onMounted, ref } from 'vue';

import userLoginCheck from '../composables/userLoginCheck';
import store from '@/store';

export default defineComponent({
    setup() {
        const { sendAuthenticationRequest } = userLoginCheck();

        const adminuser = ref('');
        const adminpass = ref('');

        const doLogin = (): void => {
            sendAuthenticationRequest(adminuser.value, adminpass.value);
        }

        const fetchUserCredFromDisk = () => {
            let globalusername = window.localStorage.getItem('globalusername')!;
            let globalpassword = window.localStorage.getItem('globalpassword')!;
            // console.log(globalusername, globalpassword);
            adminuser.value = globalusername;
            adminpass.value = globalpassword;
            
            if(globalusername != undefined && globalpassword != undefined){
                sendAuthenticationRequest(adminuser.value, adminpass.value);
            }
        }

        onMounted(() => {
            fetchUserCredFromDisk();
        });

        return { adminuser, adminpass, doLogin };
    },
})
</script>
