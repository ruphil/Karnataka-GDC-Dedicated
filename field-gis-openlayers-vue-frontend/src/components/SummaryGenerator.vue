<template>
    <div id="summarygeneratorcontainer">
        <div id="summarygenerator">
            <select v-model="currentdronenumber">
                <option disabled value="">Drone Number</option>
                <option v-for="(dronenumberfeat, index) in dronenumbersGJ.features" v-bind:key="index">{{ dronenumberfeat.id.replace('tabledronenumbers.', '') }}</option>
            </select>
            <br/>
            <button class="olbtns" v-on:click="fetchDetails">Fetch Details</button><br/>
            <button class="olbtns" v-on:click="generateSummary">Generate Summary</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

import summaryGenerator from '../composables/summaryGenerator';

export default defineComponent({
    setup() {
        const store = useStore();

        const dronenumbersGJ = computed(() => store.getters.getDroneNumbersGJ);
        const currentdronenumber = ref('');

        const fetchDetails = () => {

        }

        const generateSummary = () => {

        }
        
        return { dronenumbersGJ, currentdronenumber, fetchDetails, generateSummary };
    },
})
</script>
