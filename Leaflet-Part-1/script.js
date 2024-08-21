// Initialize the map
const map = L.map('map').setView([37.7749, -122.4194], 5); // Center on the US

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Earthquake data URL
const earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch the earthquake data
fetch(earthquakeUrl)
  .then(response => response.json())
  .then(data => {
    // Function to determine marker color based on depth
    function getColor(depth) {
      return depth > 90 ? '#FF0000' :
             depth > 70 ? '#FF4500' :
             depth > 50 ? '#FFA500' :
             depth > 30 ? '#FFD700' :
             depth > 10 ? '#ADFF2F' :
                          '#00FF00';
    }

    // Function to create markers
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3>
                       <hr>
                       <p>Location: ${feature.properties.place}</p>
                       <p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }

    // Create a GeoJSON layer and add it to the map
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 2, // Adjust radius
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: onEachFeature
    }).addTo(map);

    // Add a legend
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      const depths = [0, 10, 30, 50, 70, 90];
      const labels = [];

      for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(map);
  })
  .catch(error => console.error('Error fetching earthquake data:', error));
