<template>
  <NavBar />
  <MapContainer />
  <ControlsContainer />
  <div class="globaltoast" ref="globalToastEl">{{ globaltoastmsg }}</div>
</template>

<script lang="ts">
import './App.scss';

import NavBar from './components/NavBar.vue';
import MapContainer from './components/MapContainer.vue';
import ControlsContainer from './components/ControlsContainer.vue';
import { computed, defineComponent, onMounted, ref } from 'vue';
import store from './store';

export default defineComponent({
  name: 'App',
  components: {
    NavBar, MapContainer, ControlsContainer
  },
  setup() {
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

    onMounted(() => {
      setTitle();
      setGlobalToastEl();
    });
    return { globaltoastmsg, globalToastEl, isLoggedIn, karnboundsLoaded }
  }
});
</script>
