<template>
  <div id="navbarcontainer">
    <div class="navbar">
      <span class="logo" v-on:click="router.push({path: '/'})">
        <img src="../assets/logo.png" width="20"/>
      </span>
      <span class="functioncategory">
        {{ categoryInfo }}
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
import router from '@/router';
import store from '@/store';
import { defineComponent, ref, computed, onMounted } from 'vue';

import globalToast from '../composables/globalToast';
import userLoginCheck from '../composables/userLoginCheck';

import './NavBar.scss';

export default defineComponent({
  setup() {
    const { showGlobalToast } = globalToast();
    const { doAuthentication } = userLoginCheck();

    const categoryInfo = computed(() => store.getters.getCategoryInfo);
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

    const loadCredentials = () => {
      let globalusername = window.localStorage.getItem('globalusername')!;
      let globalpassword = window.localStorage.getItem('globalpassword')!;
      // console.log(globalusername, globalpassword);

      loginusername.value = globalusername;
      loginpassword.value = globalpassword;

      if(globalusername != undefined && globalpassword != undefined){
        console.log('came here 2');
        callAuthenticationPromiseFunction();
      }
    }

    onMounted(() => {
      loadCredentials();
    });

    const callAuthenticationPromiseFunction = () => {
      doAuthentication(loginusername.value, loginpassword.value)
      .then((responseObj: any) => {
        let roles = responseObj.roles;
        console.log('came here 1');
        console.log(roles);
        
        store.dispatch('setUserRoles', roles);
        
        doLoggedInTasks();
        showGlobalToast('Login Successful...');
      })
      .catch(() => {
        loginpassword.value = '';

        showGlobalToast('Invalid Username / Password...');
        window.localStorage.removeItem('globalusername');
        window.localStorage.removeItem('globalpassword');
      })
      .finally(() => {
        loginMsg.value = 'Press Enter To Continue...';
      });
    }

    const doLogin = (): void => {
      loginMsg.value = 'Please Wait...';
      callAuthenticationPromiseFunction();
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

    return { router, categoryInfo, isLoggedIn, globalusername, loginBoxShow, loginusername, loginpassword, loginMsg, doLogin, doLogout }
  },
})
</script>
