<template>
    <div id="navbar">
        <div class="navbarcontainer">
            <img src="@/assets/logo.png" alt="">
            <div class="navbar">
                <div class="title">
                    <div class="gdc">Karnataka Geospatial Data Centre</div>
                    <div class="soi">Survey of India</div>
                </div>
                <button class="login" v-on:click="showloginBox = true">Log In</button>
            </div>
        </div>
        <div class="loginbox" v-show="showloginBox">
            <div class="inputcontainer">
                <input class="logininput" type="text" ref="username" placeholder="Username">
                <input class="logininput" type="password" ref="password" placeholder="Password" v-on:keyup.enter="doLogin">
                <div>{{ loginMsg }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import './NavBar.scss';

import authenticator from '@/composables/authenticator';

export default defineComponent({
    setup() {
        const showloginBox = ref(false);
        const loginMsg = ref('Press Enter To Continue');
        const { getUserRoles } = authenticator();
        const username = ref('');
        const password = ref('');
        
        const doLogin = () => {
            loginMsg.value = 'Please Wait...';
            console.log(2);
            getUserRoles(username.value, password.value);
        }
        
        

        return { showloginBox, loginMsg, doLogin }
    },
})
</script>
