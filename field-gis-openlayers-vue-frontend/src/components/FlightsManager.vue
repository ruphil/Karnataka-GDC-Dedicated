<template>
    <div>
        <div id="fileslistholder">
            <div id="fileslist">
                J
            </div>
            <div id="filesaddbtnscontainer">
                <input id="flightlinekml" type="file" style="display:none;" />
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
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        
    },
})
</script>
