<template>
    <div id="summaryattributescontainer">
        <div id="attributesbox" v-show="showAttributesContainer">
            <button class="olbtns" style="float: left;">Attributes</button>
            <span style="float: right;">{{ attributesStatus }}</span>
            <div v-show="firstPage">
                <button class="olbtns" v-on:click="firstPage = !firstPage">Go to Page 2</button><br/>

                <select v-model="currentdronenumber">
                    <option disabled value="">Drone Number *</option>
                    <option v-for="(dronenumberfeat, index) in dronenumbersGJ.features" v-bind:key="index">{{ dronenumberfeat.id.replace('tabledronenumbers.', '') }}</option>
                </select>
                
                <input v-model="flightnumber" type="number" placeholder="Unique Flight No *"/>

                <input v-model="flightid" type="text" disabled/>
                
                <select v-model="flightcount">
                    <option disabled value="">Flight Count *</option>
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
                    <option disabled value="">Flight Project / Category *</option>
                    <option>SVAMITVA</option>
                    <option>LSMK_SVAMITVA</option>
                    <option>LSMK</option>
                    <option>Unsuccessful_Poor_Weather</option>
                    <option>Unsuccessful_Technical_Issue</option>
                    <option>Unsuccessful_High_WindSpeed</option>
                    <option>Unsuccessful_Geotagging</option>
                </select>

                <div>
                    <label>Flight Date *</label>
                    <input v-model="flightdate" type="date" />
                </div>

                <div style="display: inline-block;">
                    <label>Takeoff Time</label>
                    <input v-model="takeofftime" type="time" />&emsp;
                </div>

                <div style="display: inline-block;">
                    <label>Landing Time</label>
                    <input v-model="landingtime" type="time" />&emsp;
                </div>

                <div style="display: inline-block;">
                    <label>Duration</label>
                    <input v-model="duration" type="time" disabled/>&emsp;
                </div>

                <select v-model="trainingflight">
                    <option disabled value="">Training Flight</option>
                    <option>No</option>
                    <option>Yes</option>
                </select>

                <select v-model="freshrefly">
                    <option disabled value="">Fresh / Refly</option>
                    <option>Fresh</option>
                    <option>Refly</option>
                </select>

                <input v-model="areacovered" type="number" placeholder="Area Covered (sq.km.)"/>
                <input v-model="flyingheight" type="number" placeholder="Flying Height (m)"/>
                <input v-model="overlap" type="text" placeholder="Overlap Used"/>
                <input v-model="temperature" type="text" placeholder="Temperature °C"/>
                <input v-model="windspeed" type="text" placeholder="Windspeed (m/s)"/>
                <input v-model="pilotname" type="text" placeholder="Pilot Name"/>
                <input v-model="fieldassistant" type="text" placeholder="Field Assistant"/>
                <input v-model="campingarea" type="text" placeholder="Camping Area"/>
                
            </div>

            <div v-show="!firstPage">
                <button class="olbtns" v-on:click="firstPage = !firstPage">Go to Page 1</button><br/>

                <input v-model="softwareversion" type="text" placeholder="Software Version"/>
                <input v-model="avggsd" type="text" placeholder="Avg. GSD. (cm)"/>

                <select v-model="district">
                    <option disabled value="">Select District</option>
                    <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
                </select>

                <input v-model="taluk" type="text" placeholder="Taluk"/>
                <textarea v-model="villages" placeholder="Villages"></textarea>
                <textarea v-model="hamlets" placeholder="Hamlets"></textarea>
                <input v-model="grampanchayat" type="text" placeholder="Gram Panchayat"/>
                <input v-model="lgdcodes" type="number" placeholder="LGD Codes (separated by commas)"/>
                <input v-model="villagescount" type="number" placeholder="Village Count"/>
                <input v-model="hamletscount" type="number" placeholder="Hamlets Count"/>
                
                <input v-model="basegpsid" type="text" placeholder="Base GPS ID"/>
                <input v-model="rawimages" type="number" placeholder="Raw Images"/>
                <input v-model="geotagged" type="number" placeholder="Geotagged"/>
                
                <input v-model="batteryno" type="text" placeholder="Battery Number"/>
                <input v-model="flylogno" type="text" placeholder="Fly Log No"/>
                <input v-model="totalfiles" type="number" placeholder="Total Files"/>
                <input v-model="foldersize" type="text" placeholder="Folder Size (GB)"/>
                <input v-model="remarks" type="text" placeholder="Remarks"/>

            </div>
            <button class="olbtns" v-on:click="updateattributes">Update Attributes</button>
        </div>
        <div id="attributessummarybox" v-show="showSummaryContainer">
            <b>Verify Attributes Once</b>
            <table border="2" style="border: 1px solid white;border-collapse: collapse;">
                <tr>
                    <td>Valid Flightline</td><td>{{ flightlinekmlValid }}</td>
                </tr>
                <tr>
                    <td>Valid Shapefile</td><td>{{ shapefileValid }}</td>
                </tr>
                <tr v-for="(value, name, index) in attributesInfoFromStore" v-bind:key="index">
                    <td>{{ name.toUpperCase() }}</td><td>{{ value }}</td>
                </tr>
            </table><br/>
            <button class="olbtnsgreen" v-on:click="startUploading">Confirm All, Now Upload</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

import featureUploader from '../composables/featureUploader';

export default defineComponent({
    setup() {
        const store = useStore();

        const { uploadDataToWFS } = featureUploader();
        
        const showAttributesContainer = computed(() => store.getters.getAttributesContainerStatus);
        const showSummaryContainer = computed(() => store.getters.getSummaryContainerStatus);

        const flightlinekmlValid = computed(() => store.getters.getflightlinekmlValidity);
        const shapefileValid = computed(() => store.getters.getshapefileValidity);
        const attributesInfoFromStore = computed(() => store.getters.getAttributesInfo);

        const dronenumbersGJ = computed(() => store.getters.getDroneNumbersGJ);
        const districtsList = computed(() => store.getters.getDistrictsList);

        const computedrefs1 = { dronenumbersGJ, districtsList, showAttributesContainer, showSummaryContainer, };
        const computedrefs = { ...computedrefs1, flightlinekmlValid, shapefileValid, attributesInfoFromStore};

        const firstPage = ref(true);
        
        const currentdronenumber = ref('');
        const flightnumber      = ref('');

        const flightid = computed(() => {
            if(currentdronenumber.value != '' && flightnumber.value != ''){
                return currentdronenumber.value + '_' + flightnumber.value;
            } else return '';
        });

        const flightcount       = ref('');
        const flightcategory    = ref('');
        
        const flightdate        = ref('');
        const takeofftime       = ref('');
        const landingtime       = ref('');

        const duration = computed(() => {
            if(takeofftime.value != '' && landingtime.value != ''){
                let hours: any   = <any>landingtime.value.split(':')[0] - <any>takeofftime.value.split(':')[0];
                let minutes: any = <any>landingtime.value.split(':')[1] - <any>takeofftime.value.split(':')[1];

                minutes = minutes.toString().length < 2 ? '0' + minutes : minutes;
                if(minutes < 0){ 
                    hours--;
                    minutes = 60 + minutes;
                }

                hours = hours.toString().length < 2 ? '0' + hours : hours;

                return hours + ':' + minutes;
            } else {
                return '';
            }
        });

        const trainingflight    = ref('');
        const freshrefly        = ref('');
        const areacovered       = ref('');
        const flyingheight      = ref('');
        const overlap           = ref('');
        const temperature       = ref('');
        const windspeed         = ref('');
        const pilotname         = ref('');
        const fieldassistant    = ref('');
        const campingarea       = ref('');
        const district          = ref('');
        const taluk             = ref('');
        const grampanchayat     = ref('');
        const villages          = ref('');
        const hamlets           = ref('');
        const lgdcodes          = ref('');
        const villagescount     = ref('');
        const hamletscount      = ref('');
        const softwareversion   = ref('');
        const basegpsid         = ref('');
        const rawimages         = ref('');
        const geotagged         = ref('');
        const avggsd            = ref('');
        const batteryno         = ref('');
        const flylogno          = ref('');
        const totalfiles        = ref('');
        const foldersize        = ref('');
        const remarks           = ref('');

        const attributesStatus = ref('');

        const variablerefs1 = { firstPage, currentdronenumber, flightnumber, flightid, flightcount, flightcategory, flightdate };
        const variablerefs2 = { ...variablerefs1, takeofftime, landingtime, duration, trainingflight, freshrefly, areacovered, flyingheight }
        const variablerefs3 = { ...variablerefs2, overlap, temperature, windspeed, pilotname, fieldassistant, campingarea, district, taluk }
        const variablerefs4 = { ...variablerefs3, grampanchayat, villages, hamlets, lgdcodes, villagescount, hamletscount, softwareversion }
        const variablerefs5 = { ...variablerefs4, basegpsid, rawimages, geotagged, avggsd, batteryno, flylogno, totalfiles, foldersize, remarks }
        const variablerefs = { ...variablerefs5, attributesStatus };

        const updateattributes = () => {
            let attributesInfo = {
                'dronenumber': currentdronenumber.value,    'uniqueflightnumber': flightnumber.value,   'flightid': flightid.value,
                'flightcount': flightcount.value,           'flightcategory': flightcategory.value,     'flightdate': flightdate.value,
                'takeofftime': takeofftime.value,           'landingtime': landingtime.value,           'duration': duration.value,
                'trainingflight': trainingflight.value,     'freshrefly': freshrefly.value,             'area': areacovered.value,
                'uavheight': flyingheight.value,            'overlap': overlap.value,                   'temperature': temperature.value,
                'windspeed': windspeed.value,               'pilotname': pilotname.value,               'fieldassistant': fieldassistant.value,
                'campingarea': campingarea.value,           'district': district.value,                 'taluk': taluk.value,
                'grampanchayat': grampanchayat.value,       'villages': villages.value,                 'hamlets': hamlets.value,
                'lgdcodes': lgdcodes.value,                 'villagescount': villagescount.value,       'hamletscount': hamletscount.value,
                'softwareversion': softwareversion.value,   'basegpsid': basegpsid.value,               'rawimagescount': rawimages.value,
                'geotagged': geotagged.value,               'avggsd': avggsd.value,                     'batteryno': batteryno.value,
                'flylogno': flylogno.value,                 'totalfiles': totalfiles.value,             'foldersizegb': foldersize.value,
                'remarks': remarks.value
            };

            let cond1 = attributesInfo['dronenumber'] != '';
            let cond2 = attributesInfo['uniqueflightnumber'] != undefined && attributesInfo['uniqueflightnumber'] != '';
            let cond3 = attributesInfo['flightid'] != '';
            let cond4 = attributesInfo['flightcount'] != '';
            let cond5 = attributesInfo['flightcategory'] != '';
            let cond6 = attributesInfo['flightdate'] != undefined && attributesInfo['flightdate'] != '';

            let condA = cond1 && cond2 && cond3 && cond4 && cond5 && cond6;
            if(condA){
                // console.log(attributesInfo);
                attributesStatus.value = 'Successfully Updated Attributes...';

                store.dispatch('setAttributesInfo', attributesInfo);
                store.dispatch('setAttributesValidity', true);
            } else {
                attributesStatus.value = 'Error in Attributes...';
            }

            setTimeout(() => {
                attributesStatus.value = '';
            }, 2000);
        }

        const startUploading = () => {
            let validAttributes = store.getters.getAttributesValidity;
            if(validAttributes){
                // console.log('Valid Attributes to Upload...');
                uploadDataToWFS();
            } else {
                store.dispatch('setUploadStatusMsg', 'Check Attributes...');
                setTimeout(() => {
                    store.dispatch('setUploadStatusMsg', '');
                }, 2000);
            }
        }

        return { ...computedrefs, ...variablerefs, updateattributes, startUploading }
    },
})
</script>
