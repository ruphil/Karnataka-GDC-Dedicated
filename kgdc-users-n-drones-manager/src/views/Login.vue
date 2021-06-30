<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <LoginComponent v-show="!isLoggedIn"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import LoginComponent from '@/components/LoginComponent.vue';
import store from '@/store';

export default defineComponent({
  name: 'Home',
  components: {
    LoginComponent,
  },
  setup() {
    const isLoggedIn = computed(() => store.getters.getLoggedIn);

    return { isLoggedIn }
  }
});
</script>
