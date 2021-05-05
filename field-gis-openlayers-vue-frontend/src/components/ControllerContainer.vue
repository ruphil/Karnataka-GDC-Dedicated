<template>
    <div id="controllercontainer">
        <div id="controllermainbtncontainer">
            <button id="controllermainbtn" v-on:click="showMainContainer = !showMainContainer">⚙</button>
        </div>
        <div id="controllerlayersbtncontainer">
            <button id="controllerlayersbtn" v-on:click="showLayersContainer = !showLayersContainer">🗐</button>
        </div>
        <div id="controllersummarybtncontainer">
            <button id="controllersummarybtn" v-on:click="showSummaryContainer = !showSummaryContainer">⎙</button>
        </div>
        <MainController v-show="showMainContainer" />
        <SummaryAttributesContainer />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

import MainController from './MainController.vue';
import SummaryAttributesContainer from './SummaryAttributesContainer.vue';

export default defineComponent({
    components: {
        MainController, SummaryAttributesContainer
    },
    setup() {
        const showMainContainer = ref(false);
        const showLayersContainer = ref(false);
        const showSummaryContainer = ref(false);       

        return { showMainContainer, showLayersContainer, showSummaryContainer };
    }
})
</script>
