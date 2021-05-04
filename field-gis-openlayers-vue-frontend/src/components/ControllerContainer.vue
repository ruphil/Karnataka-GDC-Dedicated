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
        <AttributesContainer v-show="showAttributesContainer" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

import MainController from './MainController.vue';
import AttributesContainer from './AttributesContainer.vue';

export default defineComponent({
    components: {
        MainController, AttributesContainer
    },
    setup() {
        const store = useStore();

        const showMainContainer = ref(false);
        const showLayersContainer = ref(false);
        const showSummaryContainer = ref(false);
        const showAttributesContainer = computed(() => store.getters.getAttributesContainerStatus);

        return { showMainContainer, showLayersContainer, showSummaryContainer, showAttributesContainer };
    }
})
</script>
