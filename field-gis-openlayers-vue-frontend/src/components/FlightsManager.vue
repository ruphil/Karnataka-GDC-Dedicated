<template>
    <div>
        <div id="fileslistholder">
            <div id="fileslist">
                <div id="kmlfile" v-show="kmlfilename != ''">
                    <span>{{ kmlfilename }}</span>
                    <span><button class="filediscardbtns" v-on:click="discardKML">X</button></span>
                </div>
                <div id="shapefile" v-show="shapefilename != ''">
                    <span>{{ shapefilename }}</span>
                    <span><button class="filediscardbtns" v-on:click="discardSHP">X</button></span>
                </div>
            </div>
            <div id="filesaddbtnscontainer">
                <input id="flightlinekml" type="file" style="display:none;" v-on:change="kmlchange" ref="kmlfileEl"/>
                <input id="shapefiles" type="file" style="display:none;" v-on:change="shpchange" ref="shapefileEl"/>
                <span>
                    <button class="olbtns" id="kmladdbtn" onclick="document.getElementById('flightlinekml').click();">+ KML</button>
                    <button class="olbtns" id="shapesaddbtn" onclick="document.getElementById('shapefiles').click();">+ Shape</button>
                </span>
            </div><br/><br/>
            <div id="attributesuploadbtn">
                <span>
                    <button class="olbtns" id="addattributes" v-on:click="toggleAttributes">Toggle Atributes</button><br/><br/>
                    <button class="olbtns" id="uploadkmlshp" v-on:click="showSummaryNConfirm">Confirm and Upload</button><br/><br/>
                </span>
            </div>
            <div>{{ uploadStatusMsg }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

import mapLoader from '../composables/mapLoader';
import featureUploader from '../composables/featureUploader';

export default defineComponent({
    setup() {
        const store = useStore();

        const { loadKML, discardKMLIfany } = mapLoader();
        const { uploadKMLFeature } = featureUploader();

        const uploadStatusMsg = computed(() => store.getters.getUploadStatusMsg)

        const kmlfileEl = ref();
        const shapefileEl = ref();
        const kmlfilename = ref('');
        const shapefilename = ref('');

        const variablerefs = { uploadStatusMsg, kmlfileEl, shapefileEl, kmlfilename, shapefilename, };

        const kmlchange = () => {
            
            let file = kmlfileEl.value.files[0];
            if (file) {
                kmlfilename.value = file.name;
                let reader = new FileReader();
                reader.onload = function () {
                    
                    loadKML(reader.result);
                }
                reader.readAsText(file);
            }
        }

        const shpchange = () => {
            
        }

        const discardKML = () => {
            discardKMLIfany();
            kmlfilename.value = '';
            kmlfileEl.value.value = '';
        }

        const discardSHP = () => {
            // discardKMLIfany();
            // shapefilename.value = '';
            // shapefileEl.value.value = '';
        }

        const toggleAttributes = () => {
            const showAttributesContainer = store.getters.getAttributesContainerStatus;
            store.dispatch('setAttributesContainerStatus', !showAttributesContainer);
            store.dispatch('setSummaryContainerStatus', false);
        }

        const showSummaryNConfirm = () => {
            console.log('camer here');
            store.dispatch('setAttributesContainerStatus', false);
            store.dispatch('setSummaryContainerStatus', true);
            // console.log(2);
            // let username = store.getters.getUserName;
            // let password = store.getters.getPassWord;
            // let attributesInfo = store.getters.getAttributesInfo;

            // console.log(username, password, attributesInfo);

            // // let url = '';
            // uploadKMLFeature(username, password, attributesInfo)
        }

        const functionrefs = { kmlchange, shpchange, discardKML, discardSHP, toggleAttributes, showSummaryNConfirm }

        return { ...variablerefs, ...functionrefs }
    },
})
</script>
