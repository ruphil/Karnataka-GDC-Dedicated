<template>
    <div id="controllercontainer">
        <div id="controllermainbtncontainer">
            <button id="controllermainbtn" v-on:click="showMainContainer = !showMainContainer" title="Flights Manager">⚙</button>
        </div>
        <div id="controllerlayersbtncontainer" v-show="loggedIn">
            <button id="controllerlayersbtn" v-on:click="showLayersContainer = !showLayersContainer" title="Layers Manager">🗐</button>
        </div>
        <div id="controllersummarybtncontainer" v-show="loggedIn">
            <button id="controllersummarybtn" v-on:click="showSummaryContainer = !showSummaryContainer" title="Summary Generator">⎙</button>
        </div>
        <MainController v-show="showMainContainer" />
        <LayerController v-show="showLayersContainer" />
        <SummaryGenerator v-show="showSummaryContainer" />
        <AttributesGlimpse />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

import MainController from './MainController.vue';
import AttributesGlimpse from './AttributesGlimpse.vue';

import LayerController from './LayerController.vue';
import SummaryGenerator from './SummaryGenerator.vue';

export default defineComponent({
    components: {
        MainController, AttributesGlimpse, LayerController, SummaryGenerator
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
