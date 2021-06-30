<template>
    <div id="approot">
        <NavBar />
        <LoginBar v-show="!isLoggedIn"/>
        <NewUser v-show="isLoggedIn"/>
        <UsersSection v-show="isLoggedIn"/>
        <div class="globaltoast" ref="globalToastEl">{{ globaltoastmsg }}</div>
    </div>
</template>

<script lang="ts">
import './App.scss';

import { computed, defineComponent, onMounted, ref } from 'vue';
import NavBar from './components/NavBar.vue';
import LoginBar from './components/LoginBar.vue';
import NewUser from './components/NewUser.vue';
import UsersSection from './components/UsersSection.vue';
import store from './store';

export default defineComponent({
    name: 'App',
    components: {
      NavBar, LoginBar, UsersSection, NewUser
    },
  setup() {
    const globaltoastmsg = computed(() => store.getters.getGlobalToastMsg);
    const globalToastEl = ref();
    const isLoggedIn = computed(() => store.getters.getLoggedIn);
    
    const setTitle = () => {
      document.title = 'Karnataka Villages';
    }

    const setGlobalToastEl = () => {
      store.dispatch('setGlobalToastEl', globalToastEl);
    }

    onMounted(() => {
      setTitle();
      setGlobalToastEl();
    });
    return { globaltoastmsg, globalToastEl, isLoggedIn }
  }
});
</script>
