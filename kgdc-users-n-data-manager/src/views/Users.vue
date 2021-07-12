<template>
  <div id="user">
    <NewUser v-show="isLoggedIn"/>
    <UsersSection v-show="isLoggedIn"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import store from '@/store';

import NewUser from '@/components/NewUser.vue';
import UsersSection from '@/components/UsersSection.vue';

export default defineComponent({
  components: {
    UsersSection, NewUser
  },
  setup() {
    const isLoggedIn = computed(() => store.getters.getLoggedIn);

    return { isLoggedIn }
  }
})
</script>
