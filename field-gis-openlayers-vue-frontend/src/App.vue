<template>
  <div id="map">
    <Map />
    <Controller/>
  </div>
</template>

<script lang="ts">
import Map from './components/Map.vue';
import Controller from './components/ControllerContainer.vue';

import './App.scss';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    Map, Controller
  },
})
</script>