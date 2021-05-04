<template>
    <div ref="mapref" id="mapview"></div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import 'ol/ol.css';

import { defineComponent, ref, onMounted } from 'vue';
import mapLoader from '../composables/mapLoader';

export default defineComponent({
    setup() {
        const store = useStore();
        const mapref = ref(null);
        const { initBaseMap, fetchNLoadDroneNumbers } = mapLoader();

        const initMap = () => {
            document.title = 'KGDC Flights Manager';
            initBaseMap(mapref.value);
            fetchNLoadDroneNumbers();
        }

        onMounted(initMap);

        return { mapref }
    },
})
</script>