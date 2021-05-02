<template>
  <div id="map">
    <div ref="mapref" id="mapview"></div>
    <div id="controllercontainer"><Controller /></div>
  </div>
</template>

<script lang="ts">
import Controller from './components/Controller.vue';
import mapStyler from './composables/mapStyler';

import 'ol/ol.css';
import './App.scss';

import { defineComponent, ref, onMounted } from 'vue';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';

export default defineComponent({
  name: 'App',
  components: {
    Controller
  },
  setup() {
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
            'outputFormat=application/json&srsname=EPSG:3857&' +
            'bbox=' +
            extent.join(',') +
            ',EPSG:3857'
          );
        },
        strategy: bboxStrategy,
      }),
      style: districtStyleFunction
    });

    // const layers = 

    const initMap = () => {
      document.title = 'KGDC Flights Manager'
      new Map({
        target: mapref.value!,
        layers: [ baseMapLayer, karndistbounds ],
        view: new View({
          zoom: 6.5,
          center: fromLonLat([76.56, 14.85]),
          constrainResolution: true
        }),
      })
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