<template>
    <div id="markedvillages">
        <div class="toolcontainer">
            <button class="toggletoolbox" v-on:click="showToolBox = !showToolBox"><span class="material-icons-outlined" title="ToolBox">handyman</span></button>
            <div class="toolbox" v-show="showToolBox">
                <span class="material-icons-outlined tool" v-on:click="loadkml">file_upload</span>
                <span class="material-icons-outlined tool">file_download</span>
            </div>
        </div>

        <div class="boundscontainer">
            <button class="togglebounds" v-on:click="showbounds = !showbounds"><span class="material-icons-outlined" title="Manage Boundaries">fence</span></button>
            <div class="bounds" v-show="showbounds">
                <div class="display-table">
                    <div>
                        <div><button class="olbtns" v-on:click="loadBaseMapToExtent">Load Basemap To Extent</button></div>
                        <div>
                            <select v-model="districtref" style="font-size:0.5em;">
                                <option disabled value="">Select District</option>
                                <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
                            </select>
                        </div>
                        <div><button class="olbtns">Load Villages In View N By District</button></div>
                        <div><button class="olbtns" v-on:click="unloadVillagesBounds">Unload Villages</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns" v-on:click="unloadBaseMap">Unload BaseMap</button></div>
                        <div><button class="olbtns" v-on:click="loadVillagesBoundsRef">Load Villages By District</button></div>
                        <div><button class="olbtns">Load Marked Settlements In View N By District</button></div>
                        <div><button class="olbtns">Unload Marked Settlements</button></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent, onMounted, ref } from 'vue'

import './MarkedSettlements.scss';

import karnBoundsLoader from '../composables/karnBoundsLoader';
import villagesBoundsLoader from '../composables/villagesBoundsLoader';
import baseMapLoader from '../composables/baseMapLoader';

export default defineComponent({
    setup() {
        onMounted(() => {
            store.dispatch('setCategoryInfo', 'Add Marked Villages');
        });

        const { loadKarnBounds } = karnBoundsLoader();
        const { loadVillagesBounds, unloadVillagesBounds } = villagesBoundsLoader();
        const { loadBaseMapToExtent, unloadBaseMap } = baseMapLoader();

        const return0 = { loadKarnBounds, unloadVillagesBounds, loadBaseMapToExtent, unloadBaseMap };

        const districtsList = computed(() => store.getters.getDistrictsList);
        const districtref = ref('');
        const loadedDistrict = ref('');

        const showToolBox = ref(false);
        const showbounds = ref(false);

        const loadVillagesBoundsRef = () => {
            if(districtref.value != '' && loadedDistrict.value != districtref.value){
                loadVillagesBounds(districtref.value);
                loadedDistrict.value = districtref.value;
            }
        }

        const loadkml = () => {
            console.log(2);
        }

        const return1 = { loadVillagesBoundsRef, districtsList, districtref, showToolBox, showbounds, loadkml }
        
        return { ...return0, ...return1 }
    },
})
</script>
