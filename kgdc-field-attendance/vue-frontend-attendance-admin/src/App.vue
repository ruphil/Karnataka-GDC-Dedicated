<template>
  <div id="nav" v-show="isLoggedIn">
    <router-link to="/users">Users</router-link> |
    <router-link to="/register">AttendanceRegister</router-link>
  </div>
  <router-view/>
</template>

<script>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const route = useRouter();

    const isLoggedIn = computed(() => store.getters.getIsLoggedIn);

    const doOpeningCeremony = async () => {
      route.push({path: '/'});
    }

    onMounted(doOpeningCeremony);

    return { isLoggedIn }
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 12px;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
