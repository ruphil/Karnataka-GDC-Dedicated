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

export default defineComponent({
  components: {
    NavBar, LeftSideBar, MapContainer, ControlsContainer
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
  },
})
</script>
