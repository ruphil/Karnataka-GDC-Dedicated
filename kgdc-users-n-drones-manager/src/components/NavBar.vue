<template>
  <div id="navbar">
    <div class="navcontainer">
      <span class="title">KGDC GIS Users and Data Manager</span>
      <span class="nav" v-show="isLoggedIn">
        <router-link to="/users">Users</router-link> |
        <router-link to="/drones">Drones</router-link>
      </span>
      <span class="logout" v-show="isLoggedIn" v-on:click="doLogout">
        <button>Logout</button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import './NavBar.scss';
import { computed, defineComponent, onMounted } from 'vue';
import store from '@/store';
import globalToast from '../composables/globalToast';

export default defineComponent({
  setup() {
    const { showGlobalToast } = globalToast();
    const isLoggedIn = computed(() => store.getters.getLoggedIn);

    const doLogout = () => {
      showGlobalToast('Logged Out...');
      store.dispatch('setLoggedIn', false);
      store.dispatch('setGlobalUsename', '');
      store.dispatch('setGlobalPassword', '');
      window.localStorage.removeItem('globalusername');
      window.localStorage.removeItem('globalpassword');
      location.reload();
    }

    return { doLogout, isLoggedIn }
  },
})
</script>
