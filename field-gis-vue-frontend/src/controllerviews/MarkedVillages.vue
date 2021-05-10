<template>
    <div id="markedvillages">
        <div class="toolcontainer">
            <button class="toggletoolbox" v-on:click="showToolBox = !showToolBox"><span class="material-icons-outlined" title="ToolBox">handyman</span></button>
            <div class="toolbox" v-show="showToolBox">
                <span class="material-icons-outlined tool">file_upload</span>
                <span class="material-icons-outlined tool">file_download</span>
            </div>
        </div>

        <div class="layerscontainer">
            <button class="togglelayers" v-on:click="showLayers = !showLayers"><span class="material-icons-outlined" title="Manage Layers">layers</span></button>
            <div class="layers" v-show="showLayers">
                <div class="display-table">
                    <div>
                        <div><button class="olbtns" title="Load Karnataka Boundary"><span class="material-icons-outlined">border_clear</span></button></div>
                        <div>Load Karnataka Bounds</div>
                        <div>Load Karnataka Bounds</div>
                    </div>
                    <div>
                        <div>a</div>
                        <div>b</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { defineComponent, onMounted, ref } from 'vue'

import './MarkedVillages.scss';

export default defineComponent({
    setup() {
        const showToolBox = ref(false);
        const showLayers = ref(false);

        onMounted(() => {
            store.dispatch('setCategoryInfo', 'Add Marked Villages');
        });

        return { showToolBox, showLayers }
    },
})
</script>
