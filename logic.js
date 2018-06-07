// create function for radius of markers 
function getRadius(marker) {
    return marker * 30000
  };
  
  // create function for colors of markers based on magnitude
  function getColor(marker) {
    switch(true) {
      case marker > 5 : 
        return "#ff0000";
      case marker > 4 :
        return "#ff4000";
      case marker > 3 :
        return "#ff8000";
      case marker > 2 :
        return "#ffbf00";
      case marker > 1 :
        return "#ffff00";
      case marker > 0 :
        return "#00ff00";
      default:
        return "#000"
    }
  }
  
  // store json in variable
  var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  
  // perform get request to url
  d3.json(queryURL, function(data) {
    // send data.features to createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
    // create function that displays place, time, and magnitude as popup
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" +new Date(feature.properties.time) +
            "</p><p> Magnitude: " + feature.properties.mag + "</p>")
    };
  
    // create function that displays marker with corresponding radius/color
    function pointToLayer(feature, latlng) {
        return new L.circle(latlng, {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            color: "black",
            weight: 0.5,
            opacity: 1,
            fillOpacity: 0.8,
        })
    };
  
    // create GeoJSON layer that contains features on earthquakeData object
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
        });
    // send earthquake layer to createMap function
    createMap(earthquakes);
  };
  
  function createMap(earthquakes) {
    //define light layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidmljdG9yaWFsYW0iLCJhIjoiY2podjRhYWZwMHZpbDN2cWh5MmM1YmxuNSJ9." +
    "P9FfhMVL32NHDZaRKFP5pw"
    );
  
    // define streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoidmljdG9yaWFsYW0iLCJhIjoiY2podjRhYWZwMHZpbDN2cWh5MmM1YmxuNSJ9." +
    "P9FfhMVL32NHDZaRKFP5pw"
    );
  
    // define baseMaps object to hold base layers
    var baseMaps = {
        "Light Map": lightmap,
        "Streep Map": streetmap
    };
  
    // create overlayMaps object to hold overlay layers
    var overlayMaps = {
        Earthquakes: earthquakes
    };
  
    // create map with streetmap and earthquake layer displayed on load
    var map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [lightmap, earthquakes]
    });
  
    // create layer control, add to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
  };