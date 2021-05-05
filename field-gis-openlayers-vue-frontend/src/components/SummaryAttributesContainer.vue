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
                    <td>{{ name }}</td><td>{{ value }}</td>
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
        const flightcount       = ref('');
        const flightcategory    = ref('');
        
        const flightdate        = ref('');
        const takeofftime       = ref('');
        const landingtime       = ref('');
        // const duration          = ref('');

        const duration = computed(() => {
            let hours: any   = <any>landingtime.value.split(':')[0] - <any>takeofftime.value.split(':')[0];
            let minutes: any = <any>landingtime.value.split(':')[1] - <any>takeofftime.value.split(':')[1];

            minutes = minutes.toString().length < 2 ? '0' + minutes : minutes;
            if(minutes < 0){ 
                hours--;
                minutes = 60 + minutes;
            }

            hours = hours.toString().length < 2 ? '0' + hours : hours;

            return hours + ":" + minutes;
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

        const flightid = computed(() => {
            if(currentdronenumber.value != '' && flightnumber.value != undefined){
                return currentdronenumber.value + '_' + flightnumber.value
            } else return '';
        });

        const variablerefs1 = { firstPage, currentdronenumber, flightnumber, flightid, flightcount, flightcategory, flightdate };
        const variablerefs2 = { ...variablerefs1, takeofftime, landingtime, duration, trainingflight, freshrefly, areacovered, flyingheight }
        const variablerefs3 = { ...variablerefs2, overlap, temperature, windspeed, pilotname, fieldassistant, campingarea, district, taluk }
        const variablerefs4 = { ...variablerefs3, grampanchayat, villages, hamlets, lgdcodes, villagescount, hamletscount, softwareversion }
        const variablerefs5 = { ...variablerefs4, basegpsid, rawimages, geotagged, avggsd, batteryno, flylogno, totalfiles, foldersize, remarks }
        const variablerefs = { ...variablerefs5, attributesStatus };

        const updateattributes = () => {
            let attributesInfo = {
                'DRONENUMBER': currentdronenumber.value,    'UNIQUEFLIGHTNUMBER': flightnumber.value,   'FLIGHTID': flightid.value,
                'FLIGHTCOUNT': flightcount.value,           'FLIGHTCATEGORY': flightcategory.value,     'FLIGHTDATE': flightdate.value,
                'TAKEOFFTIME': takeofftime.value,           'LANDINGTIME': landingtime.value,           'DURATION': duration.value,
                'TRAININGFLIGHT': trainingflight.value,     'FRESHREFLY': freshrefly.value,             'AREA': areacovered.value,
                'UAVHEIGHT': flyingheight.value,            'OVERLAP': overlap.value,                   'TEMPERATURE': temperature.value,
                'WINDSPEED': windspeed.value,               'PILOTNAME': pilotname.value,               'FIELDASSISTANT': fieldassistant.value,
                'CAMPINGAREA': campingarea.value,           'DISTRICT': district.value,                 'TALUK': taluk.value,
                'GRAMPANCHAYAT': grampanchayat.value,       'VILLAGES': villages.value,                 'HAMLETS': hamlets.value,
                'LGDCODES': lgdcodes.value,                 'VILLAGESCOUNT': villagescount.value,       'HAMLETSCOUNT': hamletscount.value,
                'SOFTWAREVERSION': softwareversion.value,   'BASEGPSID': basegpsid.value,               'RAWIMAGESCOUNT': rawimages.value,
                'GEOTAGGED': geotagged.value,               'AVGGSD': avggsd.value,                     'BATTERYNO': batteryno.value,
                'FLYLOGNO': flylogno.value,                 'TOTALFILES': totalfiles.value,             'FOLDERSIZEGB': foldersize.value,
                'REMARKS': remarks.value
            };

            let cond1 = attributesInfo['DRONENUMBER'] != '';
            let cond2 = attributesInfo['UNIQUEFLIGHTNUMBER'] != undefined && attributesInfo['UNIQUEFLIGHTNUMBER'] != '';
            let cond3 = attributesInfo['FLIGHTID'] != '';
            let cond4 = attributesInfo['FLIGHTCOUNT'] != '';
            let cond5 = attributesInfo['FLIGHTCATEGORY'] != '';
            let cond6 = attributesInfo['FLIGHTDATE'] != undefined;

            let condA = cond1 && cond2 && cond3 && cond4 && cond5 && cond6;
            if(condA){
                console.log(attributesInfo);
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
                console.log('valid attributes to upload...');
                uploadDataToWFS();
            } else {
                store.dispatch('setUploadStatusMsg', 'Invalid Attributes... Check Again...')
            }
        }

        return { ...computedrefs, ...variablerefs, updateattributes, startUploading }
    },
})
</script>
