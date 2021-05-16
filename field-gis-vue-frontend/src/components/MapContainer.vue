<template>
    <div id="mapcontainer">
        <div ref="mapref" class="mapview"></div>
        <div class="attributestogglecontainer" v-show="!showAttributesTable" title="Attributes Table">
            <button class="toggleattributes" v-on:click="showAttributesTable = !showAttributesTable">
                <span class="material-icons-outlined">description</span>
            </button>
        </div>
        <div class="attributeswindow" v-show="showAttributesTable">
            <div class="attributestable">
                <div class="attributesrow" v-for="(value, name, index) in attributesData" v-bind:key="index">
                    <div class="key">{{ name }}</div>
                    <div class="value">{{ value }}</div>
                </div>
            </div>
            <button class="closeattributeswindow" v-on:click="showAttributesTable = !showAttributesTable"><span class="material-icons-outlined">close</span></button>
        </div>
        <div class="latlon" ref="latlon"></div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { Map, Overlay } from 'ol';
import { createStringXY, toStringHDMS } from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition';
import {defaults as defaultControls} from 'ol/control';

import karnBoundsLoader from '../composables/karnBoundsLoader';

import 'ol/ol.css';
import './MapContainer.scss';
import store from '@/store';


export default defineComponent({
    setup() {
        const app = getCurrentInstance()!;
        const { loadKarnBounds } = karnBoundsLoader();

        const mapref = ref();
        const popup = ref();
        const latlon = ref();

        const attributesData = computed(() => store.getters.getAttributesData);
        const showAttributesTable = ref(false);

        const resetMapLayers = () => {
            app.appContext.config.globalProperties.$villagesBounds = null;
        }

        const loadKarnBoundaryAfterElementLoaded = () => {
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

            // map

            map.on('click', function(event: any) {
                map.forEachFeatureAtPixel(event.pixel, function(feature: any, layer: any) {
                    let attributesData = { ...feature.getProperties() };
                    delete attributesData['geometry'];

                    store.dispatch('setAttributesData', attributesData);
                });
            });

            app.appContext.config.globalProperties.$map = map;

            loadKarnBounds();
            resetMapLayers();
        }

        onMounted(() => {
            loadKarnBoundaryAfterElementLoaded();
        });

        return { mapref, popup, attributesData, showAttributesTable, latlon }
    },
})
</script>

