<template>
  <div class="navbarcontainer">
    <div class="navbar">
      <span class="logo">
        <img src="../assets/logo.png" width="20"/>
      </span>
      <span class="functioncategory">
        Flights Manager
      </span>
      <span class="notLoggedInSpan" v-show="!isLoggedIn">
        <button class="loginbtn" v-on:click="loginBoxShow = !loginBoxShow">Login</button>
        <span class="loginbox" v-show="loginBoxShow">
          <span class="logincomponents">
            <input class="mobilenumber" type="text" size="20" placeholder="Username" v-model="loginusername"/><br/><br/>
            <input class="password" type="password" size="20" placeholder="Password" v-model="loginpassword" v-on:keyup.enter="doLogin"/><br/><br/>
            <div style="font-size:12px;">{{ loginMsg }}</div>
          </span>
        </span>
      </span>
      <span class="loggedInSpan" v-show="isLoggedIn">
        <span>Welcome {{ globalusername }}</span>
        <button class="logoutbtn" v-on:click="doLogout">Logout</button>
      </span>
      <span class="title">Karnataka Geospatial Data Centre</span>
    </div>
    <div class="loginbox">
      
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store';
import { defineComponent, ref, computed } from 'vue';

import globalToast from '../composables/globalToast';
import userLoginCheck from '../composables/userLoginCheck';

import './NavBar.scss';

export default defineComponent({
  setup() {
    const { showGlobalToast } = globalToast();
    const { doAuthentication } = userLoginCheck();

    const isLoggedIn = computed(() => store.getters.getLoggedIn);
    const globalusername = computed(() => store.getters.getUsername);

    const loginBoxShow = ref(false);
    const loginusername = ref('');
    const loginpassword = ref('');
    const loginMsg = ref('Press Enter To Continue...');

    const doLoggedInTasks = () => {
      store.dispatch('setLoggedIn', true);
      store.dispatch('setGlobalUsename', loginusername.value);
      store.dispatch('setGlobalPassword', loginpassword.value);

      window.localStorage.setItem('globalusername', loginusername.value);
      window.localStorage.setItem('globalpassword', loginpassword.value);
    }

    const doLogin = (): void => {
      loginMsg.value = 'Please Wait...';

      doAuthentication(loginusername.value, loginpassword.value)
      .then(() => {
        doLoggedInTasks();
        showGlobalToast('Login Successful...');
      })
      .catch(() => {
        loginpassword.value = '';

        showGlobalToast('Invalid Username / Password...');
      })
      .finally(() => {
        loginMsg.value = 'Press Enter To Continue...';
      })
    }

    const doLogout = () => {
      showGlobalToast('Logged Out...');

      loginusername.value = '';
      loginpassword.value = '';

      store.dispatch('setLoggedIn', false);
      store.dispatch('setGlobalUsename', '');
      store.dispatch('setGlobalPassword', '');

      window.localStorage.removeItem('globalusername');
      window.localStorage.removeItem('globalpassword');
    }

    return { isLoggedIn, globalusername, loginBoxShow, loginusername, loginpassword, loginMsg, doLogin, doLogout }
  },
})
</script>
