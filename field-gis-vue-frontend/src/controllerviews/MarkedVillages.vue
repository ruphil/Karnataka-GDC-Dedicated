<template>
    <div id="markedvillages">
        <div class="toolcontainer">
            <button class="togglebtn" v-on:click="showToolBox = !showToolBox"><span class="material-icons-outlined">handyman</span></button>
            <div class="toolbox" v-show="showToolBox">
                <span class="material-icons-outlined tool">file_upload</span>
                <span class="material-icons-outlined tool">file_download</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import './MarkedVillages.scss';

export default defineComponent({
    setup() {
        const showToolBox = ref(false);

        return { showToolBox }
    },
})
</script>
