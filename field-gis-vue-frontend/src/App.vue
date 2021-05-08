<template>
  <div id="app">
    <NavBar />
    <LeftSideBar />
    <MapContainer />
    <ControlsContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import NavBar from './components/Navbar.vue';
import LeftSideBar from './components/LeftSideBar.vue';
import MapContainer from './components/MapContainer.vue';
import ControlsContainer from './components/ControlsContainer.vue';

import './styles/NavBar.scss';

export default defineComponent({
  components: {
    NavBar, LeftSideBar, MapContainer, ControlsContainer
  },
  setup() {
    
  },
})
</script>
