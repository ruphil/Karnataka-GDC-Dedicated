import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import store from '@/store';

const mapLoader = () => {
    const loadBaseMapToExtent = () => {
        unloadBaseMap();

        const map = store.getters.getMapObj;

        let extent = map.getView().calculateExtent();

        const baseMapLayer = new TileLayer({
            // extent: transformExtent([73.50, 11.00, 79, 19.00], 'EPSG:4326', 'EPSG:3857'),
            extent,
            source: new XYZ({
                url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
            }),
            zIndex: 0
        });

        baseMapLayer.set('name', 'basemap');

        map.addLayer(baseMapLayer);
    }

    const unloadBaseMap = () => {
        const map = store.getters.getMapObj;

        map.getLayers().forEach(function (layer: any) {
            if (layer.get('name') != undefined && layer.get('name') === 'basemap') {
                map.removeLayer(layer);
            }
        });
    }

    return { loadBaseMapToExtent, unloadBaseMap }
}

export default mapLoader;