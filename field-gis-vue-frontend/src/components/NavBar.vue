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
            <input class="mobilenumber" type="text" size="20" placeholder="Username" v-model="loginuser"/><br/><br/>
            <input class="password" type="password" size="20" placeholder="Password" v-model="loginpassword" v-on:keyup.enter="doLogin"/><br/><br/>
            <div style="font-size:12px;">Press Enter To Continue...</div>
          </span>
        </span>
      </span>
      <span class="loggedInSpan" v-show="isLoggedIn">
        <span>Welcome {{ globalusername }}</span>
        <button class="logoutbtn">Logout</button>
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

import './NavBar.scss';

export default defineComponent({
  setup() {
    const { showGlobalToast } = globalToast();

    const isLoggedIn = computed(() => store.getters.getLoggedIn);
    const globalusername = computed(() => store.getters.getUsername);

    const loginBoxShow = ref(false);
    const loginuser = ref('');
    const loginpassword = ref('');

    const doLogin = () => {
      showGlobalToast('logginin');
    }

    return { isLoggedIn, globalusername, loginBoxShow, loginuser, loginpassword, doLogin }
  },
})
</script>
