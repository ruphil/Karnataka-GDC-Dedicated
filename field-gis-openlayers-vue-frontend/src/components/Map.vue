<template>
  <div id="map">
    <div ref="mapref" id="mapview"></div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import mapStyler from '../composables/mapStyler';

import 'ol/ol.css';

import { defineComponent, ref, onMounted, computed } from 'vue';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import BaseLayer from 'ol/layer/Base';

export default defineComponent({
    setup() {
        const store = useStore();
        const { districtStyleFunction } = mapStyler();

        const mapref = ref(null);

        const baseMapLayer = new TileLayer({
        source: new XYZ({
            url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
        })
        });

        const karndistbounds = new VectorLayer({
        source: new VectorSource({
            format: new GeoJSON(),
            url: function (extent) {
                return (
                    'http://localhost:8080/geoserver/kgdc/ows?service=WFS&' +
                    'version=1.0.0&request=GetFeature&typeName=kgdc:karndistbounds&' +
                    'outputFormat=application/json&srsname=EPSG:32643&' +
                    'bbox=' +
                    extent.join(',') +
                    ',EPSG:32643'
                );
            },
            strategy: bboxStrategy,
            }),
            style: districtStyleFunction
        });

        // const layers = computed(() => {
        //     if (store.getters.getLoggedInStatus){
        //         return [ baseMapLayer, karndistbounds ]
        //     } else {
        //         return 
        //     }
        // });

        const initMap = () => {
            document.title = 'KGDC Flights Manager'
            let map = new Map({
                target: mapref.value!,
                layers: [ baseMapLayer ],
                view: new View({
                    zoom: 6.5,
                    center: fromLonLat([76.56, 14.85]),
                    constrainResolution: true
                }),
            });

            store.dispatch('setMapObj', map);
            store.dispatch('setMapObj', map);
        }

        onMounted(initMap);

        const jack = () => {
            console.log(mapref);
            console.log(mapref.value);
        }

        return { mapref, jack }
    },
})
</script>