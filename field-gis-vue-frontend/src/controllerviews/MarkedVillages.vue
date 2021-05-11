<template>
    <div id="markedvillages">
        <div class="toolcontainer">
            <button class="toggletoolbox" v-on:click="showToolBox = !showToolBox"><span class="material-icons-outlined" title="ToolBox">handyman</span></button>
            <div class="toolbox" v-show="showToolBox">
                <span class="material-icons-outlined tool">file_upload</span>
                <span class="material-icons-outlined tool">file_download</span>
            </div>
        </div>

        <div class="boundscontainer">
            <button class="togglebounds" v-on:click="showbounds = !showbounds"><span class="material-icons-outlined" title="Load Bounds">layers</span></button>
            <div class="bounds" v-show="showbounds">
                <div class="display-table">
                    <div>
                        <div><button class="olbtns" v-on:click="loadkarnbounds">Load Karnataka Boundary</button></div>
                        <div><button class="olbtns">Load District Villages</button></div>
                        <div><button class="olbtns">Load Marked Villages By District</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns">Unload Karnataka Boundary</button></div>
                        <div><button class="olbtns">Load District Villages In View</button></div>
                        <div><button class="olbtns">Load Marked Villages In View</button></div>
                    </div>
                    <div>
                        <div>Select District</div>
                        <div><button class="olbtns">Unload District Villages</button></div>
                        <div><button class="olbtns">Unload Marked Villages</button></div>
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

import mapBoundsLoader from '../composables/mapBoundsLoader';

export default defineComponent({
    setup() {
        const { loadKarnBounds } = mapBoundsLoader();

        const showToolBox = ref(false);
        const showbounds = ref(false);

        onMounted(() => {
            store.dispatch('setCategoryInfo', 'Add Marked Villages');
        });

        const loadkarnbounds = () => {
            console.log(2);
            loadKarnBounds();
        }

        return { showToolBox, showbounds, loadkarnbounds }
    },
})
</script>
