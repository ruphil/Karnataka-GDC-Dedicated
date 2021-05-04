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
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import mapLoader from '../composables/mapLoader';

export default defineComponent({
    setup() {
        const { loadKML, discardKMLIfany } = mapLoader();

        const kmlfileEl = ref();
        const shapefileEl = ref();
        const kmlfilename = ref('');
        const shapefilename = ref('');

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

        const shpchange = (e: any) => {
            console.log(e.target.files[0]);
            let file = e.target.files[0];
            
            if (file) {
                kmlfilename.value = file.name;
                let reader = new FileReader();
                reader.onload = function () {
                    loadKML(reader.result);
                }
                reader.readAsText(file);
            }
        }

        const discardKML = () => {
            discardKMLIfany();
            kmlfilename.value = '';
            kmlfileEl.value = null;
        }

        const discardSHP = () => {
            discardKMLIfany();
            shapefilename.value = '';
            shapefileEl.value = null;
        }

        return { kmlfileEl, shapefileEl, kmlfilename, shapefilename, kmlchange, shpchange, discardKML, discardSHP }
    },
})
</script>
