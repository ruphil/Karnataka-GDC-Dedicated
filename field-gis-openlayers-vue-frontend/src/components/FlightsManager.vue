<template>
    <div>
        <div id="fileslistholder">
            <div id="fileslist">
                J
            </div>
            <div id="filesaddbtnscontainer">
                <input id="flightlinekml" type="file" style="display:none;" v-on:change="kmlchange"/>
                <input id="shapefiles" type="file" style="display:none;" />
                <span>
                    <button class="olbtns" id="kmladdbtn" onclick="document.getElementById('flightlinekml').click();">+ KML</button>
                    <button class="olbtns" id="shapesaddbtn" onclick="document.getElementById('shapefiles').click();">+ Shape</button>
                </span>
            </div>
        </div>
        <!-- <span>Add Flightline KML:</span><br/>
        <input type="file" /> -->
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { defineComponent, ref } from 'vue';
import mapLoader from '../composables/mapLoader';

export default defineComponent({
    setup() {
        const store = useStore();
        const { loadKML } = mapLoader();

        const kmlfile = ref(null);
        const shapefile = ref(null);

        const kmlchange = (e: any) => {
            console.log(e.target.files[0]);
            let file = e.target.files[0];
            if (file) {

                let reader = new FileReader();
                reader.onload = function () {
                    
                    loadKML(reader.result);

                }
                reader.readAsText(file);

            }
        }

        return { kmlchange }
    },
})
</script>
