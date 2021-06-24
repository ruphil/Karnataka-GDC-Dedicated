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
                        <div><button class="olbtns" v-on:click="drawALayer">Draw Layer</button></div>
                        <div>
                            <button class="olbtns" onclick="document.getElementById('fileinput').click();">Add Layer</button>
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
                    <div v-for="(lyr, index) in layers" v-bind:key="index">
                        <div>{{ index + 1 }}</div>
                        <div>{{ lyr.filename }}</div>
                        <div v-html="whetherAttributesValidComputed(lyr.id)"></div>
                        <div><button class="olbtns" v-bind:lyrid="lyr.id" v-on:click="invokeZoomToLayer"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">center_focus_weak</span></button></div>
                        <div><button class="olbtns" v-bind:lyrid="lyr.id" v-on:click="editAttributes"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">edit_note</span></button></div>
                        <div><button class="olbtns" v-bind:lyrid="lyr.id" v-on:click="callUploadAbadiLimit"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">file_upload</span></button></div>
                        <div><button class="olbtns" v-bind:lyrid="lyr.id" v-on:click="discardLayer"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">delete_outline</span></button></div>
                        <div>-</div>
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
                    <div><input type="text" v-model="noofproperties"></div>
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
                        <span>Total Number of Pockets in Village</span><br> 
                        <span style="font-size:0.5em;">Hamlets + Main Village Settlements Count</span>
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
        const { loadFilePromise } = kmlshpHanlder();
        const { zoomToLayer, discardLayerFromMap } = zoomdiscardLayer();
        const { drawNewLayer } = drawFeaturesManager();
        const { showGlobalToast } = globalToast();
        const { toggleLineMeasure, toggleAreaMeasure } = measureTools();
        const { uploadAbadiLimit } = abadiLimitUploader();

        const districtsList = computed(() => store.getters.getDistrictsList);
        const districtref = ref('');
        const loadedDistrict = ref('');
        const showtools = ref(false);
        
        const fileEl = ref();
        const currentNameID = ref(1);
        const layers = ref([]);

        const currentFeatureName = ref('jack');

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
            districtsList, districtref, showtools, fileEl, layers, 
            currentFeatureName,
            loadVillagesBoundsRef 
        };

        const invokeZoomToLayer = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            zoomToLayer(lyrid);
        }

        const discardLayer = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            // console.log('Trying to remove lyrid: ', lyrid);
            discardLayerFromMap(lyrid)
            .then(() => {
                layers.value = layers.value.filter((lyr) => {
                    return lyr['id'] != lyrid;
                });
            }).catch(() => {
                console.log('Removing Layer: Unknown Error');
            });
        }

        const drawALayer = () => {
            let data = drawNewLayer(currentNameID.value);
            if(data.validgeometry == true){
                layers.value = <never>[...layers.value, data];
            }

            currentNameID.value++;
        }

        const return2 = { invokeZoomToLayer, discardLayer, drawALayer };

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
            fileEl.value.addEventListener('change', sendFileElementToLoad);
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
            let reqdlayer: any = layers.value.find((lyr) => {
                return lyr['id'] == lyrid;
            });

            currentFeatureName.value = reqdlayer.filename;

            let attributes = reqdlayer.attributes;
            console.log(reqdlayer, attributes);

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
                'abadilimitname'            :   abadilimitname.value                ,
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

            conds.push( 'lgdcode'                   in attributes && attributes['lgdcode']                   !=  ''  );
            conds.push( 'abadilimitname'            in attributes && attributes['abadilimitname']            !=  ''  );
            conds.push( 'noofproperties'            in attributes && attributes['noofproperties']            !=  0   );
            // conds.push( 'startdate'                 in attributes && attributes['startdate']                 !=  ''  );
            // conds.push( 'enddate'                   in attributes && attributes['enddate']                   !=  ''  );
            conds.push( 'villagename'               in attributes && attributes['villagename']               !=  ''  );
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

        const return4 = { showUserAttributesTable, editAttributes, updateUserAttributes, whetherAttributesValidComputed };

        const callUploadAbadiLimit = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            // console.log(lyrid);

            let whetherValid = checkAttributesForLyrID(lyrid);
            if(whetherValid || true){
                let reqdlayer: any = layers.value.find((lyr) => {
                    return lyr['id'] == lyrid;
                });

                uploadAbadiLimit(reqdlayer);    
            } else {
                showGlobalToast('Kindly Edit Attributes for the feature');
            }
        }

        const return5 = { callUploadAbadiLimit };

        return { ...return0, ...return1, ...return2, ...return3, ...return4, ...return5 }
    },
})
</script>