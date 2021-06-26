import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import {Draw, Modify, Snap} from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';

import { v4 as uuidv4 } from 'uuid';
import store from "@/store";

const interactionsManager = () => {
    const drawNewLayer = (nameid: any) => {
        let map = store.getters.getMapObj;

        let lyrname = 'Feature_' + nameid;

        let source = new VectorSource({ wrapX: false });
        let vectorlyr = new VectorLayer({ source });

        let uniqueID = uuidv4();
        vectorlyr.set('lyrid', uniqueID);

        map.addLayer(vectorlyr);

        let draw = new Draw({
          source: source,
          type: GeometryType.POLYGON,
        });

        draw.on('drawend', (event: any) => {
          map.getInteractions().pop();
          setTimeout(() => {
            // try{
              source.addFeature(event.feature);  
            // } catch (e) {}
          }, 500);
        });
        
        map.addInteraction(draw);

        return {
          id: uniqueID,
          validgeometry: true,
          filename: lyrname,
          validattributes: false,
          layer: vectorlyr,
          attributes: {}
        }
        
    }

    return { drawNewLayer }
}

export default interactionsManager;