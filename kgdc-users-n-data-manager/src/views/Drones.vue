<template>
  <div id="drones">
    <NewDrone v-show="isLoggedIn"/>
    <DronesSection v-show="isLoggedIn"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import store from '@/store';

import NewDrone from '@/components/NewDrone.vue';
import DronesSection from '@/components/DronesSection.vue';

export default defineComponent({
  components: {
    DronesSection, NewDrone
  },
  setup() {
    const isLoggedIn = computed(() => store.getters.getLoggedIn);

    return { isLoggedIn }
  }
})
</script>
