<template>
  <div id="approot">
    <MapContainer v-if="isLoggedIn"/>
    <NavBar />
    <LeftSideBar v-if="karnboundsLoaded && isLoggedIn"/>
    <ControlsContainer v-if="karnboundsLoaded && isLoggedIn"/>
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

    const isLoggedIn = computed(() => store.getters.getLoggedIn);
    const karnboundsLoaded = computed(() => store.getters.getKarnBoundsLoaded);

    const setTitle = () => {
      document.title = 'Karnataka GDC, SOI';
    }

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
      // console.log(globalusername, globalpassword);

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
      setTitle();
      setGlobalToastEl(); 
      loadCredentials();
    });

    return { globaltoastmsg, globalToastEl, isLoggedIn, karnboundsLoaded }
  },
})
</script>
