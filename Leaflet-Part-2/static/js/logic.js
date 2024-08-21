// Initialize the map
const map = L.map('map').setView([37.7749, -122.4194], 5); // Center on the US

// Define base map layers
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

const satelliteMap = L.tileLayer('https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://maps.stamen.com">Stamen Design</a>'
});

const watercolorMap = L.tileLayer('https://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
  attribution: '&copy; <a href="http://maps.stamen.com">Stamen Design</a>'
});

// Add default base layer
streetMap.addTo(map);

// Define overlay layers (your existing layers)
const earthquakeLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: feature.properties.mag * 2,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  },
  onEachFeature: onEachFeature
});

const tectonicPlatesLayer = L.geoJson(null, {
  style: {
    color: "#ff6600",
    weight: 2
  }
});

// Fetch data and add to the map
Promise.all([
  fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(response => response.json()),
  fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json').then(response => response.json())
]).then(([earthquakeData, platesData]) => {
  earthquakeLayer.addData(earthquakeData);
  tectonicPlatesLayer.addData(platesData);

  // Add overlay layers to map
  earthquakeLayer.addTo(map);
  tectonicPlatesLayer.addTo(map);
}).catch(error => console.error('Error fetching data:', error));

// Add layer controls
const baseMaps = {
  "Street Map": streetMap,
  "Satellite": satelliteMap,
  "Watercolor": watercolorMap
};

const overlays = {
  "Earthquakes": earthquakeLayer,
  "Tectonic Plates": tectonicPlatesLayer
};

L.control.layers(baseMaps, overlays).addTo(map);

