<template>
  <div id="map">
    <div><Map /></div>
    <div id="controllercontainer"><Controller /></div>
  </div>
</template>

<script lang="ts">
import Map from './components/Map.vue';
import Controller from './components/Controller.vue';

import './App.scss';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    Map, Controller
  },
})
</script>