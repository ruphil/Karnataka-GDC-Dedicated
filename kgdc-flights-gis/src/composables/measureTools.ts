import store from "@/store";
import 'ol/ol.css';
import Draw from 'ol/interaction/Draw';
import Overlay from 'ol/Overlay';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {LineString, Polygon} from 'ol/geom';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import {getArea, getLength} from 'ol/sphere';
import {unByKey} from 'ol/Observable';
import GeometryType from "ol/geom/GeometryType";
import OverlayPositioning from "ol/OverlayPositioning";

const measureTools = () => {
    let draw: any; // global so we can remove it later
    let source = new VectorSource();

    const enableMeasureTool = (drawType: any) => {
        const map = store.getters.getMapObj;

        let measureTooltipElement: any;
        let measureTooltip: Overlay;
        let helpTooltipElement: any;
        let helpTooltip: Overlay;
        let sketch: any;
        let continuePolygonMsg = 'Click to continue drawing the polygon';
        let continueLineMsg = 'Click to continue drawing the line';

        const createHelpTooltip = () => {
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }

            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'ol-tooltip hidden';
            helpTooltip = new Overlay({
                element: helpTooltipElement,
                offset: [15, 0],
                positioning: OverlayPositioning.CENTER_LEFT,
            });

            map.addOverlay(helpTooltip);
        }

        const createMeasureTooltip = () => {
            if (measureTooltipElement) {
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
            }

            measureTooltipElement = document.createElement('div');
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
            measureTooltip = new Overlay({
                element: measureTooltipElement,
                offset: [0, -15],
                positioning: OverlayPositioning.BOTTOM_CENTER,
            });

            map.addOverlay(measureTooltip);
        }

        const pointerMoveHandler = (evt: any) => {

            if (evt.dragging) {
                return;
            }

            let helpMsg = 'Click to start drawing';
            
            if (sketch) {
                var geom = sketch.getGeometry();
                if (geom instanceof Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof LineString) {
                    helpMsg = continueLineMsg;
                }
            }
            
            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);
            
            helpTooltipElement.classList.remove('hidden');
        }

        createMeasureTooltip();
        createHelpTooltip();

        let vector = new VectorLayer({
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
  
        map.on('pointermove', pointerMoveHandler);
          
        map.getViewport().addEventListener('mouseout', function () {
            helpTooltipElement.classList.add('hidden');
        });
          
        let formatLength = (line: any) => {
            let length = getLength(line);
            let output;
            if (length > 100) {
                output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
            } else {
                output = Math.round(length * 100) / 100 + ' ' + 'm';
            }
            return output;
        };
        
        let formatArea = (polygon: any) => {
            let area = getArea(polygon);
            let output;
            if (area > 10000) {
                output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
            } else {
                output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
            }
            return output;
        };
        
        let addInteraction = () => {
            draw = new Draw({
                source: source,
                type: drawType,
                style: new Style({
                    fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                    }),
                    stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineDash: [10, 10],
                        width: 2,
                    }),
                    image: new CircleStyle({
                        radius: 5,
                        stroke: new Stroke({
                        color: 'rgba(0, 0, 0, 0.7)',
                        }),
                        fill: new Fill({
                        color: 'rgba(255, 255, 255, 0.2)',
                        }),
                    }),
                }),
            });

            map.addInteraction(draw);
        
            let listener: any;
            draw.on('drawstart', function (evt: any) {
                sketch = evt.feature;
            
                let tooltipCoord = evt.coordinate;
            
                listener = sketch.getGeometry().on('change', function (evt: any) {
                    var geom = evt.target;
                    var output;
                    if (geom instanceof Polygon) {
                        output = formatArea(geom);
                        tooltipCoord = geom.getInteriorPoint().getCoordinates();
                    } else if (geom instanceof LineString) {
                        output = formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                    }
                    
                    measureTooltipElement.innerHTML = output;
                    measureTooltip.setPosition(tooltipCoord);
                });
            });
        
            draw.on('drawend', function () {
                measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
                measureTooltip.setOffset([0, -7]);
                // unset sketch
                sketch = null;
                // unset tooltip so that a new one can be created
                measureTooltipElement = null;
                createMeasureTooltip();
                unByKey(listener);
            });
        }

        map.addLayer(vector);
        addInteraction();
    }

    const disableMeasureTool = () => {
        const map = store.getters.getMapObj;
        map.getInteractions().pop();

        source.clear();

        map.getOverlays().clear();
    }
    
    const toggleLineMeasure = () => {
        const lineMeasureEnabled = store.getters.getLineMeasureEnabled;

        if(!lineMeasureEnabled){
            disableMeasureTool();
            console.log('Enabling Line Measure');
            enableMeasureTool(GeometryType.LINE_STRING);
            store.dispatch('setLineMeasureEnabled', true);
            store.dispatch('setAreaMeasureEnabled', false);
        } else {
            console.log('Disabling Line Measure');
            disableMeasureTool();
            store.dispatch('setLineMeasureEnabled', false);
        }
    }

    const toggleAreaMeasure = () => {
        const areaMeasureEnabled = store.getters.getAreaMeasureEnabled;

        if(!areaMeasureEnabled){
            disableMeasureTool();
            console.log('Enabling Area Measure');
            enableMeasureTool(GeometryType.POLYGON);
            store.dispatch('setAreaMeasureEnabled', true);
            store.dispatch('setLineMeasureEnabled', false);
        } else {
            console.log('Disabling Area Measure');
            disableMeasureTool();
            store.dispatch('setAreaMeasureEnabled', false);
        }
    }

    return { toggleLineMeasure, toggleAreaMeasure }
}

export default measureTools;