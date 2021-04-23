<template>
  <div>
    <div v-show="isAdmin">
      <router-link to="/attendanceregister" style="font-size: 25px">Go to Attendance Register</router-link>
      <router-link to="/users" style="font-size: 25px">Go to Users</router-link><br/>
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
