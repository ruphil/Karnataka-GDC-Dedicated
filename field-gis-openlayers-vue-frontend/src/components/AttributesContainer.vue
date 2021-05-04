<template>
    <div id="attributescontainer">
        <div id="attributesbox">
            <select v-model="currentdronenumber">
                <option disabled value="0">Drone Number *</option>
                <option v-for="(dronenumberfeat, index) in dronenumbersGJ.features" v-bind:key="index">{{ dronenumberfeat.id.replace('tabledronenumbers.', '') }}</option>
            </select>&emsp;
            
            <input v-model="flightnumber" type="number" placeholder="Unique Flight No *" size="20"/>&emsp;

            <input v-model="flightid" type="text" size="20" disabled/>&emsp;
            
            <select v-model="flightcount">
                <option disabled value="0">Flight Count *</option>
                <option value="FLY-1">FLY-1</option>
                <option value="FLY-2">FLY-2</option>
                <option value="FLY-3">FLY-3</option>
                <option value="FLY-4">FLY-4</option>
                <option value="FLY-5">FLY-5</option>
                <option value="FLY-6">FLY-6</option>
                <option value="FLY-7">FLY-7</option>
                <option value="FLY-8">FLY-8</option>
            </select>&emsp;

            <select v-model="flightcategory">
                <option disabled value="0">Flight Project / Category *</option>
                <option>SVAMITVA</option>
                <option>LSMK_SVAMITVA</option>
                <option>LSMK</option>
                <option>Unsuccessful_Poor_Weather</option>
                <option>Unsuccessful_Technical_Issue</option>
                <option>Unsuccessful_High_WindSpeed</option>
                <option>Unsuccessful_Geotagging</option>
            </select>&emsp;

            <label for="flightdate">*</label>
            <input v-model="flightdate" type="date" />&emsp;
            
            <div>{{ attributesStatus }}</div>
            <button v-on:click="consolelog">Update Attributes</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    setup() {
        const store = useStore();
        const currentdronenumber = ref(0);
        const flightnumber = ref();
        
        const flightcount = ref(0);
        const flightcategory = ref(0);
        const flightdate = ref();

        const attributesStatus = ref('');

        const flightid = computed(() => {
            if(currentdronenumber.value != 0 && flightnumber.value != undefined){
                return currentdronenumber.value + '_' + flightnumber.value
            } else return '';
        });

        const variablerefs = { currentdronenumber, flightnumber, flightid, flightcount, flightcategory, flightdate, attributesStatus };
        
        const dronenumbersGJ = computed(() => store.getters.getDroneNumbersGJ);

        const consolelog = () => {
            let cond1 = currentdronenumber.value != 0;
            let cond2 = flightnumber.value != undefined && flightnumber.value != '';
            let cond3 = flightid.value != '';
            let cond4 = flightcount.value != 0;
            let cond5 = flightcategory.value != 0;
            let cond6 = flightdate.value != undefined;

            let condA = cond1 && cond2 && cond3 && cond4 && cond5 && cond6;
            if(condA){
                console.log(currentdronenumber.value, flightnumber.value, flightid.value, flightcount.value, flightcategory.value, flightdate.value);
                attributesStatus.value = 'Successfully Updated Attributes...';

                store.dispatch('setAttributesInfo', {
                    'DRONENUMBER': currentdronenumber.value,
                    'UNIQUEFLIGHTNUMBER': flightnumber.value,
                    'FLIGHTID': flightid.value,
                    'FLIGHTCOUNT': flightcount.value,
                    'FLIGHTCATEGORY': flightcategory.value,
                    'FLIGHTDATE': flightdate.value,
                });
            } else {
                attributesStatus.value = 'Error in Attributes...';
            }
        }

        return { ...variablerefs, dronenumbersGJ, consolelog }
    },
})
</script>
