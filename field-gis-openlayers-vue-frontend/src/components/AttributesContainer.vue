<template>
    <div id="attributescontainer">
        <div id="attributesbox">
            <select v-model="currentdronenumber">
                <option disabled selected>Drone Number</option>
                <option v-for="(dronenumberfeat, index) in dronenumbersGJ.features" v-bind:key="index">{{ dronenumberfeat.id.replace('tabledronenumbers.', '') }}</option>
            </select>&emsp;
            
            <input v-model="flightnumber" type="number" placeholder="Unique Flight No" size="20"/>&emsp;

            <input v-model="flightid" type="text" size="20"/>&emsp;
            
            <select v-model="flightcount">
                <option disabled selected>Flight Count</option>
                <option value="fly-1">FLY-1</option>
                <option value="fly-2">FLY-2</option>
                <option value="fly-3">FLY-3</option>
                <option value="fly-4">FLY-4</option>
                <option value="fly-5">FLY-5</option>
                <option value="fly-6">FLY-6</option>
                <option value="fly-7">FLY-7</option>
                <option value="fly-8">FLY-8</option>
            </select>&emsp;

            <select v-model="flightcategory">
                <option disabled selected>Flight Project / Category</option>
                <option>SVAMITVA</option>
                <option>LSMK_SVAMITVA</option>
                <option>LSMK</option>
                <option>Unsuccessful_Poor_Weather</option>
                <option>Unsuccessful_Technical_Issue</option>
                <option>Unsuccessful_High_WindSpeed</option>
                <option>Unsuccessful_Geotagging</option>
            </select>&emsp;

            <input v-model="flightdate" type="date" />&emsp;
            
            <button v-on:click="consolelog">test</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    setup() {
        const store = useStore();
        const currentdronenumber = ref();
        const flightnumber = ref();
        
        const flightcount = ref();
        const flightcategory = ref();
        const flightdate = ref();

        const flightid = computed(() => {
            if(currentdronenumber.value != undefined && flightnumber.value != undefined){
                return currentdronenumber.value + '_' + flightnumber.value
            } else return '';
        });

        const variablerefs = { currentdronenumber, flightnumber, flightid, flightcount, flightcategory, flightdate };
        
        const dronenumbersGJ = computed(() => store.getters.getDroneNumbersGJ);

        const consolelog = () => {
            console.log(currentdronenumber.value, flightnumber.value, flightid.value, flightcount.value, flightdate.value);
        }

        return { ...variablerefs, dronenumbersGJ, consolelog }
    },
})
</script>
