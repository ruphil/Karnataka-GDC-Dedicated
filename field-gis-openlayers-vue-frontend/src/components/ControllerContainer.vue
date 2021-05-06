<template>
    <div id="controllercontainer">
        <div id="controllermainbtncontainer">
            <button id="controllermainbtn" v-on:click="showMainContainer = !showMainContainer">⚙</button>
        </div>
        <div id="controllerlayersbtncontainer" v-show="loggedIn">
            <button id="controllerlayersbtn" v-on:click="showLayersContainer = !showLayersContainer">🗐</button>
        </div>
        <div id="controllersummarybtncontainer" v-show="loggedIn">
            <button id="controllersummarybtn" v-on:click="showSummaryContainer = !showSummaryContainer">⎙</button>
        </div>
        <MainController v-show="showMainContainer" />
        <SummaryAttributesContainer />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

import MainController from './MainController.vue';
import SummaryAttributesContainer from './SummaryAttributesContainer.vue';

export default defineComponent({
    components: {
        MainController, SummaryAttributesContainer
    },
    setup() {
        const store = useStore();

        const showMainContainer = ref(false);
        const showLayersContainer = ref(false);
        const showSummaryContainer = ref(false);  
        
        const loggedIn = computed(() => store.getters.getLoggedInStatus);

        return { loggedIn, showMainContainer, showLayersContainer, showSummaryContainer };
    }
})
</script>
