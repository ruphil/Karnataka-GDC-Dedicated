<template>
    <div id="mapcontainer">
        <div ref="mapref" class="mapview"></div>
        <div id="popup" class="ol-popup" ref="popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content" ref="popcontent"></div>
        </div>
        <div class="latlon" ref="latlon"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { Map, Overlay } from 'ol';

import baseMapLoader from '../composables/baseMapLoader';

import 'ol/ol.css';
import './MapContainer.scss';
import { createStringXY, toStringHDMS } from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition';
import { toLonLat } from 'ol/proj';
import {defaults as defaultControls} from 'ol/control';

export default defineComponent({
    setup() {
        const app = getCurrentInstance()!;
        const { initBaseMap } = baseMapLoader();

        const mapref = ref();
        const popup = ref();
        const popcontent = ref();
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
            
            app.appContext.config.globalProperties.$map = new Map({
                target: mapref.value,
                overlays: [overlay],
                controls: defaultControls().extend([mousePositionControl]),
            });

            app.appContext.config.globalProperties.$map.on('singleclick', function (evt: any) {
                var coordinate = evt.coordinate;
                var hdms = toStringHDMS(toLonLat(coordinate));

                popcontent.value.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
                overlay.setPosition(coordinate);
            });

            // map.on('click', function(event: any) {
            //     map.forEachFeatureAtPixel(event.pixel, function(feature: any, layer: any) {
            //         let attributes = feature.getProperties();
            //         console.log(attributes);
            //     });
            // });

            initBaseMap();
            resetMapLayers();
        }

        onMounted(() => {
            initBaseMapAfterElementLoaded();
        });

        return { mapref, popup, popcontent, latlon }
    },
})
</script>

