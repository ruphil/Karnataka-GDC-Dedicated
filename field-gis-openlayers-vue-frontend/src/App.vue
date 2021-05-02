<template>
  <div id="map">
    <div ref="mapref" id="mapview"></div>
    <div id="controllercontainer"><Controller /></div>
  </div>
</template>

<script lang="ts">
import 'ol/ol.css';
import './App.scss';

import { defineComponent, ref, onMounted } from 'vue';

import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';

import Controller from './components/Controller.vue';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

export default defineComponent({
  name: 'App',
  components: {
    Controller
  },
  setup() {
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
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 0, 255, 1.0)',
          width: 2,
        }),
      }),
    });

    const initMap = () => {
      new Map({
        target: mapref.value!,
        layers: [ baseMapLayer, karndistbounds ],
        view: new View({
          zoom: 7,
          center: fromLonLat([77.5593125, 14.3882808]),
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