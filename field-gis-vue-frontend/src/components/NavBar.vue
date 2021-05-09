<template>
  <div class="navbarcontainer">
    <div class="navbar">
      <span class="logo">
        <img src="../assets/logo.png" width="20"/>
      </span>
      <span class="user">
        <button class="loginbtn">Login</button>
      </span>
      <span class="title">Karnataka Geospatial Data Centre</span>
    </div>

    <div class="loginbox">
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import './NavBar.scss';

export default defineComponent({
  setup() {
    const username = ref('');
  },
})
</script>
