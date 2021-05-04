<template>
    <div ref="mapref" id="mapview"></div>
</template>

<script lang="ts">


import { defineComponent, ref, onMounted } from 'vue';
import mapLoader from '../composables/mapLoader';

export default defineComponent({
    setup() {
        const mapref = ref(null);
        const { initBaseMap } = mapLoader();

        const initMap = () => {
            document.title = 'KGDC Flights Manager';
            initBaseMap(mapref.value);
        }

        onMounted(initMap);

        return { mapref }
    },
})
</script>