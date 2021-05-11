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
                        <div>
                            <select v-model="districtref" style="font-size:0.5em;">
                                <option disabled value="">Select District</option>
                                <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
                            </select>
                        </div>
                        <div><button class="olbtns">Load District Villages</button></div>
                        <div><button class="olbtns">Load Marked Villages By District</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns" v-on:click="loadKarnBounds">Load Karnataka Boundary</button></div>
                        <div><button class="olbtns">Load District Villages In View</button></div>
                        <div><button class="olbtns">Load Marked Villages In View</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns" v-on:click="unloadKarnBounds">Unload Karnataka Boundary</button></div>
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
import { computed, defineComponent, onMounted, ref } from 'vue'

import './MarkedVillages.scss';

import karnBoundsLoader from '../composables/karnBoundsLoader';

export default defineComponent({
    setup() {
        const { loadKarnBounds, unloadKarnBounds } = karnBoundsLoader();

        const districtsList = computed(() => store.getters.getDistrictsList);
        const districtref = ref('');

        const showToolBox = ref(false);
        const showbounds = ref(false);

        const return1 = { loadKarnBounds, unloadKarnBounds, districtsList, districtref, showToolBox, showbounds }

        onMounted(() => {
            store.dispatch('setCategoryInfo', 'Add Marked Villages');
        });

        return { ...return1 }
    },
})
</script>
