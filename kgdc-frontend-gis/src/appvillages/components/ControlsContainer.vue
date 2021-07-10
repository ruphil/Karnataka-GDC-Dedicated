<template>
    <div id="markedvillages">
        <div class="linemeasurecontainer">
            <button class="linemeasure" v-on:click="toggleLineMeasure"><span class="material-icons-outlined" title="Measure Line">straighten</span></button>
        </div>
        <div class="areameasurecontainer">
            <button class="areameasure" v-on:click="toggleAreaMeasure"><span class="material-icons-outlined" title="Measure Area">square_foot</span></button>
        </div>
        <ToolBox />
        <UserAttributes />
        <FilesContainer />
    </div>
</template>

<script lang="ts">
import './ControlsContainer.scss';

import { computed, defineComponent, onMounted, ref } from 'vue';

import ToolBox from './componentscontrols/ToolBox.vue';
import UserAttributes from './componentscontrols/UserAttributes.vue';
import FilesContainer from './componentscontrols/FilesContainer.vue';

import measureTools from '@/shared/composables/measureTools';

export default defineComponent({
    components: {
        ToolBox, UserAttributes, FilesContainer
    },
    setup() {
        const { toggleLineMeasure, toggleAreaMeasure } = measureTools();
        
        return { toggleLineMeasure, toggleAreaMeasure }
    },
})
</script>