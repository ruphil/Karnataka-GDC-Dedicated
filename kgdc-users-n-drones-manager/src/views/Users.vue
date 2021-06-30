<template>
  <div id="user">
    <UsersSection v-show="isLoggedIn"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import UsersSection from '@/components/UsersSection.vue';
import store from '@/store';

export default defineComponent({
  components: {
    UsersSection,
  },
  setup() {
    const isLoggedIn = computed(() => store.getters.getLoggedIn);

    return { isLoggedIn }
  }
})
</script>
