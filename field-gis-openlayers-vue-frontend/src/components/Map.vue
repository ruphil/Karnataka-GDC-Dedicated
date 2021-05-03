<template>
    <div ref="mapref" id="mapview"></div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import 'ol/ol.css';

import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
    setup() {
        const store = useStore();
        const mapref = ref(null);

        const initMap = () => {
            document.title = 'KGDC Flights Manager';
            store.dispatch('setMapElement', mapref.value);
            console.log(store.getters.getMapElement);
        }

        onMounted(initMap);

        return { mapref }
    },
})
</script>