import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

import { Draw } from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import GeoJSON from 'ol/format/GeoJSON';

import { v4 as uuidv4 } from 'uuid';

import store from "@/store";

const interactionsManager = () => {
    const drawNewLayer = () => {
    
      const map = store.getters.getMapObj;

      const featuresCount = store.getters.getFeaturesCounter;
      let featurename = 'Feature_' + (featuresCount + 1);

      let source = new VectorSource({ wrapX: false });
      let vectorlyr = new VectorLayer({ source, zIndex: 3 });

      let uniqueID = uuidv4();
      vectorlyr.set('lyrid', uniqueID);
      vectorlyr.set('name', 'featurelyr');

      map.addLayer(vectorlyr);

      let draw = new Draw({
        source: source,
        type: GeometryType.POLYGON,
      });

      draw.on('drawend', (event: any) => {
        map.getInteractions().pop();
        let featureGeometry = event.feature.getGeometry()
        
        const featuresData = store.getters.getFeaturesData;

        let newfeatGeom = new GeoJSON().writeGeometry(featureGeometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        
        console.log(newfeatGeom);

        let modFeaturesData = [
          ...featuresData,
          {
            featurename,
            lyrid: uniqueID,
            geom: newfeatGeom,
            attributes: {},
            uploaded: false
          }
        ]
        
        store.dispatch('setFeaturesData', modFeaturesData);
        store.dispatch('setFeatureCounter', featuresCount + 1);
      });
      
      map.addInteraction(draw);
    }

    return { drawNewLayer }
}

export default interactionsManager;