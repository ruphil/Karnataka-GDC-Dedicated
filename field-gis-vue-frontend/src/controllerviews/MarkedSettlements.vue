<template>
    <div id="markedvillages">
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
                        <div><button class="olbtns">Draw Layer</button></div>
                        <div><button class="olbtns" onclick="document.getElementById('fileinput').click();">Add Layer</button><br><span>*.kml / *.zip (shapefile)</span></div>
                        <input id="fileinput" type="file" style="display:none;" ref="fileEl"/>
                    </div>
                </div><br>
                <div class="display-table-features">
                    <div>
                        <div><b>No</b></div>
                        <div><b>Filename</b></div>
                        <div><b>Geometry</b></div>
                        <div><b>Attributes</b></div>
                        <div><b>Zoom</b></div>
                        <div><b>Edit Layer</b></div>
                        <div><b>Edit Attributes</b></div>
                        <div><b>Upload</b></div>
                        <div><b>Discard</b></div>
                    </div>
                    <div v-for="(lyr, index) in layers" v-bind:key="index">
                        <div>{{ index + 1 }}</div>
                        <div>{{ lyr.filename }}</div>
                        <div>{{ lyr.validgeometry }}</div>
                        <div>{{ lyr.validattributes }}</div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">center_focus_weak</span></button></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">edit</span></button></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">edit_note</span></button></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id">file_upload</span></button></div>
                        <div><button class="olbtns"><span class="material-icons-outlined" v-bind:lyrid="lyr.id" v-on:click="discardLayer">delete_outline</span></button></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/store';
import { computed, defineComponent, onMounted, ref } from 'vue'

import './MarkedSettlements.scss';

import globalToast from '../composables/globalToast';
import karnBoundsLoader from '../composables/karnBoundsLoader';
import villagesBoundsLoader from '../composables/villagesBoundsLoader';
import baseMapLoader from '../composables/baseMapLoader';
import kmlshpHanlder from '../composables/kmlshpHandler';

export default defineComponent({
    setup() {
        const { showGlobalToast } = globalToast();
        const { loadKarnBounds } = karnBoundsLoader();
        const { loadVillagesBounds, unloadVillagesBounds } = villagesBoundsLoader();
        const { loadBaseMapToExtent, unloadBaseMap } = baseMapLoader();
        const { loadFilePromise, discardLayerFromMap } = kmlshpHanlder();

        const return0 = { loadKarnBounds, unloadVillagesBounds, loadBaseMapToExtent, unloadBaseMap };

        const districtsList = computed(() => store.getters.getDistrictsList);
        const districtref = ref('');
        const loadedDistrict = ref('');

        const showtools = ref(false);
        
        const fileEl = ref();
        const currentID = ref(0);
        const layers = ref([]);

        // interface layer {
        //     id: string,
        //     validgeometry: boolean,
        //     filename: string,
        //     validattributes: false,
        //     layer: VectorLayer,
        //     attributes: Object
        // };

        const loadVillagesBoundsRef = () => {
            if(districtref.value != '' && loadedDistrict.value != districtref.value){
                loadVillagesBounds(districtref.value);
                loadedDistrict.value = districtref.value;
            }
        }

        const discardLayer = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            // console.log(lyrid);

            // let index = layers.value.findIndex(lyr => lyr['id'] == lyrid);
            // let lyr = layers.value[index]['layer'];
            // console.log(lyr);

            discardLayerFromMap(lyrid);
            
            layers.value = layers.value.filter((lyr) => {
                return lyr['id'] != lyrid;
            });
        }

        const return1 = { districtsList, districtref, fileEl, layers, loadVillagesBoundsRef, showtools, discardLayer }

        const sendFileElementToLoad = () => {
            let file = fileEl.value.files[0];
            loadFilePromise(file)
            .then((data: any) => {
                // console.log(data);
                if(data.validgeometry == true){
                    layers.value = <never>[...layers.value, data];
                }
            });
        }

        onMounted(() => {
            fileEl.value.addEventListener('change', sendFileElementToLoad);
            store.dispatch('setCategoryInfo', 'Add Marked Villages');
        });
        
        return { ...return0, ...return1 }
    },
})
</script>
