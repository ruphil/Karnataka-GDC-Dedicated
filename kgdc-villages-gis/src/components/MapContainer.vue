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
            <button class="closeattributeswindow" v-on:click="showAttributesTable = false"><span class="material-icons-outlined">close</span></button>
        </div>
        <div class="latlon" ref="latlon"></div>
        <div class="currentvillage">Current Village: {{ currentVillage }}</div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { Map, Overlay } from 'ol';
import { createStringXY, toStringHDMS } from 'ol/coordinate';
import MousePosition from 'ol/control/MousePosition';
import {defaults as defaultControls} from 'ol/control';
import 'ol/ol.css';
import './MapContainer.scss';
import store from '@/store';
import setMapToVuex from '../composables/setMapToVuex';
import karnBoundsLoader from '../composables/karnBoundsLoader';
import globalToast from '../composables/globalToast';

export default defineComponent({
    setup() {
        const { setMapObjectToVeux } = setMapToVuex();
        const { loadKarnBounds } = karnBoundsLoader();
        const { showGlobalToast } = globalToast();

        const mapref = ref();
        const popup = ref();
        const latlon = ref();
        
        const showAttributesTable = ref(false);

        const attributesData = computed(() => store.getters.getAttributesData);
        const currentVillage = computed(() => store.getters.getCurrentVillage);

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

            map.on('click', function(event: any) {
                map.forEachFeatureAtPixel(event.pixel, function(feature: any, layer: any) {
                    let attributesData = { ...feature.getProperties() };
                    delete attributesData['geometry'];
                    try {
                        if(layer.get('loadedfromserver') == 'yes'){
                            store.dispatch('setAttributesData', attributesData);
                        }

                        if(layer.get('loadedfromserver') == 'yes' && layer.get('name') == 'villageslyr'){
                            store.dispatch('setCurrentVillage', attributesData['kgisvill_2']);
                            store.dispatch('setUniqueVillageCode', attributesData['uniquevill']);
                            store.dispatch('setAttributesData', attributesData);
                        } else {
                            showGlobalToast('Load Villages Layer First');
                        }
                    } catch (e) {}
                });
            });
            
            setMapObjectToVeux(map)
            .then(() => {
                loadKarnBounds();
            })
            .catch(() => {
                console.log('Error Setting Map Object');
            });
        }

        onMounted(() => {
            loadKarnBoundaryAfterElementLoaded();
        });

        return { mapref, popup, attributesData, showAttributesTable, latlon, currentVillage }
    },
})
</script>