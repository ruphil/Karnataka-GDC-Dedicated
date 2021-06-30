<template>
  <div id="drones">
    <NewDrone v-show="isLoggedIn"/>
    <DroneSection v-show="isLoggedIn"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import store from '@/store';

import NewDrone from '@/components/NewDrone.vue';
import DroneSection from '@/components/DroneSection.vue';

export default defineComponent({
  components: {
    DroneSection, NewDrone
  },
  setup() {
    const isLoggedIn = computed(() => store.getters.getLoggedIn);

    return { isLoggedIn }
  }
})
</script>
