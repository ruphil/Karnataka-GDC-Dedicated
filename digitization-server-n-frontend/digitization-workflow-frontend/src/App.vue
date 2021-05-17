<template>
  <div id="app">
    <NavBar />
    <MainInterface />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import NavBar from '@/components/NavBar.vue';
import MainInterface from '@/components/MainInterface.vue';

export default defineComponent({
  components: {
    NavBar, MainInterface
  },
  setup() {
    
  },
})
</script>


