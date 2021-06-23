<template>
  <NavBar />
  <LoginBar />
  <UsersTable />
</template>

<script lang="ts">
import './App.scss';

import { defineComponent } from 'vue';
import NavBar from './components/NavBar.vue';
import LoginBar from './components/LoginBar.vue';
import UsersTable from './components/UsersTable.vue';

export default defineComponent({
  name: 'App',
  components: {
    NavBar, LoginBar, UsersTable
  }
});
</script>
