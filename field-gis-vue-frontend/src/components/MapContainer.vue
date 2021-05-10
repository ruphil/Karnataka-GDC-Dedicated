<template>
    <div ref="mapref" id="mapview"></div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { Map } from 'ol';

import baseMapLoader from '../composables/baseMapLoader';

import 'ol/ol.css';
import './MapContainer.scss';

export default defineComponent({
    setup() {
        const app = getCurrentInstance()!;
        const { initBaseMap } = baseMapLoader();

        const mapref = ref();

        const initBaseMapAfterElementLoaded = () => {
            app.appContext.config.globalProperties.$map = new Map({
                target: mapref.value
            });

            initBaseMap();
        }

        onMounted(() => {
            initBaseMapAfterElementLoaded();
        });

        return { mapref }
    },
})
</script>

