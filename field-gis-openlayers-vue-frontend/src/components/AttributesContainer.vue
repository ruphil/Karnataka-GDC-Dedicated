<template>
    <div id="attributescontainer">
        <div id="attributesbox">
            <button class="olbtns" style="float: left;">Attributes</button>
            <span style="float: right;">{{ attributesStatus }}</span>
            <div v-show="firstPage">
                <button class="olbtns" v-on:click="firstPage = !firstPage">Go to Page 2</button><br/>

                <select v-model="currentdronenumber">
                    <option disabled value="0">Drone Number *</option>
                    <option v-for="(dronenumberfeat, index) in dronenumbersGJ.features" v-bind:key="index">{{ dronenumberfeat.id.replace('tabledronenumbers.', '') }}</option>
                </select>
                
                <input v-model="flightnumber" type="number" placeholder="Unique Flight No *"/>

                <input v-model="flightid" type="text" disabled/>
                
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
                </select>

                <select v-model="flightcategory">
                    <option disabled value="0">Flight Project / Category *</option>
                    <option>SVAMITVA</option>
                    <option>LSMK_SVAMITVA</option>
                    <option>LSMK</option>
                    <option>Unsuccessful_Poor_Weather</option>
                    <option>Unsuccessful_Technical_Issue</option>
                    <option>Unsuccessful_High_WindSpeed</option>
                    <option>Unsuccessful_Geotagging</option>
                </select>

                <div>
                    <label for="flightdate">Flight Date *</label>
                    <input type="date" />
                </div>

                <div style="display: inline-block;">
                    <label for="takeofftime">Takeoff Time</label>
                    <input type="time" />&emsp;
                </div>

                <div style="display: inline-block;">
                    <label for="landingtime">Landing Time</label>
                    <input type="time" />&emsp;
                </div>

                <div style="display: inline-block;">
                    <label for="duration">Duration</label>
                    <input type="time" />&emsp;
                </div>

                <select>
                    <option disabled value="0">Training Flight</option>
                    <option>No</option>
                    <option>Yes</option>
                </select>

                <select>
                    <option disabled value="0">Fresh / Refly</option>
                    <option>Fresh</option>
                    <option>Refly</option>
                </select>

                <input type="number" placeholder="Area Covered (sq.km.)"/>
                <input type="number" placeholder="Flying Height (m)"/>
                <input type="text" placeholder="Overlap Used"/>
                <input type="text" placeholder="Temperature °C"/>
                <input type="text" placeholder="Windspeed (m/s)"/>
                <input type="text" placeholder="Pilot Name"/>
                <input type="text" placeholder="Field Assistant"/>
                <input type="text" placeholder="Camping Area"/>

                <select>
                    <option disabled value="0">Select District</option>
                    <option>Fresh</option>
                    <option>Refly</option>
                </select>
            
            </div>
            <div v-show="!firstPage">
                <button class="olbtns" v-on:click="firstPage = !firstPage">Go to Page 1</button><br/>

                <input type="text" placeholder="Taluk"/>
                <input type="text" placeholder="Gram Panchayat"/>
                <textarea placeholder="Villages"></textarea>
                <textarea placeholder="Hamlets"></textarea>
                <textarea placeholder="LGD Codes (separated by commas)"></textarea>
                <input type="number" placeholder="Village Count"/>
                <input type="number" placeholder="Hamlets Count"/>
                <input type="text" placeholder="Software Version"/>
                <input type="text" placeholder="Base GPS ID"/>
                <input type="number" placeholder="Raw Images"/>
                <input type="number" placeholder="Geotagged"/>
                <input type="text" placeholder="Avg. GSD. (cm)"/>
                <input type="text" placeholder="Fly Log No"/>
                <input type="number" placeholder="Total Files"/>
                <input type="text" placeholder="Folder Size (GB)"/>
                <textarea placeholder="Remarks"></textarea>

            </div>
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
        const firstPage = ref(true);
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

        const variablerefs1 = { firstPage, currentdronenumber, flightnumber, flightid, flightcount, flightcategory, flightdate };
        const variablerefs2 = { ...variablerefs1, attributesStatus };
        
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
                    "TAKEOFFTIME":null,"landingtime":null,"duration":null,"trainingflight":null,"freshrefly":null,"area":null,"uavheight":null,"overlap":null,"temperature":null,"windspeed":null,"pilotname":null,"fieldassistant":null,"campingarea":null,"district":null,"taluk":null,"grampanchayat":null,"villages":null,"hamlets":null,"lgdcodes":null,"villagescount":null,"hamletscount":null,"softwareversion":null,"droneversion":null,"basegpsid":null,"rawimagescount":null,"geotagged":null,"avggsd":null,"batteryno":null,"flylogno":null,"totalfiles":null,"foldersizegb":null
                });
            } else {
                attributesStatus.value = 'Error in Attributes...';
            }
        }

        return { ...variablerefs2, dronenumbersGJ, consolelog }
    },
})
</script>
