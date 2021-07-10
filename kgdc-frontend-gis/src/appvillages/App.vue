<template>
  <div id="approot">
    <MapContainer v-if="isLoggedIn"/>
    <NavBar />
    <ControlsContainer v-if="isLoggedIn"/>
    <div class="globaltoast" ref="globalToastEl">{{ globaltoastmsg }}</div>
  </div>
</template>

<script lang="ts">
import './App.scss';

import NavBar from '@/appvillages/components/NavBar.vue';
import MapContainer from '@/appvillages/components/MapContainer.vue';
import ControlsContainer from '@/appvillages/components/ControlsContainer.vue';

import { computed, defineComponent, onMounted, ref } from 'vue';
import store from '@/shared/store';

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
      document.title = 'Karnataka Villages Manager';
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
