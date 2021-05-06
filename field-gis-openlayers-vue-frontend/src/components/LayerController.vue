<template>
    <div id="layercontrollercontainer">
        <div id="layercontroller">
            <select v-model="districtref">
                <option disabled value="">Select District</option>
                <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
            </select>
            <button class="olbtns" v-on:click="loadVillages">Load Villages</button>
            <button class="olbtns" v-on:click="loadFlights">Load Flights</button>
            <button class="olbtns" v-on:click="loadShapes">Load Shapes</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex';

import mapLoader from '../composables/mapLoader';

export default defineComponent({
    setup() {
        const store = useStore();

        const { loadVillagesWFS, loadFlightsWFS, loadShapesWFS } = mapLoader();
        
        const districtsList = computed(() => store.getters.getDistrictsList);
        const districtref = ref('');

        const loadVillages = () => {
            let districtname = districtref.value;
            loadVillagesWFS(districtname);
        }

        const loadFlights = () => {
            let districtname = districtref.value;
            loadFlightsWFS(districtname);
        }

        const loadShapes = () => {
            let districtname = districtref.value;
            loadShapesWFS(districtname);
        }

        return { districtsList, districtref, loadVillages, loadFlights, loadShapes }
    },
})
</script>
