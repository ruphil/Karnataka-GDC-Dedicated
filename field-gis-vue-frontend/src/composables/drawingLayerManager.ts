import { getCurrentInstance } from "@vue/runtime-core";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import {Draw, Modify, Snap} from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';

import { v4 as uuidv4 } from 'uuid';

const drawingLayerManager = () => {
    const app = getCurrentInstance()!;

    const drawNewLayer = (nameid: any) => {
        let name = 'Layer_' + nameid;

        var source = new VectorSource();
        var vectorlyr = new VectorLayer({
            source: source,
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
              }),
              stroke: new Stroke({
                color: '#ffcc33',
                width: 2,
              }),
              image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                  color: '#ffcc33',
                }),
              }),
            }),
        });

        const map = app.appContext.config.globalProperties.$map;
        let uniqueID = uuidv4();
        vectorlyr.set('lyrid', uniqueID);

        // map.addLayer(vectorlyr);

        let draw;
        let snap;
        let modify = new Modify({source: source});
        map.addInteraction(modify);
        
        draw = new Draw({
            source: source,
            type: GeometryType.POLYGON,
        });
        
        map.addInteraction(draw);
        snap = new Snap({source: source});
        map.addInteraction(snap);
    }

    return { drawNewLayer }
}

export default drawingLayerManager;