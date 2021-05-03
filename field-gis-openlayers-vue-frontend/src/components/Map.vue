<template>
    <div ref="mapref" id="mapview"></div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import 'ol/ol.css';

import { getCurrentInstance, defineComponent, ref, onMounted } from 'vue';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';

export default defineComponent({
    setup() {
        const app = getCurrentInstance()!;
        const store = useStore();
        
        const mapref = ref(null);

        const baseMapLayer = new TileLayer({
            source: new XYZ({
                url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}'
            })
        });

        const initMap = () => {
            document.title = 'KGDC Flights Manager'
            const mapObj = new Map({
                target: mapref.value!,
                layers: [ baseMapLayer ],
                view: new View({
                    // zoom: 6.5,
                    zoom: 0,
                    center: fromLonLat([0, 0]),
                    // center: fromLonLat([76.56, 14.85]),
                    constrainResolution: true
                }),
            });

            const foo = app.appContext.config.globalProperties.$foo

            console.log(foo);

            app.appContext.config.globalProperties.$foo = 'micky';
            console.log(app.appContext.config.globalProperties.$foo);

            store.dispatch('setMapObj', mapObj);
            // store.dispatch('addMapLayersObj', {
            //     'basemap': baseMapLayer
            // });
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