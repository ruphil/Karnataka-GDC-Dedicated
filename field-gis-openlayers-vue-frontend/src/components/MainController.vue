<template>
    <div id="maincontrollerbox">
        <Login v-show="!loggedIn"/>
        Jack
    </div>
</template>

<script lang="ts">
import Login from './Login.vue';
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    components: {
        Login
    },
    setup(){
        const store = useStore();
        const loggedIn = computed(() => store.getters.getLoggedInStatus);

        return { loggedIn }
    }
})
</script>
