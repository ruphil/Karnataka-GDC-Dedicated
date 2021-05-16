import { getCurrentInstance } from "@vue/runtime-core";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import {Draw, Modify, Snap} from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';

import { v4 as uuidv4 } from 'uuid';

const interactionsManager = () => {
    const app = getCurrentInstance()!;

    const drawNewLayer = (nameid: any) => {
        const map = app.appContext.config.globalProperties.$map;
        
        let lyrname = 'Feature_' + nameid;

        let source = new VectorSource({ wrapX: false });
        let vectorlyr = new VectorLayer({
          source: source,
        });
        
        let uniqueID = uuidv4();
        vectorlyr.set('lyrid', uniqueID);

        map.addLayer(vectorlyr);

        let draw = new Draw({
          source: source,
          type: GeometryType.POLYGON,
        });

        draw.on('drawstart', () => {
          source.clear();
        });
        
        map.addInteraction(draw);

        let modify = new Modify({source: source});
        map.addInteraction(modify);

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