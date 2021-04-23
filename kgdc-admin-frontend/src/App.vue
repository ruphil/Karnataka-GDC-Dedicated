<template>
  <div id="nav">
    <div v-show="isAdmin">
      <router-link to="/users">Users</router-link><br/> |
      <router-link to="/attendanceregister">Attendance Register</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const route = useRouter();
    const store = useStore();

    const doOpeningCeremony = async () => {
      route.push({path: '/'});
    }

    onMounted(doOpeningCeremony);

    const isAdmin = computed(() => store.getters.isAdmin);

    return { isAdmin }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
