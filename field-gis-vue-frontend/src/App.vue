<template>
  <div class="app">
    <NavBar />
    <LeftSideBar />
    <MapContainer />
    <ControlsContainer />
    <div class="latlon"></div>
    <div class="globaltoast"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import './App.scss';

import NavBar from './components/NavBar.vue';
import LeftSideBar from './components/LeftSideBar.vue';
import MapContainer from './components/MapContainer.vue';
import ControlsContainer from './components/ControlsContainer.vue';

export default defineComponent({
  components: {
    NavBar, LeftSideBar, MapContainer, ControlsContainer
  },
  setup() {
    
  },
})
</script>
