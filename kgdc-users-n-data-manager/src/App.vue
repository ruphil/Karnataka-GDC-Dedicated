<template>
  <div id="approot">
    <NavBar />
    <router-view/>
    <div class="globaltoast" ref="globalToastEl">{{ globaltoastmsg }}</div>
  </div>
</template>

<script lang="ts">
import './App.scss';
import { computed, defineComponent, onMounted, ref } from 'vue';
import router from './router';

import NavBar from '@/components/NavBar.vue';
import store from '@/store';

export default defineComponent({
  components: {
    NavBar
  },
  setup() {
    const globaltoastmsg = computed(() => store.getters.getGlobalToastMsg);
    const globalToastEl = ref();
    const isLoggedIn = computed(() => store.getters.getLoggedIn);
    
    const setTitle = () => {
      document.title = 'Users and Drones Manager';
    }

    const setGlobalToastEl = () => {
      store.dispatch('setGlobalToastEl', globalToastEl);
    }

    const routeCorrectly = () => {
      if(isLoggedIn.value){
        router.push('/users');
      } else {
        router.push('/');
      }
    }

    onMounted(() => {
      setTitle();
      setGlobalToastEl();
      routeCorrectly();
    });

    return { globaltoastmsg, globalToastEl, isLoggedIn }
  },
})
</script>
