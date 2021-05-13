<template>
  <div id="blankhome"></div>
</template>

<script lang="ts">
import store from '@/store';
import { defineComponent, onMounted } from 'vue'

import './BlankHome.scss';

export default defineComponent({
  setup() {
    onMounted(() => {
      store.dispatch('setCategoryInfo', 'Home');
    });
  },
})
</script>
