<template>
  <div id="navbarcontainer">
    <div class="navbar">
      <span class="logo">
        <img src="@/assets/logo.png" width="30" title="Survey of India"/>
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
        <span class="useraction" v-on:click="toggleUserBox">{{ globalusername }}</span>
        <button class="logoutbtn" v-on:click="doLogout">Logout</button>
      </span>
      <span class="titlekgdc">Karnataka Geospatial Data Centre</span>
    </div>
    <div class="userbox" v-show="userBox">
      <div class="userdetails">
        <button class="closebtn" v-on:click="closeUserBox">X</button>
        <div>UserName: {{ globalusername }}</div>
        <div>Description: {{ userDetails.description }}</div>
        <div>ROLES: {{ userRoles }}</div>
      </div>
      <div class="changepassword">
        <div>Change Password</div>
        <input type="text" v-model="oldpassword" placeholder="Old Password"/><br/>
        <input type="password" v-model="newpassword" placeholder="New Password"/><br/>
        <input type="text" v-model="renewpassword" placeholder="Retype New Password"/><br/>
        <button class="updateaction" v-on:click="callUpdatePassword">Update Password</button>
      </div>
      <div>Mobile Number: {{ userDetails.mobilenumber }}</div>
      <div>
        <input type="number" size="10" v-model="newmobilenumber"><br>
        <button class="updateaction" v-on:click="callUpdateMobile">Update Mobile Number</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import './NavBar.scss';

import store from '@/shared/store';
import { defineComponent, ref, computed, onMounted } from 'vue';
import './NavBar.scss';
import globalToast from '@/shared/composables/globalToast';
import userLoginCheck from '@/shared/composables/userLoginCheck';
import mobilepasswordUpdation from '@/shared/composables/mobilepasswordUpdation';

export default defineComponent({
  setup() {
    const { showGlobalToast } = globalToast();
    const { sendAuthenticationRequest } = userLoginCheck();
    const { updatePassword, updateMobile } = mobilepasswordUpdation();

    const isLoggedIn = computed(() => store.getters.getLoggedIn);
    const globalusername = computed(() => store.getters.getUsername);
    const userRoles = computed(() => store.getters.getUserRoles);
    const userDetails = computed(() => store.getters.getUserDetails);
    
    const loginBoxShow = ref(false);
    const userBox = computed(() => store.getters.getShowUserBox);

    const toggleUserBox = () => {
      if(store.getters.getShowUserBox){
        closeUserBox();
      } else {
        showUserBox();
      }
    }

    const closeUserBox = () => {
      store.dispatch('setShowUserBox', false);
    }

    const showUserBox = () => {
      store.dispatch('setShowUserBox', true);
    }

    const loginusername = ref('');
    const loginpassword = ref('');

    const oldpassword = ref('');
    const newpassword = ref('');
    const renewpassword = ref('');

    const newmobilenumber = ref('');

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

    const callUpdatePassword = () => {
      if(newpassword.value != renewpassword.value){
        showGlobalToast('Passwords do not match');
        return 0;
      } else {
        updatePassword(oldpassword.value, newpassword.value);
      }

      oldpassword.value = '';
      newpassword.value = '';
      renewpassword.value = '';
    }

    const callUpdateMobile = () => {
      if(newmobilenumber.value == '' || newmobilenumber.value.length != 10){
        showGlobalToast('Please Enter Valid Mobile Number');
        return 0;
      } else {
        updateMobile(newmobilenumber.value);
      }

      newmobilenumber.value = '';
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

    return { 
      isLoggedIn, globalusername, userRoles, userDetails, 
      loginBoxShow, userBox, loginusername, loginpassword, 
      oldpassword, newpassword, renewpassword, newmobilenumber,
      toggleUserBox, closeUserBox, showUserBox,
      doLogin, callUpdatePassword, callUpdateMobile, doLogout 
    }
  },
})
</script>
