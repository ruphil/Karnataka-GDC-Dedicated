<template>
  <div id="map">
    <Map />
    <ControllerContainer/>
  </div>
</template>

<script lang="ts">
import Map from './components/Map.vue';
import ControllerContainer from './components/ControllerContainer.vue';

import './App.scss';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    Map, ControllerContainer
  },
})
</script>