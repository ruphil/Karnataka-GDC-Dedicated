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
                        <div>No</div>
                        <div>Filename</div>
                        <div>Geometry</div>
                        <div>Attributes</div>
                        <div>Edit Layer</div>
                        <div>Edit Attributes</div>
                        <div>Upload</div>
                        <div>Discard</div>
                    </div>
                    <div v-for="(lyr, index) in layers" v-bind:key="index">
                        <div>{{ index }}</div>
                        <div>{{ lyr.filename }}</div>
                        <div>{{ lyr.validgeometry }}</div>
                        <div>{{ lyr.validattributes }}</div>
                        <div><button>edit lyr</button></div>
                        <div><button>edit atr</button></div>
                        <div><button>Upload</button></div>
                        <div><button>X</button></div>
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
        const { loadFilePromise } = kmlshpHanlder();

        const return0 = { loadKarnBounds, unloadVillagesBounds, loadBaseMapToExtent, unloadBaseMap };

        const districtsList = computed(() => store.getters.getDistrictsList);
        const districtref = ref('');
        const loadedDistrict = ref('');

        const showtools = ref(false);
        
        const fileEl = ref();
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

        const sendFileElementToLoad = () => {
            let file = fileEl.value.files[0];
            loadFilePromise(file)
            .then((data: any) => {
                console.log(data);
                if(data.validgeometry == true){
                    console.log('got something');
                    layers.value = <never>[...layers.value, data];
                }
            });
            
            console.log(layers.value);
        }

        const return1 = { districtsList, districtref, fileEl, layers, loadVillagesBoundsRef, showtools }

        onMounted(() => {
            fileEl.value.addEventListener('change', sendFileElementToLoad);
            store.dispatch('setCategoryInfo', 'Add Marked Villages');
        });
        
        return { ...return0, ...return1 }
    },
})
</script>
