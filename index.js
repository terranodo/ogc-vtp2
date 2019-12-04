import 'ol/ol.css';
import View from 'ol/View';
import MVT from 'ol/format/MVT';
import VectorTileSource from 'ol/source/VectorTile';
import TileGrid from 'ol/tilegrid/TileGrid';

import olms from 'ol-mapbox-style';
import {defaultResolutions} from 'ol-mapbox-style/util';

// Match the server resolutions
var maxResolution = 360 / 512;
defaultResolutions.length = 14;
for (var i = 0; i < 14; ++i) {
  defaultResolutions[i] = maxResolution / Math.pow(2, i + 1);
}

olms('map', 'http://ogc-vtp.gospatial.org/maps/osm/style.json').then(function(map) {

  // Custom tile grid for the EPSG:4326 projection
  var tileGrid = new TileGrid({
    extent: [-180, -90, 180, 90],
    tileSize: 512,
    resolutions: defaultResolutions
  });

  var mapboxStyle = map.get('mapbox-style');

  // Replace the source with a EPSG:4326 projection source for each vector tile layer
  map.getLayers().forEach(function(layer) {
    var mapboxSource = layer.get('mapbox-source');
    if (mapboxSource && mapboxStyle.sources[mapboxSource].type === 'vector') {
      var source = layer.getSource();
      layer.setSource(new VectorTileSource({
        format: new MVT(),
        projection: 'EPSG:4326',
        urls: source.getUrls(),
        tileGrid: tileGrid
      }));
    }
  });

  // Configure the map with a view with EPSG:4326 projection
  map.setView(new View({
    projection: 'EPSG:4326',
    zoom: mapboxStyle.zoom,
    center: mapboxStyle.center
  }));

});
