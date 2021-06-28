<template>
    <div id="markedvillages">
        <div class="linemeasurecontainer">
            <button class="linemeasure" v-on:click="toggleLineMeasure"><span class="material-icons-outlined" title="Measure Line">straighten</span></button>
        </div>
        <div class="areameasurecontainer">
            <button class="areameasure" v-on:click="toggleAreaMeasure"><span class="material-icons-outlined" title="Measure Area">square_foot</span></button>
        </div>
        <div class="toolscontainer">
            <button class="toggletools" v-on:click="showtools = !showtools"><span class="material-icons-outlined" title="Tools">handyman</span></button>
            <div class="tools" v-show="showtools">
                <div class="display-table-tools">
                    <div>
                        <div><button class="olbtns" v-on:click="loadBaseMapToExtent">Load Basemap To Map Extent</button></div>
                        <div><button class="olbtns" v-on:click="unloadBaseMap">Unload BaseMap</button></div>  
                    </div>
                    <div>
                        <div>
                            <select v-model="districtref" style="font-size:0.5em;">
                                <option disabled value="">Select District</option>
                                <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
                            </select>
                        </div>
                        <div><button class="olbtns" v-on:click="loadVillagesBoundsRef">Load Villages In View N By District</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns">Load Abadi Limits In View N By District</button></div>
                        <div><button class="olbtns" v-on:click="callUnloadVillagesBounds">Unload Villages</button><button class="olbtns">Unload Abadi Limits</button></div>
                    </div>
                    <div>
                        <div><button class="olbtns" v-on:click="drawNewLayer">Draw Abadi Limit Feature</button></div>
                        <div>
                            <button class="olbtns" onclick="document.getElementById('fileinput').click();">Add Abadi Limit Feature</button>
                            <br><span>*.kml / *.zip (shapefile)</span>
                            <input id="fileinput" type="file" style="display:none;" ref="fileEl"/>
                        </div>
                    </div>
                    <div>
                        <div>
                            <button class="olbtns">Upload Files</button>
                        </div>
                        <div>
                            <button class="olbtns">Load Files</button>
                        </div>
                    </div>
                </div><br>
                <div class="display-table-features">
                    <div>
                        <div><b>No</b></div>
                        <div><b>Identifier</b></div>
                        <div><b>Valid Attributes</b></div>
                        <div><b>Zoom</b></div>
                        <div><b>Edit Attributes</b></div>
                        <div><b>Upload</b></div>
                        <div><b>Discard</b></div>
                        <div><b>Uploaded</b></div>
                    </div>
                    <div v-for="(feature, index) in featuresData" v-bind:key="index">
                        <div>{{ index + 1 }}</div>
                        <div>{{ feature.featurename }}</div>
                        <div v-html="whetherAttributesValidComputed(feature.lyrid)"></div>
                        <!-- <div></div> -->
                        <div><button class="olbtns" v-bind:lyrid="feature.lyrid" v-on:click="invokeZoomToLayer"><span class="material-icons-outlined"       v-bind:lyrid="feature.lyrid">center_focus_weak</span></button></div>
                        <div><button class="olbtns" v-bind:lyrid="feature.lyrid" v-on:click="editAttributes" v-show="!feature.uploaded"><span class="material-icons-outlined"          v-bind:lyrid="feature.lyrid">edit_note</span></button></div>
                        <div><button class="olbtns" v-bind:lyrid="feature.lyrid" v-on:click="callUploadAbadiLimit" v-show="!feature.uploaded"><span class="material-icons-outlined"    v-bind:lyrid="feature.lyrid">file_upload</span></button></div>
                        <div><button class="olbtns" v-bind:lyrid="feature.lyrid" v-on:click="discardLayer" v-show="!feature.uploaded"><span class="material-icons-outlined"            v-bind:lyrid="feature.lyrid">delete_outline</span></button></div>
                        <div><div v-show="feature.uploaded">Uploaded</div></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="userattributescontainer" v-show="showUserAttributesTable">
            <div class="userattributestable">
                <div>
                    <div>Feature Name</div>
                    <div>{{ currentFeatureName }}</div>
                </div>
                <div>
                    <div>Abadi Limit Name</div>
                    <div><input type="text" v-model="abadilimitname"></div>
                </div>
                <div>
                    <div>No. of Properties / Houses</div>
                    <div><input type="number" v-model="noofproperties"></div>
                </div>
                <div>
                    <div>Date of Commencement of Marking</div>
                    <div><input type="date" v-model="startdate"></div>
                </div>
                <div>
                    <div>Date of Completion of Marking</div>
                    <div><input type="date" v-model="enddate"></div>
                </div>
                <div>
                    <div>Village Name</div>
                    <div><input type="text" v-model="villagename"></div>
                </div>
                <div>
                    <div>LGD Code</div>
                    <div><input type="text" v-model="lgdcode"></div>
                </div>
                <div>
                    <div>
                        <span>Total Abadi Areas Count in Village</span><br> 
                        <span style="font-size:0.8em;">Hamlets + Main Village Settlements Count</span>
                    </div>
                    <div><input type="number" v-model="pocketscount"></div>
                </div>
                <div>
                    <div>Gram Panchayat</div>
                    <div><input type="text" v-model="grampanchayat"></div>
                </div>
                <div>
                    <div>Hobli</div>
                    <div><input type="text" v-model="hobli"></div>
                </div>
                <div>
                    <div>Taluk</div>
                    <div><input type="text" v-model="taluk"></div>
                </div>
                <div>
                    <div>District</div>
                    <select v-model="userattributedistrictref">
                        <option disabled value="">Select District</option>
                        <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
                    </select>
                </div>
                <div>
                    <div><button class="userattributesclose" v-on:click="updateUserAttributes">Update Attributes</button></div>
                    <div><button class="userattributesclose" v-on:click="showUserAttributesTable = false">Close</button></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import './ControlsContainer.scss';

import store from '@/store';
import { computed, defineComponent, onMounted, ref } from 'vue'

import karnBoundsLoader from '../composables/karnBoundsLoader';
import villagesBoundsLoader from '../composables/villagesBoundsLoader';
import baseMapLoader from '../composables/baseMapLoader';
import kmlshpHanlder from '../composables/kmlshpHandler';
import drawFeaturesManager from '../composables/drawFeaturesManager';
import zoomdiscardLayer from '../composables/zoomdiscardLayer';
import globalToast from '../composables/globalToast';
import measureTools from '../composables/measureTools';
import abadiLimitUploader from '../composables/abadiLimitUploader';

export default defineComponent({
    setup() {
        const { loadKarnBounds } = karnBoundsLoader();
        const { loadVillagesBounds, unloadVillagesBounds } = villagesBoundsLoader();
        const { loadBaseMapToExtent, unloadBaseMap } = baseMapLoader();
        const { loadKMLShp } = kmlshpHanlder();
        const { zoomToLayer, discardLayerFromMap } = zoomdiscardLayer();
        const { drawNewLayer } = drawFeaturesManager();
        const { showGlobalToast } = globalToast();
        const { toggleLineMeasure, toggleAreaMeasure } = measureTools();
        const { tryToUploadAbadiLimit } = abadiLimitUploader();

        const districtsList = computed(() => store.getters.getDistrictsList);
        const featuresData = computed(() => store.getters.getFeaturesData);

        const districtref = ref('');
        const loadedDistrict = ref('');
        const showtools = ref(false);
        
        const fileEl = ref();

        const currentFeatureName = ref('');

        const loadVillagesBoundsRef = () => {
            if(districtref.value == ''){
                showGlobalToast('Select District First');
                return 0;
            }

            if(loadedDistrict.value != districtref.value){
                loadVillagesBounds(districtref.value);
                loadedDistrict.value = districtref.value;
            }
        }

        const callUnloadVillagesBounds = () => {
            loadedDistrict.value = '';
            unloadVillagesBounds();
        }

        const return0 = { 
            loadKarnBounds, callUnloadVillagesBounds, 
            loadBaseMapToExtent, unloadBaseMap,
            toggleLineMeasure, toggleAreaMeasure
        };

        const return1 = { 
            districtsList, featuresData,
            districtref, showtools, fileEl, currentFeatureName,
            loadVillagesBoundsRef 
        };

        const invokeZoomToLayer = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            zoomToLayer(lyrid);
        }

        const discardLayer = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            discardLayerFromMap(lyrid)
            .then(() => {
                let filteredData = featuresData.value.filter((feature: any) => {
                    return feature.lyrid != lyrid;
                });

                store.dispatch('setFeaturesData', filteredData);
            }).catch(() => {
                console.log('Removing Layer: Unknown Error');
            });

            fileEl.value.value = '';
        }

        const return2 = { invokeZoomToLayer, discardLayer, drawNewLayer };

        onMounted(() => {
            fileEl.value.addEventListener('change', loadKMLShp);
        });

        const currentFeatureID = ref('');

        const abadilimitname              = ref('');
        const noofproperties              = ref(0);
        const startdate                   = ref();
        const enddate                     = ref();
        const villagename                 = ref('');
        const lgdcode                     = ref('');
        const pocketscount                = ref(0);
        const grampanchayat               = ref('');
        const hobli                       = ref('');
        const taluk                       = ref('');
        const userattributedistrictref    = ref('');
        
        const return3 = { 
            abadilimitname, noofproperties, startdate, enddate, villagename, lgdcode,
            pocketscount, grampanchayat, hobli, taluk, userattributedistrictref 
        };
        
        const showUserAttributesTable = ref(false);
        const editAttributes = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            // console.log(lyrid);
            currentFeatureID.value = lyrid;
            let reqdfeature: any = featuresData.value.find((feature: any) => {
                return feature.lyrid == lyrid;
            });

            currentFeatureName.value = reqdfeature.featurename;

            let attributes = reqdfeature.attributes;
            // console.log(reqdfeature, attributes);

            if (typeof attributes === 'object'){
                if ('lgdcode'                   in attributes) lgdcode.value                    = attributes['lgdcode'];
                if ('abadilimitname'            in attributes) abadilimitname.value             = attributes['hamletname'];
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
                'abadilimitname'            :   abadilimitname.value            ,
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
            let reqdfeature: any = featuresData.value.find((feature: any) => {
                return feature.lyrid == lyrid;
            });

            currentFeatureName.value = reqdfeature.featurename;
            
            reqdfeature.attributes = attributes;
            showGlobalToast('Attributes Updated...');
        }

        const checkAttributesForLyrID = (lyrid: any) => {
            let reqdfeature: any = featuresData.value.find((feature: any) => {
                return feature.lyrid == lyrid;
            });

            let attributes = reqdfeature.attributes;
            let conds = [];

            conds.push( 'abadilimitname'            in attributes && attributes['abadilimitname']            !=  ''  );
            conds.push( 'noofproperties'            in attributes && attributes['noofproperties']            !=  0   );
            // conds.push( 'startdate'                 in attributes && attributes['startdate']                 !=  ''  );
            // conds.push( 'enddate'                   in attributes && attributes['enddate']                   !=  ''  );
            conds.push( 'villagename'               in attributes && attributes['villagename']               !=  ''  );
            conds.push( 'lgdcode'                   in attributes && attributes['lgdcode']                   !=  ''  );
            conds.push( 'pocketscount'              in attributes && attributes['pocketscount']              !=  0   );
            conds.push( 'grampanchayat'             in attributes && attributes['grampanchayat']             !=  ''  );
            conds.push( 'hobli'                     in attributes && attributes['hobli']                     !=  ''  );
            conds.push( 'taluk'                     in attributes && attributes['taluk']                     !=  ''  ); 
            conds.push( 'userattributedistrictref'  in attributes && attributes['userattributedistrictref']  !=  ''  );

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

        const return4 = { 
            showUserAttributesTable, 
            editAttributes, updateUserAttributes, 
            whetherAttributesValidComputed 
        };

        const callUploadAbadiLimit = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            // console.log(lyrid);

            let whetherValid = checkAttributesForLyrID(lyrid);
            if(whetherValid){
                tryToUploadAbadiLimit(lyrid);
            } else {
                showGlobalToast('Kindly Edit Attributes for the feature');
            }
        }

        const return5 = { callUploadAbadiLimit };

        return { ...return0, ...return1, ...return2, ...return3, 
            ...return4, ...return5 
        }
    },
})
</script>