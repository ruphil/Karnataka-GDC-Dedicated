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
        <div class="currentvillage">Current Abadi: {{ currentAbadi }} ({{ currentVillage }})</div>
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
import store from '@/shared/store';

import setMapToVuex from '@/shared/composables/setMapToVuex';
import karnBoundsLoader from '@/shared/composables/karnBoundsLoader';
import globalToast from '@/shared/composables/globalToast';

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
        const currentAbadi = computed(() => store.getters.getCurrentAbadiLimit);

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
                        if(layer.get('loadedfromserver') == 'yes' && layer.get('name') == 'karnboundary'){
                            store.dispatch('setAttributesData', attributesData);
                        }

                        if(layer.get('loadedfromserver') == 'yes' && layer.get('name') == 'villageslyr'){
                            // console.log(attributesData);
                            resetFewThings()
                            .then(() => {
                                store.dispatch('setCurrentVillage', attributesData['kgisvill_2']);
                                store.dispatch('setUniqueVillageCode', attributesData['uniquevill']);

                                let villagedetails = {
                                    district: attributesData['kgisdist_1'],
                                    taluk: attributesData['kgistalukn'],
                                    gp: attributesData['lgdgpname'],
                                }

                                store.dispatch('setCurrentVillageDetails', villagedetails);  
                            });
                        }

                        if(layer.get('loadedfromserver') == 'yes' && layer.get('name') == 'abadilimits'){
                            console.log(attributesData);
                            resetFewThings()
                            .then(() => {
                                store.dispatch('setCurrentAbadiLimit', attributesData['abadilimitname']);
                                store.dispatch('setCurrentAbadiUUID', attributesData['abadilimituuid']);    
                            });
                        }

                        if(!store.getters.getVillagesBoundsLoaded && !store.getters.getAbadiLimitsLoaded){
                            showGlobalToast('Load Villages Layer and Abadi Limits First');
                        }
                    } catch (e) {}
                });
            });

            const resetFewThings = () => {
                return new Promise((resolve: any, reject: any) => {
                    store.dispatch('setFilesList', []);
                    store.dispatch('setCurrentAbadiLimit', 'None Selected');
                    store.dispatch('setCurrentAbadiUUID', '');
                    resolve('success');
                });
            }
            
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

        return { mapref, popup, attributesData, showAttributesTable, latlon, currentVillage, currentAbadi }
    },
})
</script>