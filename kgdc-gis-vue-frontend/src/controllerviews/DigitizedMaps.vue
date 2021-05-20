<template>
    <div id="digitizedmaps">
        <div class="toolscontainer">
            <button class="toggletools" v-on:click="showtools = !showtools"><span class="material-icons-outlined" title="Tools">handyman</span></button>
            <div class="tools" v-show="showtools">
                <div class="display-table-tools">
                    <div>
                        <div><button class="olbtns" v-on:click="loadBaseMapToExtent">Load Basemap To Extent</button></div>
                        <div><button class="olbtns" v-on:click="unloadBaseMap">Unload BaseMap</button></div>  
                    </div>
                    <div>
                        <div>
                            <select v-model="districtref" style="font-size:0.5em;">
                                <option disabled value="">Select District</option>
                                <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
                            </select>
                        </div>
                        <div><button class="olbtns" v-on:click="loadVillagesBoundsRef">Load Villages By District</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns">Load Villages In View N By District</button></div>
                        <div><button class="olbtns" v-on:click="unloadVillagesBounds">Unload Villages</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns">Load Marked Settlements In View N By District</button></div>
                        <div><button class="olbtns">Unload Marked Settlements</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns" v-on:click="showFileUploader = !showFileUploader">Upload Corrected PDF</button></div>
                        <div>Current Village: {{ currentvillage }}</div>
                    </div>
                </div><br>
                <div class="display-table-features">
                    <div>
                        <div><b>No</b></div>
                        <div><b>Identifier</b></div>
                        <div><b>Details</b></div>
                        <div><b>Download</b></div>
                    </div>
                    <div v-for="(lyr, index) in layers" v-bind:key="index">
                        <div>{{ index + 1 }}</div>
                        <div>{{ lyr.filename }}</div>
                        <div v-html="whetherAttributesValidComputed(lyr.id)"></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id" v-on:click="invokeZoomToLayer">center_focus_weak</span></button></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id" v-on:click="editAttributes">edit_note</span></button></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">file_upload</span></button></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id" v-on:click="discardLayer">delete_outline</span></button></div>
                        <div>-</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fileuploadercontainer" v-show="showFileUploader">
            <div class="fileuploader">
                <input type="file" ref="fileEl">
                <button v-on:click="calluploadfile">Upload</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent, onMounted, ref } from 'vue'

import './DigitizedMaps.scss';

import karnBoundsLoader from '../composables/karnBoundsLoader';
import villagesBoundsLoader from '../composables/villagesBoundsLoader';
import baseMapLoader from '../composables/baseMapLoader';
import kmlshpHanlder from '../composables/kmlshpHandler';
import drawFeaturesManager from '../composables/drawFeaturesManager';
import globalFunctions from '../composables/globalFunctions';
import globalToast from '../composables/globalToast';
import fileuploader from '../composables/fileuploader';

export default defineComponent({
    setup() {
        const { loadKarnBounds } = karnBoundsLoader();
        const { loadVillagesBounds, unloadVillagesBounds } = villagesBoundsLoader();
        const { loadBaseMapToExtent, unloadBaseMap } = baseMapLoader();
        const { loadFilePromise, zoomToLayer } = kmlshpHanlder();
        const { drawNewLayer } = drawFeaturesManager();
        const { discardLayerFromMap } = globalFunctions();
        const { showGlobalToast } = globalToast();
        const { uploadfile } = fileuploader();

        const return0 = { loadKarnBounds, unloadVillagesBounds, loadBaseMapToExtent, unloadBaseMap };

        const districtsList = computed(() => store.getters.getDistrictsList);
        const districtref = ref('');
        const loadedDistrict = ref('');

        const showFileUploader = ref(false);

        const currentvillage = computed(() => store.getters.getCurrentVillage);

        const showtools = ref(false);
        
        const fileEl = ref();
        const currentID = ref(1);
        const layers = ref([]);

        const loadVillagesBoundsRef = () => {
            if(districtref.value != '' && loadedDistrict.value != districtref.value){
                loadVillagesBounds(districtref.value);
                loadedDistrict.value = districtref.value;
            }
        }

        const return1 = { districtsList, districtref, showtools, fileEl, layers, loadVillagesBoundsRef }

        const invokeZoomToLayer = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');

            zoomToLayer(lyrid);
        }

        const discardLayer = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');

            discardLayerFromMap(lyrid)
            .then(() => {
                layers.value = layers.value.filter((lyr) => {
                    return lyr['id'] != lyrid;
                });
            });
        }

        const drawALayer = () => {
            let data = drawNewLayer(currentID.value);
            if(data.validgeometry == true){
                layers.value = <never>[...layers.value, data];
            }
            currentID.value++;
        }

        const return2 = { invokeZoomToLayer, discardLayer, drawALayer }

        const sendFileElementToLoad = () => {
            let file = fileEl.value.files[0];
            loadFilePromise(file)
            .then((featuredata: any) => {
                // console.log(data);
                if(featuredata.validgeometry == true){
                    layers.value = <never>[...layers.value, featuredata];
                }
            });
        }

        onMounted(() => {
            store.dispatch('setCategoryInfo', 'Digitized Maps');
        });

        const currentFeatureID = ref('');

        const lgdcode                     = ref('');
        const hamletname                  = ref('');
        const noofproperties              = ref(0);
        const startdate                   = ref();
        const enddate                     = ref();
        const villagename                 = ref('');
        const pocketscount                = ref(0);
        const grampanchayat               = ref('');
        const hobli                       = ref('');
        const taluk                       = ref('');
        const userattributedistrictref    = ref('');

        const return3 = { lgdcode, hamletname, noofproperties, startdate, enddate, villagename, pocketscount, grampanchayat, hobli, taluk, userattributedistrictref };
        
        const showUserAttributesTable = ref(false);

        const editAttributes = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            // console.log(lyrid);
            currentFeatureID.value = lyrid;

            let reqdlayer: any = layers.value.find((lyr) => {
                return lyr['id'] == lyrid;
            });

            let attributes = reqdlayer.attributes;
            console.log(reqdlayer, attributes);

            if (typeof attributes === 'object'){
                if ('lgdcode'                   in attributes) lgdcode.value                    = attributes['lgdcode'];
                if ('hamletname'                in attributes) hamletname.value                 = attributes['hamletname'];
                if ('noofproperties'            in attributes) noofproperties.value             = attributes['noofproperties'];
                if ('startdate'                 in attributes) startdate.value                  = attributes['startdate'];
                if ('enddate'                   in attributes) enddate.value                    = attributes['enddate'];
                if ('villagename'               in attributes) villagename.value                = attributes['villagename'];
                if ('pocketscount'              in attributes) pocketscount.value               = attributes['pocketscount'];
                if ('grampanchayat'             in attributes) grampanchayat.value              = attributes['grampanchayat'];
                if ('hobli'                     in attributes) hobli.value                      = attributes['hobli'];
                if ('taluk'                     in attributes) taluk.value                      = attributes['taluk'];
                if ('userattributedistrictref'  in attributes) userattributedistrictref.value   = attributes['userattributedistrictref'];
            
                showUserAttributesTable.value = true;
            }
        }

        const updateUserAttributes = () => {
            const attributes = {
                'lgdcode'                   :   lgdcode.value                   ,   
                'hamletname'                :   hamletname.value                ,
                'noofproperties'            :   noofproperties.value            ,
                'startdate'                 :   startdate.value                 ,
                'enddate'                   :   enddate.value                   ,
                'villagename'               :   villagename.value               , 
                'pocketscount'              :   pocketscount.value              , 
                'grampanchayat'             :   grampanchayat.value             , 
                'hobli'                     :   hobli.value                     , 
                'taluk'                     :   taluk.value                     , 
                'userattributedistrictref'  :   userattributedistrictref.value
            }

            let lyrid = currentFeatureID.value;
            // console.log(lyrid);

            let reqdlayer: any = layers.value.find((lyr) => {
                return lyr['id'] == lyrid;
            });
            
            reqdlayer.attributes = attributes;

            showGlobalToast('Attributes Updated...');
        }

        const checkAttributesForLyrID = (lyrid: any) => {
            let reqdlayer: any = layers.value.find((lyr) => {
                    return lyr['id'] == lyrid;
                });

                let attributes = reqdlayer.attributes;

                let conds = [];
                conds.push( attributes['lgdcode']                   !=  ''  );
                conds.push( attributes['hamletname']                !=  ''  );
                conds.push( attributes['noofproperties']            !=  0   );
                // conds.push( attributes['startdate']                 ==  ''  );
                // conds.push( attributes['enddate']                   ==  ''  );
                conds.push( attributes['villagename']               !=  ''  );
                conds.push( attributes['pocketscount']              !=  0   );
                conds.push( attributes['grampanchayat']             !=  ''  );
                conds.push( attributes['hobli']                     !=  ''  );
                conds.push( attributes['taluk']                     !=  ''  ); 
                conds.push( attributes['userattributedistrictref']  !=  ''  ); 

                return conds.every(Boolean);
        }

        const whetherAttributesValidComputed = computed(() => {
            return (lyrid: any) => {
                let whetherValid = checkAttributesForLyrID(lyrid);
                if(whetherValid){
                    return '<span style="color:green;">OK</span>';
                } else {
                    return '<span style="color:red;">Not OK</span>';
                }
            }
        });

        const calluploadfile = () => {
            let file = fileEl.value.files[0];
            uploadfile(file);
        }

        const return4 = { showUserAttributesTable, editAttributes, updateUserAttributes, whetherAttributesValidComputed };

        return { ...return0, ...return1, ...return2, ...return3, ...return4, currentvillage, showFileUploader, calluploadfile }
    },
})
</script>
