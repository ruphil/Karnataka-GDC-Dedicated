<template>
    <div id="loginbar" v-show="!isLoggedIn">
        <div class="title">Login To Continue</div><br/>
        <input type="text" placeholder="Username" v-model="adminuser"/><br/><br/>
        <input type="password" placeholder="Password" v-model="adminpass"/><br/><br/>
        <button v-on:click="doLogin">Log In</button>
    </div>
</template>

<script lang="ts">
import './LoginBar.scss';
import { computed, defineComponent, ref } from 'vue';
import store from '@/store';

export default defineComponent({
    setup() {
        const isLoggedIn = computed(() => store.getters.isLoggedIn);
        const adminuser = ref('');
        const adminpass = ref('');

        const doLogin = () => {
            console.log(adminuser.value, adminpass.value);
        }

        return { isLoggedIn, adminuser, adminpass, doLogin };
    },
})
</script>
