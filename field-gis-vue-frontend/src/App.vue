<template>
  <div id="approot">
    <NavBar />
    <LeftSideBar />
    <MapContainer />
    <ControlsContainer />
    <div class="latlon"></div>
    <div class="globaltoast" ref="globalToastEl">{{ globaltoastmsg }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';

import './App.scss';

import NavBar from './components/NavBar.vue';
import LeftSideBar from './components/LeftSideBar.vue';
import MapContainer from './components/MapContainer.vue';
import ControlsContainer from './components/ControlsContainer.vue';
import store from './store';

import globalToast from './composables/globalToast';
import userLoginCheck from './composables/userLoginCheck';

export default defineComponent({
  components: {
    NavBar, LeftSideBar, MapContainer, ControlsContainer
  },
  setup() {
    const { showGlobalToast } = globalToast();
    const { doAuthentication } = userLoginCheck();

    const globaltoastmsg = computed(() => store.getters.getGlobalToastMsg);
    const globalToastEl = ref();

    const setGlobalToastEl = () => {
      store.dispatch('setGlobalToastEl', globalToastEl);
    }

    const doLoggedInTasks = () => {
      store.dispatch('setLoggedIn', true);
      store.dispatch('setGlobalUsename', window.localStorage.getItem('globalusername'));
      store.dispatch('setGlobalPassword', window.localStorage.getItem('globalpassword'));
    }

    const loadCredentials = () => {
      let globalusername = window.localStorage.getItem('globalusername');
      let globalpassword = window.localStorage.getItem('globalpassword');

      if(globalusername != undefined && globalpassword != undefined){
        doAuthentication(globalusername, globalpassword)
        .then(() => {
          doLoggedInTasks();
          showGlobalToast('Welcome Back...');
        })
        .catch(() => {
          showGlobalToast('Invalid Username / Password...');

          window.localStorage.removeItem('globalusername');
          window.localStorage.removeItem('globalpassword');
        })
      }
    }

    onMounted(() => {
      setGlobalToastEl(); 
      loadCredentials();
    });

    return { globaltoastmsg, globalToastEl }
  },
})
</script>
