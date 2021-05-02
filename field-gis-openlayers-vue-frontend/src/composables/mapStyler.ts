import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';

const mapStyler = () => {

  const districtStyleFunction = (feature: any) => {
    return [
      new Style({
        stroke: new Stroke({
          color: 'black',
          width: 2,
        }),
        text: new Text({
          font: '12px Calibri,sans-serif',
          fill: new Fill({ color: 'white' }),
          stroke: new Stroke({
            color: 'darkgreen', width: 10
          }),
          text: feature.get('kgisdist_1')
        })
      })
    ];
  }
  
  return { districtStyleFunction }
}

export default mapStyler