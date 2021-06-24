<template>
  <div id="navbarcontainer">
    <div class="navbar">
      <span class="logo">
        <img src="../assets/logo.png" width="30" title="Survey of India"/>
      </span>
      &emsp;&emsp;
      <span class="titlecontainer">
          <span class="titlesoi">Survey of India</span>
      </span>
      <span class="notLoggedInSpan" v-show="!isLoggedIn">
        <button class="loginbtn" v-on:click="loginBoxShow = !loginBoxShow">Login</button>
        <span class="loginbox" v-show="loginBoxShow">
          <span class="logincomponents">
            <input class="mobilenumber" type="text" size="20" placeholder="Username" v-model="loginusername"/><br/><br/>
            <input class="password" type="password" size="20" placeholder="Password" v-model="loginpassword" v-on:keyup.enter="doLogin"/><br/><br/>
            <div style="font-size:12px;">Press Enter To Continue...</div>
          </span>
        </span>
      </span>
      <span class="loggedInSpan" v-show="isLoggedIn">
        <span class="useraction" v-on:click="userBox = !userBox">{{ globalusername }}</span>
        <button class="logoutbtn" v-on:click="doLogout">Logout</button>
      </span>
      <span class="titlekgdc">Karnataka Geospatial Data Centre</span>
    </div>
    <div class="userbox" v-show="userBox">
      <div class="userdetails">
        <button class="closebtn" v-on:click="userBox = false">X</button>
        <div>UserName: {{ globalusername }}</div>
        <div>ROLES: {{ globalusername }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import './NavBar.scss';

import store from '@/store';
import { defineComponent, ref, computed, onMounted } from 'vue';
import './NavBar.scss';
import globalToast from '../composables/globalToast';
import userLoginCheck from '../composables/userLoginCheck';
export default defineComponent({
  setup() {
    const { showGlobalToast } = globalToast();
    const { sendAuthenticationRequest } = userLoginCheck();

    const isLoggedIn = computed(() => store.getters.getLoggedIn);
    const globalusername = computed(() => store.getters.getUsername);
    const userRoles = computed(() => store.getters.getUserRoles);
    
    const loginBoxShow = ref(false);
    const userBox = ref(false);

    const loginusername = ref('');
    const loginpassword = ref('');

    const loadCredentials = () => {
      let globalusername = window.localStorage.getItem('globalusername')!;
      let globalpassword = window.localStorage.getItem('globalpassword')!;
      // console.log(globalusername, globalpassword);
      loginusername.value = globalusername;
      loginpassword.value = globalpassword;
      
      if(globalusername != undefined && globalpassword != undefined){
        sendAuthenticationRequest(loginusername.value, loginpassword.value);
      }
    }

    onMounted(() => {
      loadCredentials();
    });

    const doLogin = (): void => {
      sendAuthenticationRequest(loginusername.value, loginpassword.value);
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
      location.reload();
    }

    return { isLoggedIn, globalusername, userRoles, loginBoxShow, userBox, loginusername, loginpassword, doLogin, doLogout }
  },
})
</script>
