<template>
    <div id="mapcontainer">
        <div ref="mapref" class="mapview"></div>
        <div class="attributespopup" ref="popup">
            <button>X</button>
            <div class="attributestable">
                jack
            </div>
        </div>
        <div class="latlon" ref="latlon"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { Map, Overlay } from 'ol';
import { createStringXY, toStringHDMS } from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition';
import {defaults as defaultControls} from 'ol/control';

import baseMapLoader from '../composables/baseMapLoader';

import 'ol/ol.css';
import './MapContainer.scss';


export default defineComponent({
    setup() {
        const app = getCurrentInstance()!;
        const { initBaseMap } = baseMapLoader();

        const mapref = ref();
        const popup = ref();
        const attributes = ref([]);
        const latlon = ref();

        const resetMapLayers = () => {
            app.appContext.config.globalProperties.$karndistbounds = null;
            app.appContext.config.globalProperties.$villagesBounds = null;
        }

        const initBaseMapAfterElementLoaded = () => {
            const overlay = new Overlay({
                element: popup.value,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250,
                },
            });

            const mousePositionControl = new MousePosition({
                coordinateFormat: createStringXY(6),
                projection: 'EPSG:4326',
                target: latlon.value,
                undefinedHTML: '&nbsp;',
            });
            
            const map = new Map({
                target: mapref.value,
                overlays: [overlay],
                controls: defaultControls().extend([mousePositionControl]),
            });

            map.on('singleclick', function(event: any) {
                let coordinate = event.coordinate;
                map.forEachFeatureAtPixel(event.pixel, function(feature: any, layer: any) {
                    let attributes = feature.getProperties();
                    console.log(attributes);

                    
                });

                overlay.setPosition(coordinate);
            });

            app.appContext.config.globalProperties.$map = map;

            initBaseMap();
            resetMapLayers();
        }

        onMounted(() => {
            initBaseMapAfterElementLoaded();
        });

        return { mapref, popup, attributes, latlon }
    },
})
</script>

