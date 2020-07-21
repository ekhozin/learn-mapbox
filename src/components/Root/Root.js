import React from 'react';
import mapboxgl from 'mapbox-gl';

import mapData from '../../data.json';
import styles from './styles.scss';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWtob3ppbiIsImEiOiJja2N1M3l2ajgweW9sMndwNDdnb2xlemE2In0.NoA7YivvjQr14zgTFZUQrA';

const optionsMap = {
  population: {
    name: 'Population',
    description: 'Estimated total population',
    property: 'pop_est',
    stops: [
      [0, '#f8d5cc'],
      [1000000, '#f4bfb6'],
      [5000000, '#f1a8a5'],
      [10000000, '#ee8f9a'],
      [50000000, '#ec739b'],
      [100000000, '#dd5ca8'],
      [250000000, '#c44cc0'],
      [500000000, '#9f43d7'],
      [1000000000, '#6e40e6'],
    ],
  },
  gdp: {
    name: 'GDP',
    description: 'Estimate total GDP in millions of dollars',
    property: 'gdp_md_est',
    stops: [
      [0, '#f8d5cc'],
      [1000, '#f4bfb6'],
      [5000, '#f1a8a5'],
      [10000, '#ee8f9a'],
      [50000, '#ec739b'],
      [100000, '#dd5ca8'],
      [250000, '#c44cc0'],
      [5000000, '#9f43d7'],
      [10000000, '#6e40e6'],
    ],
  },
};

function Root() {
  const containerElem = React.useRef(null);
  const mapInstance = React.useRef(null);

  const [mapState, setMapState] = React.useState({
    lng: 5,
    lat: 34,
    zoom: 2,
  });

  const [activeOption, setActiveOption] = React.useState('population');

  React.useEffect(() => {
    mapInstance.current = new mapboxgl.Map({
      container: containerElem.current,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [mapState.lng, mapState.lat],
      zoom: mapState.zoom,
      hash: true,
    });

    mapInstance.current.on('move', () => {
      setMapState({
        lng: mapInstance.current.getCenter().lng.toFixed(4),
        lat: mapInstance.current.getCenter().lat.toFixed(4),
        zoom: mapInstance.current.getZoom().toFixed(2),
      });
    });

    mapInstance.current.on('load', () => {
      mapInstance.current.addSource('countries', {
        type: 'geojson',
        data: mapData,
      });

      mapInstance.current.addLayer({
        id: 'countries',
        type: 'fill',
        source: 'countries',
      }, 'country-label-lg'); // ID metches `mapbox/streets-v9`

      setFill('population');
    });
  }, []);

  function setFill(option) {
    mapInstance.current.setPaintProperty('countries', 'fill-color', {
      property: optionsMap[option].property,
      stops:  optionsMap[option].stops,
    });
  }

  function handleChangeOption(option) {
    setActiveOption(option);
    setFill(option);
  }

  return (
    <div>
      <div>Longitude: {mapState.lng} | Latitude: {mapState.lat} | Zoom: {mapState.zoom}</div>
      <div>
        <div>
          <input
            checked={activeOption === 'population'}
            type='radio'
            name='display-data'
            value='population'
            onChange={() => handleChangeOption('population')}
          />
          Population
        </div>
        <div>
          <input
            checked={activeOption === 'gdp'}
            type='radio'
            name='display-data'
            value='gdp'
            onChange={() => handleChangeOption('gdp')}
          />
          GDP
        </div>
      </div>
      <div className={styles.MapContainer}>
        <div ref={containerElem} className={styles.MapContent}/>
      </div>
    </div>
  );
}

export { Root };
