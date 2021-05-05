<template>
    <div id="maincontrollerbox">
        <Login v-show="!loggedIn"/>
        <FlightsManager v-show="loggedIn" /><br/>
        <div id="uploadstatusmsgdiv">{{ uploadStatusMsg }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

import Login from './Login.vue';
import FlightsManager from './FlightsManager.vue';

export default defineComponent({
    components: {
        Login, FlightsManager
    },
    setup(){
        const store = useStore();
        const loggedIn = computed(() => store.getters.getLoggedInStatus);
        const uploadStatusMsg = computed(() => store.getters.getUploadStatusMsg);

        return { loggedIn, uploadStatusMsg }
    }
})
</script>
